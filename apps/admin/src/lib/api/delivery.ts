import { apiClient, uploadFile } from "./client";

// ============================================
// TYPES
// ============================================

export interface Wilaya {
  id: string;
  code: number;
  name: string;
  name_ar: string;
  home_shipping_price: number;
  stopdesk_shipping_price: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Commune {
  id: string;
  code: number;
  name: string;
  name_ar: string;
  daira: string;
  daira_ar: string;
  wilaya_id: string;
  wilaya?: Wilaya;
  created_at?: string;
  updated_at?: string;
}

export interface ImportResponse {
  success: boolean;
  message: string;
  count: number;
  total: number;
  errors?: string[];
}

// ============================================
// WILAYAS - Version optimisée avec cache
// ============================================

let wilayasCache: Wilaya[] | null = null;

/**
 * Récupérer toutes les wilayas avec cache
 */
export async function getWilayas(useCache = true): Promise<Wilaya[]> {
  if (useCache && wilayasCache) {
    return wilayasCache;
  }
  
  try {
    const data = await apiClient<Wilaya[]>("/wilayas/");
    wilayasCache = data;
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des wilayas:", error);
    return [];
  }
}

/**
 * Récupérer une wilaya par son code
 */
export async function getWilayaByCode(code: number): Promise<Wilaya | null> {
  const wilayas = await getWilayas();
  return wilayas.find((w) => w.code === code) || null;
}

/**
 * Créer une wilaya
 */
export async function createWilaya(data: {
  code: number;
  name: string;
  name_ar: string;
  home_shipping_price?: number;
  stopdesk_shipping_price?: number;
  is_active?: boolean;
}): Promise<Wilaya> {
  const result = await apiClient<Wilaya>("/wilayas/create", {
    method: "POST",
    body: data,
  });
  wilayasCache = null;
  return result;
}

/**
 * Mettre à jour une wilaya
 */
export async function updateWilaya(id: string, data: Partial<Wilaya>): Promise<Wilaya> {
  const result = await apiClient<Wilaya>(`/wilayas/${id}`, {
    method: "PUT",
    body: data,
  });
  wilayasCache = null;
  return result;
}

// ============================================
// COMMUNES - Version optimisée avec cache
// ============================================

let communesCache: { [wilayaId: string]: Commune[] } = {};

/**
 * Récupérer les communes d'une wilaya avec cache
 */
export async function getCommunesByWilaya(wilayaId: string, useCache = true): Promise<Commune[]> {
  if (useCache && communesCache[wilayaId]) {
    return communesCache[wilayaId];
  }
  
  try {
    const data = await apiClient<Commune[]>(`/communes/wilaya/${wilayaId}`);
    communesCache[wilayaId] = data;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des communes de la wilaya ${wilayaId}:`, error);
    return [];
  }
}

/**
 * Créer une commune
 */
export async function createCommune(data: {
  code: number;
  name: string;
  name_ar: string;
  daira: string;
  daira_ar: string;
  wilaya_id: string;
}): Promise<Commune> {
  const result = await apiClient<Commune>("/communes/create", {
    method: "POST",
    body: data,
  });
  communesCache = {};
  return result;
}

// ============================================
// SHIPPING RATES - Version corrigée
// ============================================

// lib/api/delivery.ts - Version corrigée pour les tarifs

// lib/api/delivery.ts - Alternative pour les tarifs

// lib/api/delivery.ts - Version corrigée pour les tarifs

/**
 * Importer les tarifs de livraison depuis un fichier CSV
 * Version qui gère les différentes méthodes de livraison
 */
export async function importShippingRatesFromCSV(file: File): Promise<ImportResponse> {
  try {
    const text = await file.text();
    console.log('📄 Contenu du fichier tarifs:', text.substring(0, 300));
    
    const lines = text.split("\n").filter(line => line.trim());
    
    if (lines.length < 2) {
      return {
        success: false,
        message: "Le fichier est vide ou ne contient pas assez de données",
        count: 0,
        total: 0,
        errors: ["Le fichier CSV doit contenir au moins une ligne de données"],
      };
    }

    const headers = parseCSVHeaders(lines[0]);
    console.log('📄 En-têtes:', headers);
    
    // Vérifier les colonnes nécessaires
    const requiredColumns = ['wilaya_code', 'shipping_method', 'price'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      return {
        success: false,
        message: "Colonnes manquantes dans le CSV",
        count: 0,
        total: 0,
        errors: [`Colonnes requises manquantes: ${missingColumns.join(', ')}`],
      };
    }

    let importedCount = 0;
    const errors: string[] = [];

    // Récupérer toutes les wilayas
    const wilayas = await getWilayas();
    const wilayaMap = new Map<number, Wilaya>();
    wilayas.forEach((w) => wilayaMap.set(w.code, w));

    // Grouper les tarifs par wilaya
    const tariffsByWilaya = new Map<number, { home_price: number; stopdesk_price: number; is_active: boolean }>();

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      try {
        const row = parseCSVLine(lines[i], headers);
        
        const wilayaCode = parseInt(row.wilaya_code || "0");
        const shippingMethod = row.shipping_method || "";
        const price = parseFloat(row.price || "0");
        const isActive = row.is_active !== "false" && row.is_active !== "0";
        
        console.log(`📄 Ligne ${i}: wilaya=${wilayaCode}, method=${shippingMethod}, price=${price}`);
        
        if (isNaN(wilayaCode) || wilayaCode === 0) {
          errors.push(`Ligne ${i + 1}: Code wilaya invalide: "${row.wilaya_code}"`);
          continue;
        }

        const wilaya = wilayaMap.get(wilayaCode);
        if (!wilaya) {
          errors.push(`Ligne ${i + 1}: Wilaya ${wilayaCode} non trouvée`);
          continue;
        }

        // Récupérer ou créer l'entrée pour cette wilaya
        let tariff = tariffsByWilaya.get(wilayaCode);
        if (!tariff) {
          tariff = { home_price: 0, stopdesk_price: 0, is_active: true };
          tariffsByWilaya.set(wilayaCode, tariff);
        }

        // Assigner le prix en fonction de la méthode de livraison
        const methodLower = shippingMethod.toLowerCase();
        if (methodLower.includes('home') || methodLower.includes('domicile')) {
          tariff.home_price = price;
          tariff.is_active = isActive;
        } else if (methodLower.includes('stop desk') || methodLower.includes('stopdesk') || methodLower.includes('point relais')) {
          tariff.stopdesk_price = price;
          tariff.is_active = isActive;
        } else {
          // Si la méthode n'est pas reconnue, on l'ajoute aux deux
          console.warn(`⚠️ Méthode non reconnue: ${shippingMethod}, assignée aux deux`);
          tariff.home_price = price;
          tariff.stopdesk_price = price;
          tariff.is_active = isActive;
        }
        
      } catch (error: any) {
        errors.push(`Ligne ${i + 1}: ${error.message || "Erreur inconnue"}`);
        console.error(`❌ Erreur ligne ${i + 1}:`, error);
      }
    }

    // Mettre à jour chaque wilaya avec ses tarifs
    for (const [wilayaCode, tariff] of tariffsByWilaya) {
      try {
        const wilaya = wilayaMap.get(wilayaCode);
        if (!wilaya) {
          errors.push(`Wilaya ${wilayaCode} non trouvée lors de la mise à jour`);
          continue;
        }

        console.log(`🔄 Mise à jour wilaya ${wilayaCode}: home=${tariff.home_price}, stopdesk=${tariff.stopdesk_price}`);
        
        await updateWilaya(wilaya.id, {
          home_shipping_price: tariff.home_price,
          stopdesk_shipping_price: tariff.stopdesk_price,
          is_active: tariff.is_active,
        });
        
        importedCount++;
        
      } catch (error: any) {
        errors.push(`Erreur lors de la mise à jour de la wilaya ${wilayaCode}: ${error.message}`);
        console.error(`❌ Erreur wilaya ${wilayaCode}:`, error);
      }
    }

    wilayasCache = null;

    const result: ImportResponse = {
      success: errors.length === 0,
      message: `${importedCount} wilayas mises à jour avec leurs tarifs${errors.length > 0 ? ` (${errors.length} erreurs)` : ''}`,
      count: importedCount,
      total: tariffsByWilaya.size,
      errors: errors.length > 0 ? errors : undefined,
    };
    
    console.log('✅ Résultat final:', result);
    return result;
    
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'import des tarifs:', error);
    return {
      success: false,
      message: "Erreur lors de l'import des tarifs",
      count: 0,
      total: 0,
      errors: [error.message || "Erreur inconnue"],
    };
  }
}
// ============================================
// UTILITAIRES CSV
// ============================================

function parseCSVHeaders(line: string): string[] {
  return line.split(",").map((h) => h.trim().replace(/^"|"$/g, ''));
}

function parseCSVLine(line: string, headers: string[]): any {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  const row: any = {};
  headers.forEach((header, index) => {
    const value = values[index] || "";
    row[header] = value.trim().replace(/^"|"$/g, '');
  });
  
  return row;
}

// ============================================
// IMPORT DES WILAYAS
// ============================================

/**
 * Importer des wilayas depuis un fichier CSV
 */
/**
 * Importer des wilayas depuis un fichier CSV
 * Format: code_wilaya,nom_wilaya,nom_wilaya_ar
 */
// lib/api/delivery.ts - Version corrigée pour les wilayas

/**
 * Importer des wilayas depuis un fichier CSV
 * Version qui gère les noms en double
 */
/**
 * Importer des wilayas depuis un fichier CSV
 * Version avec détection des doublons
 */
export async function importWilayasFromCSV(file: File): Promise<ImportResponse> {
  const text = await file.text();
  console.log('📄 ===== CONTENU DU FICHIER WILAYAS =====');
  console.log(text.substring(0, 500));
  
  const lines = text.split("\n").filter(line => line.trim());
  
  if (lines.length === 0) {
    return {
      success: false,
      message: "Le fichier est vide",
      count: 0,
      total: 0,
      errors: ["Le fichier CSV est vide"],
    };
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  console.log('📄 En-têtes:', headers);
  
  let importedCount = 0;
  const errors: string[] = [];
  const duplicates: string[] = []; // Pour stocker les doublons

  // Récupérer les wilayas existantes
  const existingWilayas = await getWilayas();
  const existingMap = new Map<number, Wilaya>();
  const existingNameMap = new Map<string, Wilaya>(); // Pour vérifier les noms en double
  existingWilayas.forEach((w) => {
    existingMap.set(w.code, w);
    if (w.name) {
      existingNameMap.set(w.name.toLowerCase(), w);
    }
  });

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    try {
      // Parser la ligne CSV
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      // Créer un objet avec les valeurs
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      
      const code = parseInt(row.code_wilaya || "0");
      const name = row.nom_wilaya || "";
      const nameAr = row.nom_wilaya_ar || name;
      
      console.log(`📄 Ligne ${i}: code=${code}, name=${name}`);
      
      if (isNaN(code) || code === 0) {
        errors.push(`Ligne ${i + 1}: Code wilaya invalide: "${row.code_wilaya}"`);
        continue;
      }

      if (!name) {
        errors.push(`Ligne ${i + 1}: Nom de wilaya manquant`);
        continue;
      }

      // Vérifier si le nom existe déjà (DOUBLON)
      const existingName = existingNameMap.get(name.toLowerCase());
      if (existingName && existingName.code !== code) {
        const duplicateMsg = `⚠️ DOUBLON DÉTECTÉ: Le nom "${name}" (code ${code}) existe déjà pour la wilaya ${existingName.code} (${existingName.name})`;
        duplicates.push(duplicateMsg);
        errors.push(`Ligne ${i + 1}: ${duplicateMsg}`);
        console.log(duplicateMsg);
        continue; // Ignorer cette ligne
      }

      const data = {
        code: code,
        name: name,
        name_ar: nameAr,
        home_shipping_price: parseFloat(row.home_shipping_price || "0") || 0,
        stopdesk_shipping_price: parseFloat(row.stopdesk_shipping_price || "0") || 0,
        is_active: row.is_active !== "false" && row.is_active !== "0",
      };

      const existing = existingMap.get(code);

      if (existing) {
        console.log(`🔄 Mise à jour: ${code} - ${name}`);
        try {
          // Mettre à jour SANS modifier le nom (pour éviter les conflits)
          await updateWilaya(existing.id, {
            name_ar: nameAr,
            home_shipping_price: data.home_shipping_price,
            stopdesk_shipping_price: data.stopdesk_shipping_price,
            is_active: data.is_active,
          });
          // Mettre à jour le cache des noms
          existingNameMap.set(name.toLowerCase(), { ...existing, ...data });
        } catch (updateError: any) {
          if (updateError.message?.includes('UniqueViolation') || updateError.message?.includes('duplicate')) {
            const dupMsg = `⚠️ DOUBLON DÉTECTÉ lors de la mise à jour: "${name}"`;
            duplicates.push(dupMsg);
            errors.push(`Ligne ${i + 1}: ${dupMsg}`);
            console.log(dupMsg);
            continue;
          }
          throw updateError;
        }
      } else {
        console.log(`🆕 Création: ${code} - ${name}`);
        try {
          const created = await createWilaya(data);
          existingMap.set(code, created);
          existingNameMap.set(name.toLowerCase(), created);
        } catch (createError: any) {
          if (createError.message?.includes('UniqueViolation') || createError.message?.includes('duplicate')) {
            const dupMsg = `⚠️ DOUBLON DÉTECTÉ: Le nom "${name}" existe déjà dans la base de données`;
            duplicates.push(dupMsg);
            errors.push(`Ligne ${i + 1}: ${dupMsg}`);
            console.log(dupMsg);
            continue;
          }
          throw createError;
        }
      }
      importedCount++;
      
    } catch (error: any) {
      const errorMessage = error.message || "Erreur inconnue";
      errors.push(`Ligne ${i + 1}: ${errorMessage}`);
      console.error(`❌ Erreur ligne ${i + 1}:`, error);
    }
  }

  wilayasCache = null;

  // Message final avec résumé des doublons
  let message = `${importedCount} wilayas importées avec succès`;
  if (duplicates.length > 0) {
    message += ` (${duplicates.length} doublons ignorés)`;
  }
  if (errors.length > 0) {
    message += ` (${errors.length} erreurs)`;
  }

  return {
    success: errors.length === 0 && duplicates.length === 0,
    message: message,
    count: importedCount,
    total: lines.length - 1,
    errors: errors.length > 0 ? errors : (duplicates.length > 0 ? duplicates : undefined),
  };
}
// ============================================
// IMPORT DES COMMUNES
// ============================================

// lib/api/delivery.ts - Version corrigée pour le format de fichier

// lib/api/delivery.ts - Version corrigée avec détection des doublons pour les communes

/**
 * Importer des communes depuis un fichier CSV
 * Format attendu: code_wilaya,nom_wilaya,code_commune,nom_commune,nom_commune_ar,daira,daira_ar
 * Version avec détection des doublons
 */
export async function importCommunesFromCSV(file: File): Promise<ImportResponse> {
  const text = await file.text();
  console.log('📄 ===== CONTENU DU FICHIER COMMUNES =====');
  console.log(text.substring(0, 500));
  
  const lines = text.split("\n").filter(line => line.trim());
  
  if (lines.length === 0) {
    return {
      success: false,
      message: "Le fichier est vide",
      count: 0,
      total: 0,
      errors: ["Le fichier CSV est vide"],
    };
  }

  // Parser les en-têtes
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  console.log('📄 En-têtes:', headers);
  
  // Vérifier les colonnes nécessaires
  const requiredColumns = ['code_wilaya', 'code_commune', 'nom_commune'];
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));
  
  if (missingColumns.length > 0) {
    return {
      success: false,
      message: "Colonnes manquantes dans le CSV",
      count: 0,
      total: 0,
      errors: [`Colonnes requises manquantes: ${missingColumns.join(', ')}`],
    };
  }

  let importedCount = 0;
  const errors: string[] = [];
  const duplicates: string[] = [];

  // Récupérer toutes les wilayas
  const wilayas = await getWilayas();
  const wilayaMap = new Map<number, Wilaya>();
  wilayas.forEach((w) => wilayaMap.set(w.code, w));

  // Récupérer les communes existantes par wilaya
  const existingCommunesMap = new Map<string, Commune>();
  const existingNameMap = new Map<string, Commune>(); // Pour vérifier les noms en double
  for (const wilaya of wilayas) {
    const communes = await getCommunesByWilaya(wilaya.id);
    communes.forEach((c: any) => {
      const key = `${wilaya.code}-${c.code}`;
      existingCommunesMap.set(key, c);
      // Stocker par nom pour détecter les doublons
      const nameKey = `${wilaya.code}-${c.name.toLowerCase()}`;
      existingNameMap.set(nameKey, c);
    });
  }

  // Traiter chaque ligne (ignorer la première ligne d'en-têtes)
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    try {
      // Parser la ligne CSV
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      // Créer un objet avec les valeurs
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      
      // Récupérer les valeurs
      const wilayaCode = parseInt(row.code_wilaya || "0");
      const communeCode = parseInt(row.code_commune || "0");
      const name = row.nom_commune || "";
      const nameAr = row.nom_commune_ar || name;
      const daira = row.daira || "";
      const dairaAr = row.daira_ar || daira;
      
      console.log(`📄 Ligne ${i}: wilaya=${wilayaCode}, commune=${communeCode}, name=${name}`);
      
      if (isNaN(wilayaCode) || wilayaCode === 0) {
        errors.push(`Ligne ${i + 1}: Code wilaya invalide: "${row.code_wilaya}"`);
        continue;
      }
      
      if (isNaN(communeCode) || communeCode === 0) {
        errors.push(`Ligne ${i + 1}: Code commune invalide: "${row.code_commune}"`);
        continue;
      }

      if (!name) {
        errors.push(`Ligne ${i + 1}: Nom de commune manquant`);
        continue;
      }

      const wilaya = wilayaMap.get(wilayaCode);
      if (!wilaya) {
        errors.push(`Ligne ${i + 1}: Wilaya ${wilayaCode} non trouvée`);
        continue;
      }

      // VÉRIFICATION DES DOUBLONS
      // 1. Vérifier si le code commune existe déjà pour cette wilaya
      const key = `${wilayaCode}-${communeCode}`;
      const existingByCode = existingCommunesMap.get(key);
      
      // 2. Vérifier si le nom commune existe déjà pour cette wilaya
      const nameKey = `${wilayaCode}-${name.toLowerCase()}`;
      const existingByName = existingNameMap.get(nameKey);
      
      // Si le code existe déjà mais avec un nom différent
      if (existingByCode && existingByCode.name.toLowerCase() !== name.toLowerCase()) {
        const dupMsg = `⚠️ DOUBLON DÉTECTÉ: La commune "${name}" (code ${communeCode}) a un nom différent dans la base de données: "${existingByCode.name}"`;
        duplicates.push(dupMsg);
        errors.push(`Ligne ${i + 1}: ${dupMsg}`);
        console.log(`%c${dupMsg}`, 'color: orange; font-weight: bold');
        continue;
      }
      
      // Si le nom existe déjà mais avec un code différent
      if (existingByName && existingByName.code !== communeCode) {
        const dupMsg = `⚠️ DOUBLON DÉTECTÉ: Le nom "${name}" (code ${communeCode}) existe déjà avec le code ${existingByName.code} pour cette wilaya`;
        duplicates.push(dupMsg);
        errors.push(`Ligne ${i + 1}: ${dupMsg}`);
        console.log(`%c${dupMsg}`, 'color: orange; font-weight: bold');
        continue;
      }

      const data = {
        code: communeCode,
        name: name,
        name_ar: nameAr,
        daira: daira,
        daira_ar: dairaAr,
        wilaya_id: wilaya.id,
      };

      // Si la commune existe déjà (même code ou même nom), on la met à jour
      const existing = existingByCode || existingByName;
      if (existing) {
        console.log(`🔄 Mise à jour: ${communeCode} - ${name}`);
        await apiClient(`/communes/${existing.id}`, {
          method: "PUT",
          body: {
            name: data.name,
            name_ar: data.name_ar,
            daira: data.daira,
            daira_ar: data.daira_ar,
          },
        });
      } else {
        // Créer une nouvelle commune
        console.log(`🆕 Création: ${communeCode} - ${name}`);
        const created = await createCommune(data);
        existingCommunesMap.set(key, created);
        existingNameMap.set(nameKey, created);
      }
      importedCount++;
      
    } catch (error: any) {
      const errorMessage = error.message || "Erreur inconnue";
      // Vérifier si l'erreur est un doublon
      if (errorMessage.includes('UniqueViolation') || errorMessage.includes('duplicate') || errorMessage.includes('violation')) {
        const dupMsg = `⚠️ DOUBLON DÉTECTÉ: Erreur de contrainte unique pour la ligne ${i + 1}`;
        duplicates.push(dupMsg);
        errors.push(`Ligne ${i + 1}: ${dupMsg}`);
        console.log(`%c${dupMsg}`, 'color: orange; font-weight: bold');
      } else {
        errors.push(`Ligne ${i + 1}: ${errorMessage}`);
        console.error(`❌ Erreur ligne ${i + 1}:`, error);
      }
    }
  }

  communesCache = {};

  let message = `${importedCount} communes importées avec succès`;
  if (duplicates.length > 0) {
    message += ` (${duplicates.length} doublons ignorés)`;
  }
  if (errors.length > 0) {
    message += ` (${errors.length - duplicates.length} autres erreurs)`;
  }

  return {
    success: errors.length === 0 || errors.every(e => e.includes('DOUBLON')),
    message: message,
    count: importedCount,
    total: lines.length - 1,
    errors: errors.length > 0 ? errors : undefined,
  };
}
// ============================================
// STATISTIQUES
// ============================================

export async function getDeliveryStats(): Promise<{
  total_wilayas: number;
  total_communes: number;
  active_wilayas: number;
}> {
  const [wilayas, communes] = await Promise.all([
    getWilayas(),
    apiClient<Commune[]>("/communes/").catch(() => []),
  ]);

  return {
    total_wilayas: wilayas.length,
    total_communes: communes.length || 0,
    active_wilayas: wilayas.filter((w) => w.is_active).length,
  };
}