# RAPPORT DE STAGE

---

## Plateforme d'analytique et de prédiction des réclamations clients

### DOT M'Sila — Algérie Télécom

**Projet :** DOT-MSILA-Analytics (M'Sila Insights Hub)

---

| | |
|---|---|
| **Réalisé par :** | Khadidja Bensallah |
| **Encadré par :** | Madame Karima Amara |
| **Organisme d'accueil :** | Algérie Télécom — Direction Opérationnelle des Télécommunications de M'Sila (DOT M'SILA) |
| **Formation :** | Cycle ingénieur — Informatique / Intelligence artificielle |
| **Établissement :** | ESTIN (École Supérieure en Informatique) |
| **Période de stage :** | Stage professionnel (année universitaire 2025–2026) |
| **Dépôt GitHub :** | https://github.com/khadidjabensallah/DOT-MSILA-Analytics |

---

<div style="page-break-after: always;"></div>

## Remerciements

Je tiens à exprimer ma profonde gratitude à **Madame Karima Amara**, mon encadrante pédagogique, pour son accompagnement, ses conseils et la rigueur qu'elle a su m'inculquer tout au long de ce stage.

Je remercie également l'équipe de la **Direction Opérationnelle des Télécommunications de M'Sila (DOT M'SILA)** d'Algérie Télécom, en particulier les personnels du reporting et de l'exploitation, pour m'avoir accueillie, partagé le contexte métier des réclamations clients et orienté les besoins fonctionnels du projet.

Mes remerciements s'adressent enfin à **Madame Amira Feliachi** et à l'ensemble des collaborateurs qui ont contribué, par leurs retours techniques, à améliorer la structure du dépôt logiciel et la reproductibilité du projet après clonage.

Enfin, je remercie l'**ESTIN** pour avoir permis cette immersion en entreprise et pour le cadre pédagogique du stage.

---

## Résumé

Ce rapport présente le travail réalisé durant mon stage au sein de la DOT M'Sila d'Algérie Télécom. L'objectif était de concevoir et de mettre en œuvre une **plateforme d'analytique des réclamations clients**, couplée à un **module de prédiction** basé sur l'apprentissage automatique, afin d'aider la direction et les équipes opérationnelles à suivre les indicateurs de performance (KPI), visualiser les tendances et estimer la probabilité de résolution d'une plainte.

La solution développée, **DOT-MSILA-Analytics** (interface « M'Sila Insights Hub »), repose sur une architecture **monorepo** : un **backend** Python (FastAPI, scikit-learn, Pandas) et un **frontend** web moderne (React, TypeScript, Vite, Recharts). Les données sont, à ce stade, stockées sous forme de fichiers CSV représentatifs (données de démonstration sans information personnelle réelle). Un tableau de bord alternatif Streamlit permet une démonstration rapide des KPI et du modèle.

Les résultats obtenus montrent un taux de résolution simulé d'environ **59,5 %** sur **1 400** réclamations historiques, un délai moyen de résolution d'environ **7,4 jours**, ainsi qu'une intégration fonctionnelle de l'API de prédiction dans l'interface utilisateur. Les performances du modèle Random Forest restent modestes sur jeu de test (**accuracy ≈ 53 %**), ce qui confirme la nature **prototype** de la solution et la nécessité d'une future exploitation sur données réelles et d'un pipeline MLOps.

**Mots-clés :** réclamations clients, Algérie Télécom, tableau de bord, FastAPI, React, scikit-learn, Random Forest, monorepo, DOT M'Sila.

---

## Abstract

This internship report describes the design and implementation of **DOT-MSILA-Analytics**, a customer complaint analytics and machine-learning prediction platform for Algérie Télécom's M'Sila operational directorate. The system combines a Python FastAPI backend with a React/TypeScript frontend in a monorepo structure. Key features include executive KPIs, interactive charts, a searchable complaint explorer, and a REST prediction endpoint backed by a Random Forest classifier. The current deployment relies on synthetic CSV data for demonstration. Results highlight successful end-to-end integration while acknowledging limitations regarding model accuracy and production readiness.

**Keywords:** telecom analytics, complaint management, dashboard, machine learning, FastAPI, React.

---

<div style="page-break-after: always;"></div>

## Table des matières

1. Introduction  
2. Présentation du contexte et de l'organisme d'accueil  
3. Analyse des besoins et problématique  
4. Objectifs du stage  
5. État de l'art et choix technologiques  
6. Architecture générale du système  
7. Conception et implémentation du backend  
8. Conception et implémentation du frontend  
9. Pipeline de données et modèle d'apprentissage automatique  
10. Résultats et validation  
11. Limites du travail réalisé  
12. Perspectives d'évolution  
13. Conclusion  
14. Bibliographie  
15. Annexes  

---

## 1. Introduction

La qualité de service et la satisfaction client constituent des enjeux majeurs pour les opérateurs de télécommunications. La gestion des **réclamations** (plaintes) — qu'elles proviennent du call center, d'un formulaire web ou d'une réclamation écrite — génère un volume important de données exploitable pour le pilotage opérationnel et le reporting directionnel.

Durant mon stage à la **DOT M'Sila**, j'ai été chargée de proposer une solution numérique permettant de :

- centraliser l'analyse des réclamations ;
- visualiser des indicateurs clés et des tendances ;
- expérimenter la **prédiction automatique** du statut de résolution à partir de caractéristiques simples (commune, canal, type de plainte, date).

Ce rapport documente la démarche suivie, les choix techniques, la réalisation logicielle et les résultats obtenus, dans le cadre encadré par **Madame Karima Amara**.

---

## 2. Présentation du contexte et de l'organisme d'accueil

### 2.1 Algérie Télécom et la DOT M'Sila

**Algérie Télécom** est l'opérateur historique des télécommunications en Algérie. La **Direction Opérationnelle des Télécommunications (DOT)** de la wilaya de **M'Sila** assure le suivi des activités techniques et commerciales sur le territoire, incluant la relation client et le traitement des réclamations liées aux services (ADSL, fibre, facturation, interruptions réseau, etc.).

### 2.2 Contexte du stage

Le stage s'inscrit dans une démarche de **modernisation des outils de reporting** et d'expérimentation de l'**intelligence artificielle** appliquée au service client. Les interlocuteurs métier ont exprimé le besoin d'un outil :

- lisible pour la direction (KPI, graphiques) ;
- exploitable par les équipes de reporting (exploration des dossiers) ;
- évolutif vers des usages prédictifs (priorisation, anticipation des délais).

---

## 3. Analyse des besoins et problématique

### 3.1 Constats

- Les réclamations proviennent de **plusieurs canaux** et concernent **plusieurs types** de problèmes.
- Le suivi repose souvent sur des **tableaux statiques** ou des extractions manuelles.
- Il n'existe pas, dans le périmètre du prototype, de **base de données unifiée en temps réel** accessible au dashboard.
- La direction souhaite des **indicateurs synthétiques** : volume total, taux de résolution, délai moyen, répartition géographique et par type.

### 3.2 Problématique

**Comment concevoir une plateforme web intégrée permettant d'analyser les réclamations clients de la DOT M'Sila et d'appuyer la décision par un modèle prédictif, tout en garantissant une architecture maintenable et reproductible pour les équipes techniques ?**

---

## 4. Objectifs du stage

### 4.1 Objectif général

Mettre en place une **plateforme d'analytique et de prédiction** des réclamations clients pour la DOT M'Sila.

### 4.2 Objectifs spécifiques

| N° | Objectif | Critère de réalisation |
|----|----------|------------------------|
| O1 | Structurer les données de réclamations | Fichiers CSV normalisés + pipeline de nettoyage |
| O2 | Calculer des KPI métier | API `/api/stats` avec taux de résolution et délais |
| O3 | Proposer une interface décisionnelle | Dashboard React à onglets (exécutif, prédiction, exploration) |
| O4 | Entraîner un modèle de classification | Random Forest + export joblib |
| O5 | Exposer le modèle via API | Endpoint POST `/api/predict` |
| O6 | Organiser le code en monorepo | Dossiers `backend/` et `frontend/` + README |

---

## 5. État de l'art et choix technologiques

### 5.1 Tableaux de bord et BI

Les solutions de Business Intelligence (Power BI, Metabase, etc.) offrent des connecteurs et des visualisations matures. Pour un stage orienté **développement full-stack et IA**, une solution **sur mesure** permet un contrôle total du pipeline ML et de l'API.

### 5.2 Stack retenue

**Backend**

- **Python 3.10** — écosystème data science
- **FastAPI** — API REST performante, documentation OpenAPI (`/docs`)
- **Pandas** — manipulation des CSV
- **scikit-learn** — preprocessing et modèles
- **joblib** — sérialisation du préprocesseur et du classifieur
- **Streamlit** (optionnel) — démo KPI/ML sans frontend Node

**Frontend**

- **React 19** + **TypeScript** — interface typée et composants réutilisables
- **Vite** — bundler et dev server
- **TanStack Router / React Query** — routing et cache des requêtes API
- **Tailwind CSS** + **shadcn/ui** — design system
- **Recharts** — graphiques (courbes, barres, secteurs)

**Organisation**

- **Monorepo Git** : `backend/`, `frontend/`, `README.md` racine
- Dépôt public : **github.com/khadidjabensallah/DOT-MSILA-Analytics**

---

## 6. Architecture générale du système

### 6.1 Vue d'ensemble

```
┌─────────────────┐     HTTP/JSON      ┌──────────────────────────┐
│  Frontend React │ ◄────────────────► │  Backend FastAPI         │
│  (port 5173)    │   /api/stats       │  (port 8000)             │
│                 │   /api/complaints  │                          │
│  - KPI Cards    │   /api/predict     │  - eda.py (KPI)          │
│  - Executive    │                    │  - data_pipeline.py      │
│  - Predictive   │                    │  - model.joblib          │
│  - Explorer     │                    │  - encoder.joblib        │
└─────────────────┘                    │  - plaintes_*.csv        │
                                       └──────────────────────────┘
```

### 6.2 Flux de prédiction

1. L'utilisateur saisit commune, type de plainte, date (et canal côté API).
2. Le backend applique `extract_features` (mois, jour de semaine, etc.).
3. Le **ColumnTransformer** (`encoder.joblib`) encode les variables.
4. Le **Random Forest** (`model.joblib`) produit classe et probabilités.
5. Le frontend affiche statut prédit, score de confiance et indicateurs UX (risque, délai estimé heuristique).

### 6.3 Structure du dépôt

```
DOT-MSILA-Analytics/
├── backend/
│   ├── server.py, app.py, requirements.txt
│   ├── encoder.joblib, model.joblib
│   ├── plaintes_clients_raw.csv
│   ├── plaintes_nouvelles_a_predire.csv
│   └── src/ (data_pipeline.py, eda.py, model.py)
├── frontend/
│   ├── package.json, vite.config.ts
│   └── src/components/dashboard/, src/lib/, src/routes/
└── README.md
```

Une réorganisation récente du dépôt garantit que le dossier **`frontend/src/lib/`** (utilitaires Vite) n'est plus exclu par les règles Python du fichier `.gitignore` global.

---

## 7. Conception et implémentation du backend

### 7.1 Module `data_pipeline.py`

- **`generate_synthetic_data(n=1500)`** : génération de données fictives (graine aléatoire 42) sur l'année 2025.
- **Communes** : M'Sila, Bou Saâda, Sidi Aïssa, Ain El Hadjel.
- **Canaux** : Appel Call Center, Formulaire Web, Plainte Écrite.
- **Types** : ADSL, Fibre FTTH, Facturation, Service Client, Interruption Réseau.
- **Statuts** : Résolu (~60 %), En Cours (~25 %), Non Traité (~15 %).
- **`clean_data`** : imputation du canal manquant (« Inconnu »), conversion des dates.
- **`extract_features`** : extraction `month`, `weekday`, `day`, `quarter`.

**Jeux produits :** 1 400 lignes historiques (`plaintes_clients_raw.csv`) et 100 lignes « nouvelles » (`plaintes_nouvelles_a_predire.csv`).

### 7.2 Module `eda.py`

Fonctions analytiques :

- **`calculate_kpis`** : total réclamations, taux de résolution (%), délai moyen (jours).
- **`aggregate_by_column`** : comptages par commune, canal, type.
- **`status_breakdown_by_column`** : tableau croisé statut × dimension.
- **`get_monthly_metrics`** : tendances mensuelles (reçues, résolues, délai moyen).

### 7.3 Serveur FastAPI (`server.py`)

| Endpoint | Méthode | Rôle |
|----------|---------|------|
| `/api/stats` | GET | KPI + agrégations + tendances mensuelles |
| `/api/complaints` | GET | Liste paginée (`skip`, `limit` ≤ 100) |
| `/api/predict` | POST | Inférence ML |

**Corps JSON de prédiction :**

```json
{
  "commune": "M'Sila",
  "canal": "Appel Call Center",
  "type_plainte": "ADSL",
  "date_plainte": "2025-06-15"
}
```

**Réponse type :**

```json
{
  "prediction": "Résolu",
  "confidence_score": 0.7234,
  "probabilities": {
    "En Cours/Non Traité": 0.2766,
    "Résolu": 0.7234
  }
}
```

CORS est ouvert (`*`) pour faciliter le développement local ; en production, il faudrait restreindre les origines.

### 7.4 Application Streamlit (`app.py`)

Interface alternative affichant KPI, graphiques Plotly (commune, canal, type × statut) et formulaire de prédiction. Utile pour démonstrations sans installer Node.js.

---

## 8. Conception et implémentation du frontend

### 8.1 Page principale

Titre SEO : *« DOT M'Sila — Analytique des réclamations | Algérie Télécom »*.

Composants :

1. **DashboardHeader** — identité visuelle DOT / Algérie Télécom.
2. **KpiCards** — cartes alimentées par `/api/stats`.
3. **Onglets** :
   - **Tableau exécutif** — graphiques Recharts (tendances, volumes par type).
   - **Prédiction & insights** — appel POST `/api/predict`, affichage probabilité et niveau de risque.
   - **Explorateur de données** — table filtrable alimentée par `/api/complaints`.

### 8.2 Configuration

Variable d'environnement `VITE_API_URL` (défaut : `http://localhost:8000`) dans `frontend/.env.local`.

### 8.3 Installation locale

```bash
cd frontend && npm install && npm run dev
```

Build production : `npm run build` (artefacts pour hébergement type Vercel).

---

## 9. Pipeline de données et modèle d'apprentissage automatique

### 9.1 Formulation du problème

**Classification binaire :**

- Classe **1** : réclamation **Résolue**
- Classe **0** : **En Cours** ou **Non Traité**

**Variables explicatives :** `commune`, `canal`, `type_plainte`, `month`, `weekday`.

### 9.2 Prétraitement

`ColumnTransformer` :

- Variables numériques → `StandardScaler`
- Variables catégorielles → `OneHotEncoder(handle_unknown='ignore')`

### 9.3 Entraînement et comparaison

- Split **80 % / 20 %**, stratifié, `random_state=42`.
- Modèles testés : **Régression logistique** et **Forêt aléatoire (Random Forest)**.

**Résultats sur jeu de test (données synthétiques) :**

| Modèle | Accuracy | Precision | Recall | F1-Score |
|--------|----------|-----------|--------|----------|
| Régression logistique | 0,5714 | 0,5880 | 0,9401 | 0,7235 |
| Random Forest | 0,5321 | 0,5874 | 0,7246 | 0,6488 |

Le modèle **Random Forest** et le préprocesseur associé ont été exportés respectivement sous `model.joblib` et `encoder.joblib` pour servir l'API. Sur données réelles, une comparaison plus rigoureuse (validation croisée, métier) serait nécessaire avant choix du modèle en production.

### 9.4 Interprétation

Les performances modestes s'expliquent par :

- nature **synthétique** des données ;
- **déséquilibre** des classes et simplification binaire (fusion En Cours + Non Traité) ;
- absence de variables riches (historique client, priorité, technicien, etc.).

---

## 10. Résultats et validation

### 10.1 Indicateurs sur le jeu historique (1 400 réclamations)

| Indicateur | Valeur |
|----------|--------|
| Total réclamations | 1 400 |
| Taux de résolution | **59,5 %** |
| Délai moyen de résolution | **7,39 jours** |

**Répartition par statut :** Résolu 833 ; En Cours 341 ; Non Traité 226.

**Répartition par commune :** Ain El Hadjel 396 ; Bou Saâda 346 ; Sidi Aïssa 341 ; M'Sila 317.

**Répartition par canal :** Plainte Écrite 466 ; Appel Call Center 446 ; Formulaire Web 417.

**Répartition par type :** volumes équilibrés entre ADSL, Fibre FTTH, Facturation, Service Client, Interruption Réseau (~275–286 chacun).

### 10.2 Validation fonctionnelle

- Démarrage backend : `python server.py` → documentation Swagger sur `/docs`.
- Démarrage frontend : `npm run dev` → dashboard accessible.
- Build frontend : **succès** (`npm run build`).
- Tests manuels : chargement KPI, graphiques, filtres explorateur, prédiction depuis l'onglet ML.

### 10.3 Livrables

- Code source monorepo sur GitHub.
- Modèles sérialisés et jeux CSV.
- README d'installation pour les collègues DOT (clone, pip, npm).

---

## 11. Limites du travail réalisé

1. **Données non réelles** — prototype pédagogique sans PII ; généralisation non garantie.
2. **Pas de base de données** — fichiers CSV statiques, pas de synchronisation CRM.
3. **Sécurité** — pas d'authentification, CORS permissif.
4. **Performance ML** — modèle à améliorer (features, rééquilibrage, tuning).
5. **Cohérence des libellés** — certaines listes frontend diffèrent légèrement des valeurs CSV backend.
6. **Pagination API** — limite de 100 enregistrements par requête ; l'explorateur frontend enchaîne les pages (`skip` / `limit=100`) pour charger l'ensemble du jeu.
7. **Déploiement** — configuration Render/Vercel à adapter explicitement au sous-dossier `backend/` après restructuration.

---

## 12. Perspectives d'évolution

- Intégration **PostgreSQL** (ou SI métier) et ETL planifié.
- **Authentification JWT** et rôles (direction, reporting, admin).
- Pipeline **MLOps** (réentraînement Airflow, suivi de dérive).
- Harmonisation des **référentiels** (communes, types, canaux) entre UI et base.
- Export **PDF/Excel** pour le reporting officiel DOT.
- Mise en production avec **HTTPS**, CORS restreint et journalisation.
- Enrichissement des features (SLA, priorité, segment client).

---

## 13. Conclusion

Ce stage m'a permis de mener un projet complet, de l'analyse du besoin métier à la livraison d'une application web connectée à un modèle d'apprentissage automatique, dans le contexte exigeant des télécommunications algériennes.

La plateforme **DOT-MSILA-Analytics** répond aux objectifs fixés avec mon encadrante **Madame Karima Amara** : visualisation des KPI, exploration des réclamations et démonstration de prédiction via API. L'architecture **monorepo** et la documentation facilitent la reprise du projet par les équipes de la DOT M'Sila, comme demandé lors des échanges sur la structure du dépôt Git.

Les limites identifiées — données simulées, modèle perfectible, absence d'authentification — ouvrent une feuille de route claire vers une mise en production progressive. Ce travail constitue une base solide pour moderniser le reporting des réclamations et pour approfondir l'usage responsable de l'IA au service de la qualité client chez Algérie Télécom.

---

## 14. Bibliographie et ressources

1. Documentation FastAPI — https://fastapi.tiangolo.com  
2. Documentation scikit-learn — https://scikit-learn.org  
3. Documentation React — https://react.dev  
4. Documentation Vite — https://vite.dev  
5. McKinney, W. — *Python for Data Analysis* (Pandas)  
6. Géron, A. — *Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow*  
7. Dépôt du projet — https://github.com/khadidjabensallah/DOT-MSILA-Analytics  

---

## 15. Annexes

### Annexe A — Colonnes du fichier `plaintes_clients_raw.csv`

| Colonne | Description |
|---------|-------------|
| client_id | Identifiant client fictif (CUSTxxxx) |
| commune | Commune de la wilaya |
| date_plainte | Date de dépôt (AAAA-MM-JJ) |
| canal | Canal de soumission |
| type_plainte | Catégorie de la réclamation |
| statut | Résolu / En Cours / Non Traité |
| date_resolution | Date de clôture si résolu |

### Annexe B — Commandes d'installation

**Backend**

```bash
cd backend
pip install -r requirements.txt
python server.py
```

**Frontend**

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env.local
npm run dev
```

**Régénération des données et entraînement**

```bash
cd backend
python src/data_pipeline.py
python src/model.py
```

### Annexe C — Compétences acquises durant le stage

- Conception d'API REST avec FastAPI et validation Pydantic.
- Manipulation de données avec Pandas et calcul d'indicateurs métier.
- Chaîne ML scikit-learn (preprocessing, entraînement, évaluation, joblib).
- Développement d'interface React/TypeScript avec consommation d'API asynchrone.
- Organisation d'un projet logiciel en **monorepo** et bonnes pratiques Git.
- Rédaction technique et communication avec les parties prenantes métier (DOT M'Sila).

---

*Fin du rapport*

**Khadidja Bensallah**  
*Sous l'encadrement de Madame Karima Amara*
