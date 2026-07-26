# PORTOVERO

> Timeless Mediterranean Elegance.

Portovero est une plateforme e-commerce premium spécialisée dans les vêtements **Old Money / Quiet Luxury**.

Le projet est composé de trois parties :

- 🛍️ Store (site client)
- ⚙️ Admin / ERP (gestion interne)
- 🚀 Backend (API FastAPI)

L'objectif est de construire une plateforme professionnelle, évolutive et maintenable, capable de devenir une véritable marque.

---

# Vision

Portovero ne cherche pas à être un simple site de vêtements.

Notre objectif est de proposer une expérience haut de gamme inspirée des grandes maisons comme :

- Loro Piana
- Brunello Cucinelli
- Ralph Lauren
- COS
- Aime Leon Dore

Le design doit transmettre :

- élégance
- minimalisme
- qualité
- calme
- luxe discret

Nous privilégions toujours la qualité plutôt que la quantité.

---

# Architecture

```
portovero/

apps/
│
├── store/          → Boutique e-commerce
│
├── admin/          → ERP / Dashboard
│
packages/
│
├── ui/             → Composants partagés
├── hooks/
├── types/
├── utils/
└── config/
│
backend/
│
├── app/
└── tests/

docker/

docs/
```

---

# Technologies

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Motion
- Lucide Icons

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL

## Déploiement

- Docker
- Docker Compose

---

# Design Philosophy

Le design doit rester cohérent sur toutes les pages.

Inspirations :

- Quiet Luxury
- Old Money
- Minimalisme
- Élégance italienne

Le site ne doit jamais paraître chargé.

Nous préférons :

- beaucoup d'espace blanc
- de grandes photos
- peu de texte
- des animations discrètes

---

# Palette officielle

Background

```
#F8F5F0
```

Primary

```
#3E4D3A
```

Secondary

```
#7C5C3B
```

Accent

```
#D1B87C
```

Navy

```
#1B2241
```

Text

```
#111111
```

Muted

```
#8C8C8C
```

---

# Typography

Headings

```
Cormorant Garamond
```

Body

```
Inter
```

---

# Folder Convention

Les composants UI sont génériques.

```
components/ui/
```

Les composants métier sont séparés.

```
components/navigation/

components/hero/

components/product/

components/collection/

components/footer/

components/sections/

components/layout/
```

Un composant doit être :

- réutilisable
- simple
- lisible
- documenté

---

# Développement

Toujours construire dans cet ordre.

## 1.

Design System

↓

## 2.

Navigation

↓

## 3.

Hero

↓

## 4.

Homepage

↓

## 5.

Catalogue

↓

## 6.

Produit

↓

## 7.

Panier

↓

## 8.

Checkout

↓

## 9.

Compte client

↓

## 10.

ERP

---

# Règles

Ne jamais copier directement un site.

Toujours s'inspirer.

Le design doit rester cohérent.

Une nouvelle fonctionnalité ne doit jamais casser le style général.

Les animations servent à améliorer l'expérience, jamais à distraire.

---

# Store

Le Store contient :

- Homepage
- Collections
- Produits
- Recherche
- Wishlist
- Panier
- Checkout
- Compte

---

# ERP

L'ERP permettra de gérer :

## Produits

- CRUD
- catégories
- variantes
- tailles
- couleurs

## Stock

- inventaire
- mouvements
- alertes

## Commandes

- commandes
- paiement
- livraison

## Clients

- historique
- fidélité

## Fournisseurs

- achats
- réapprovisionnement

## Marketing

- promotions
- coupons
- newsletters

## Analytics

- ventes
- chiffre d'affaires
- produits populaires

---

# Backend

Le backend suivra une architecture modulaire.

```
app/

auth/

users/

products/

inventory/

orders/

customers/

suppliers/

finance/

analytics/

marketing/
```

Chaque module contient :

- router
- service
- repository
- schemas
- models

---

# Git

Commits courts.

Exemple

```
feat: add hero section

fix: navbar mobile

refactor: product card
```

---

# Objectif

Le but n'est pas seulement de créer un site.

Nous construisons une véritable plateforme e-commerce professionnelle.

Chaque décision technique doit privilégier :

- la maintenabilité
- la réutilisabilité
- la performance
- la qualité du code

---

# Roadmap

Sprint 1

- Configuration
- Design System
- Navbar
- Hero

Sprint 2

- Homepage

Sprint 3

- Catalogue

Sprint 4

- Product Page

Sprint 5

- Cart

Sprint 6

- Checkout

Sprint 7

- ERP

Sprint 8

- Backend

Sprint 9

- Déploiement

---

# Auteur

Projet développé par l'équipe Portovero.

Vision :

Créer la meilleure expérience e-commerce premium en Algérie, avec une architecture moderne, évolutive et professionnelle.