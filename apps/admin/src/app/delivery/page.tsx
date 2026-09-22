"use client";

import { useState, useEffect } from "react";
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  MapPin, 
  DollarSign, 
  Loader2,
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react";
import {
  importWilayasFromCSV,
  importCommunesFromCSV,
  importShippingRatesFromCSV,
  getWilayas,
  getCommunesByWilaya,
  type ImportResponse,
  type Wilaya,
  type Commune,
} from "@/lib/api/delivery";

type ImportStatus = {
  wilayas: { loaded: boolean; fileName: string; count?: number; error?: string };
  communes: { loaded: boolean; fileName: string; count?: number; error?: string };
  tariffs: { loaded: boolean; fileName: string; count?: number; error?: string };
};

type ExpandedWilaya = {
  [key: string]: boolean;
};

export default function DeliveryPage() {
  // États pour l'import
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    wilayas: { loaded: false, fileName: "" },
    communes: { loaded: false, fileName: "" },
    tariffs: { loaded: false, fileName: "" },
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    wilayas: false,
    communes: false,
    tariffs: false,
  });

  // États pour l'affichage des données
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<{ [key: string]: Commune[] }>({});
  const [expandedWilayas, setExpandedWilayas] = useState<ExpandedWilaya>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | null>(null);
  const [showWilayaDetail, setShowWilayaDetail] = useState(false);
  
  // État pour les doublons
  const [duplicateWarnings, setDuplicateWarnings] = useState<string[]>([]);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const wilayasData = await getWilayas();
      setWilayas(wilayasData);

      // Charger les communes pour chaque wilaya
      const communesData: { [key: string]: Commune[] } = {};
      for (const wilaya of wilayasData) {
        const communes = await getCommunesByWilaya(wilaya.id);
        communesData[wilaya.id] = communes;
      }
      setCommunes(communesData);

      // Initialiser l'état d'expansion
      const expanded: ExpandedWilaya = {};
      wilayasData.forEach((w) => {
        expanded[w.id] = false;
      });
      setExpandedWilayas(expanded);

    } catch (error) {
      console.error("❌ Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  // Filtrer les wilayas
  const filteredWilayas = wilayas.filter((wilaya) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      wilaya.name?.toLowerCase().includes(searchLower) ||
      wilaya.name_ar?.includes(searchTerm) ||
      wilaya.code?.toString().includes(searchTerm)
    );
  });

  const toggleWilaya = (id: string) => {
    setExpandedWilayas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fonctions d'import
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "wilayas" | "communes" | "tariffs"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Veuillez sélectionner un fichier CSV");
      return;
    }

    setIsUploading(true);
    setUploadProgress((prev) => ({ ...prev, [type]: true }));

    try {
      let response: ImportResponse;

      switch (type) {
        case "wilayas":
          response = await importWilayasFromCSV(file);
          break;
        case "communes":
          response = await importCommunesFromCSV(file);
          break;
        case "tariffs":
          response = await importShippingRatesFromCSV(file);
          break;
        default:
          throw new Error("Type non supporté");
      }

      console.log(`📊 Réponse pour ${type}:`, response);

      // Vérifier les doublons
      if (response.errors) {
        const duplicateErrors = response.errors.filter(e => e.includes('DOUBLON'));
        if (duplicateErrors.length > 0) {
          setDuplicateWarnings(prev => [...prev, ...duplicateErrors]);
        }
      }

      setImportStatus((prev) => ({
        ...prev,
        [type]: {
          loaded: response.success,
          fileName: file.name,
          count: response.count || 0,
          error: response.errors?.length ? response.errors.join(", ") : undefined,
        },
      }));

      if (response.success) {
        console.log(`✅ ${type} importé avec succès:`, response.message);
        // Recharger les données après un import réussi
        await loadData();
      } else {
        console.warn(`⚠️ ${type} importé avec des erreurs:`, response.errors);
      }
      
    } catch (error: any) {
      console.error(`❌ Erreur lors de l'import ${type}:`, error);

      setImportStatus((prev) => ({
        ...prev,
        [type]: {
          loaded: false,
          fileName: file.name,
          count: 0,
          error: error.message || "Erreur lors de l'import",
        },
      }));
    } finally {
      setIsUploading(false);
      setUploadProgress((prev) => ({ ...prev, [type]: false }));
    }
  };

  const removeFile = (type: "wilayas" | "communes" | "tariffs") => {
    setImportStatus((prev) => ({
      ...prev,
      [type]: { loaded: false, fileName: "", count: 0 },
    }));
  };

  const getStatusIcon = (type: "wilayas" | "communes" | "tariffs") => {
    const status = importStatus[type];
    
    if (uploadProgress[type]) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
    }
    
    if (status.error && status.loaded === false) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    
    if (status.loaded) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    
    return null;
  };

  const getStatusColor = (type: "wilayas" | "communes" | "tariffs") => {
    const status = importStatus[type];
    
    if (uploadProgress[type]) return "border-blue-500";
    if (status.error && status.loaded === false) return "border-red-500";
    if (status.loaded) return "border-green-500";
    return "border-gray-300";
  };

  const allLoaded = Object.values(importStatus).every(
    (status) => status.loaded && !status.error
  );

  const anyUploading = Object.values(uploadProgress).some(p => p);

  // Séparer les doublons par type
  const wilayaDuplicates = duplicateWarnings.filter(w => 
    w.includes('DOUBLON') && (w.includes('wilaya') || w.includes('nom') && !w.includes('commune'))
  );
  const communeDuplicates = duplicateWarnings.filter(w => 
    w.includes('DOUBLON') && (w.includes('commune') || w.includes('Code commune'))
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestion de la Livraison</h1>
            <p className="text-sm text-neutral-500">
              Importez les fichiers de wilayas, communes et tarifs de livraison
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Section d'import */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Wilayas */}
        <div className={`rounded-lg border-2 ${getStatusColor("wilayas")} bg-white p-6`}>
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Wilayas</h2>
          </div>
          
          {importStatus.wilayas.loaded ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-600">
                {getStatusIcon("wilayas")}
                <span className="truncate">{importStatus.wilayas.fileName}</span>
              </div>
              <div className="text-xs text-neutral-500">
                {importStatus.wilayas.count || 0} wilayas importées
              </div>
              <button
                onClick={() => removeFile("wilayas")}
                className="text-xs text-red-600 hover:underline"
                disabled={uploadProgress.wilayas}
              >
                Supprimer
              </button>
            </div>
          ) : importStatus.wilayas.error ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Erreur d'import</span>
              </div>
              <p className="text-xs text-red-500">{importStatus.wilayas.error}</p>
              <button
                onClick={() => {
                  setImportStatus((prev) => ({
                    ...prev,
                    wilayas: { loaded: false, fileName: "", count: 0 },
                  }));
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileSelect(e, "wilayas")}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 hover:bg-neutral-50">
                <Upload className="h-8 w-8 text-neutral-400" />
                <span className="mt-2 text-sm text-neutral-600">
                  Importer wilayas.csv
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Communes */}
        <div className={`rounded-lg border-2 ${getStatusColor("communes")} bg-white p-6`}>
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="font-semibold">Communes</h2>
          </div>
          
          {importStatus.communes.loaded ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-600">
                {getStatusIcon("communes")}
                <span className="truncate">{importStatus.communes.fileName}</span>
              </div>
              <div className="text-xs text-neutral-500">
                {importStatus.communes.count || 0} communes importées
              </div>
              <button
                onClick={() => removeFile("communes")}
                className="text-xs text-red-600 hover:underline"
                disabled={uploadProgress.communes}
              >
                Supprimer
              </button>
            </div>
          ) : importStatus.communes.error ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Erreur d'import</span>
              </div>
              <p className="text-xs text-red-500">{importStatus.communes.error}</p>
              <button
                onClick={() => {
                  setImportStatus((prev) => ({
                    ...prev,
                    communes: { loaded: false, fileName: "", count: 0 },
                  }));
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileSelect(e, "communes")}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 hover:bg-neutral-50">
                <Upload className="h-8 w-8 text-neutral-400" />
                <span className="mt-2 text-sm text-neutral-600">
                  Importer communes.csv
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tarifs */}
        <div className={`rounded-lg border-2 ${getStatusColor("tariffs")} bg-white p-6`}>
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-yellow-600" />
            <h2 className="font-semibold">Tarifs de livraison</h2>
          </div>
          
          {importStatus.tariffs.loaded ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-600">
                {getStatusIcon("tariffs")}
                <span className="truncate">{importStatus.tariffs.fileName}</span>
              </div>
              <div className="text-xs text-neutral-500">
                {importStatus.tariffs.count || 0} tarifs importés
              </div>
              <button
                onClick={() => removeFile("tariffs")}
                className="text-xs text-red-600 hover:underline"
                disabled={uploadProgress.tariffs}
              >
                Supprimer
              </button>
            </div>
          ) : importStatus.tariffs.error ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Erreur d'import</span>
              </div>
              <p className="text-xs text-red-500">{importStatus.tariffs.error}</p>
              <button
                onClick={() => {
                  setImportStatus((prev) => ({
                    ...prev,
                    tariffs: { loaded: false, fileName: "", count: 0 },
                  }));
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileSelect(e, "tariffs")}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 hover:bg-neutral-50">
                <Upload className="h-8 w-8 text-neutral-400" />
                <span className="mt-2 text-sm text-neutral-600">
                  Importer tarifs.csv
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message de succès global */}
      {allLoaded && (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>Tous les fichiers ont été importés avec succès !</span>
          </div>
        </div>
      )}

      {/* Avertissements de doublons - UNIFIÉ */}
      {duplicateWarnings.length > 0 && (
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">⚠️ Doublons détectés et ignorés</h4>
              <p className="mt-1 text-sm text-yellow-700">
                Les entrées suivantes existent déjà dans la base de données et ont été ignorées :
              </p>
              
              {/* Doublons des wilayas */}
              {wilayaDuplicates.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-yellow-800">Wilayas :</h5>
                  <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                    {wilayaDuplicates.map((warning, index) => (
                      <li key={`wilaya-${index}`}>{warning.replace('DOUBLON DÉTECTÉ: ', '')}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Doublons des communes */}
              {communeDuplicates.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-yellow-800">Communes :</h5>
                  <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                    {communeDuplicates.map((warning, index) => (
                      <li key={`commune-${index}`}>{warning.replace('DOUBLON DÉTECTÉ: ', '')}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button
                onClick={() => setDuplicateWarnings([])}
                className="mt-3 text-xs text-yellow-700 hover:text-yellow-900 underline"
              >
                Ignorer ces avertissements
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barre de progression */}
      {anyUploading && (
        <div className="mt-8">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Import en cours...</span>
          </div>
        </div>
      )}

      {/* Section d'affichage des données */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold">Liste des Wilayas et Communes</h2>

        {/* Barre de recherche */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher une wilaya..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 pl-10 pr-4 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div className="text-sm text-neutral-500">
            {filteredWilayas.length} wilayas trouvées
          </div>
        </div>

        {/* Liste des wilayas */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        ) : filteredWilayas.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
            <MapPin className="mx-auto h-12 w-12 text-neutral-300" />
            <p className="mt-4 text-neutral-500">Aucune wilaya trouvée</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredWilayas.map((wilaya) => {
              const isExpanded = expandedWilayas[wilaya.id] || false;
              const wilayaCommunes = communes[wilaya.id] || [];
              const totalCommunes = wilayaCommunes.length;

              return (
                <div
                  key={wilaya.id}
                  className="rounded-lg border border-neutral-200 bg-white overflow-hidden"
                >
                  {/* En-tête de la wilaya */}
                  <div
                    className="flex cursor-pointer items-center justify-between p-4 hover:bg-neutral-50"
                    onClick={() => toggleWilaya(wilaya.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {wilaya.name} ({wilaya.code})
                          </span>
                          <span className="text-sm text-neutral-500">
                            {wilaya.name_ar}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span>
                            🏠 {wilaya.home_shipping_price || 0} DA
                          </span>
                          <span>
                            📦 {wilaya.stopdesk_shipping_price || 0} DA
                          </span>
                          <span>
                            {totalCommunes} communes
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              wilaya.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {wilaya.is_active ? "Actif" : "Inactif"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWilaya(wilaya);
                          setShowWilayaDetail(true);
                        }}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-neutral-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* Liste des communes */}
                  {isExpanded && (
                    <div className="border-t border-neutral-100 bg-neutral-50 p-4">
                      {wilayaCommunes.length === 0 ? (
                        <p className="text-sm text-neutral-500">
                          Aucune commune pour cette wilaya
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                          {wilayaCommunes.map((commune) => (
                            <div
                              key={commune.id}
                              className="rounded-lg bg-white p-3 text-sm shadow-sm"
                            >
                              <div className="font-medium">{commune.name}</div>
                              <div className="text-xs text-neutral-500">
                                {commune.name_ar}
                              </div>
                              <div className="mt-1 text-xs text-neutral-400">
                                Code: {commune.code}
                              </div>
                              {commune.daira && (
                                <div className="text-xs text-neutral-400">
                                  Daira: {commune.daira}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Statistiques */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm text-blue-600">Total Wilayas</div>
            <div className="text-2xl font-bold text-blue-700">
              {wilayas.length}
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-sm text-green-600">Total Communes</div>
            <div className="text-2xl font-bold text-green-700">
              {Object.values(communes).reduce((acc, curr) => acc + curr.length, 0)}
            </div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="text-sm text-yellow-600">Wilayas Actives</div>
            <div className="text-2xl font-bold text-yellow-700">
              {wilayas.filter((w) => w.is_active).length}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détail d'une wilaya */}
      {showWilayaDetail && selectedWilaya && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-md w-full rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Détails de la Wilaya</h3>
              <button
                onClick={() => setShowWilayaDetail(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Code</span>
                <span className="font-medium">{selectedWilaya.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Nom</span>
                <span className="font-medium">{selectedWilaya.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Nom (Arabe)</span>
                <span className="font-medium">{selectedWilaya.name_ar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Livraison à domicile</span>
                <span className="font-medium">{selectedWilaya.home_shipping_price || 0} DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Livraison Stop Desk</span>
                <span className="font-medium">{selectedWilaya.stopdesk_shipping_price || 0} DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Statut</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    selectedWilaya.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedWilaya.is_active ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Nombre de communes</span>
                <span className="font-medium">
                  {communes[selectedWilaya.id]?.length || 0}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowWilayaDetail(false)}
              className="mt-6 w-full rounded-lg bg-neutral-900 py-2 text-white hover:bg-neutral-800"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}