# 🎓 EduMaster - Plateforme de Gestion d'Apprentissage

## 📋 Description du Projet

**EduMaster** est une application backoffice de gestion d'apprentissage développée en JavaScript, HTML5 et CSS3. Elle permet la gestion complète d'une plateforme éducative avec des fonctionnalités CRUD avancées, un système de permissions multi-niveaux, et des tableaux de bord analytiques.

### 🎯 Thème Choisi
**Administration Scolaire** - Gestion des étudiants, professeurs, cours, modules et ressources pédagogiques.

---

## ✅ Conformité au Cahier des Charges

### 1. Entités CRUD (5+ Requis) ✓

L'application gère **6 entités principales** :

| Entité | Description | Opérations CRUD |
|--------|-------------|-----------------|
| **Users** | 4 types de rôles (Super Admin, Admin, Teacher, Student) | ✅ Create, Read, Update, Delete |
| **Courses** | Cours créés par les enseignants | ✅ Create, Read, Update, Delete |
| **Modules** | Modules de cours (1 cours = N modules) | ✅ Create, Read, Update, Delete |
| **Resources** | Ressources pédagogiques (PDF, vidéos, liens) | ✅ Create, Read, Update, Delete |
| **Enrollments** | Inscriptions des étudiants aux cours | ✅ Create, Read, Delete |
| **Profiles** | Profils utilisateurs | ✅ Read, Update |

### 2. Dashboard avec Statistiques ✓

Le tableau de bord Super Admin contient **5+ graphiques** (requis minimum : 5) :

1. **Donut Chart** - Répartition par rôle (Admins/Enseignants/Étudiants)
2. **Line Chart** - Évolution des inscriptions sur 6 mois
3. **Bar Chart** - Activité mensuelle (Cours créés vs Utilisateurs actifs)
4. **Pie Chart** - Statut des utilisateurs (Actifs/Inactifs)
5. **Scatter Plot** - Analyse Cours vs Modules/Ressources

**Indicateurs clés affichés** :
- Nombre total d'utilisateurs
- Nombre d'enseignants
- Nombre d'étudiants
- Nombre de cours actifs

### 3. Gestion des Données ✓

**Option choisie** : Données simulées avec localStorage

- Utilisation de `localStorage` pour la persistance des données
- Seed data initial avec utilisateurs de test
- Structure JSON bien définie
- DataStore class pour les opérations CRUD

**Identifiants de test** :
```
Super Admin : superadmin@test.com / password123
Admin       : admin@test.com / password123
Enseignant  : teacher@test.com / password123
Étudiant    : student@test.com / password123
```

### 4. Design Responsive & Professionnel ✓

- ✅ **Framework CSS** : Tailwind CSS (via CDN)
- ✅ **Bibliothèques JS** : Chart.js, jQuery
- ✅ **Responsive** : Grid et Flexbox pour tous les écrans
- ✅ **Design moderne** : Gradients, shadows, animations fluides
- ✅ **Menu latéral** : Navigation dynamique par rôle
- ✅ **Page de Login** : Authentification avec credentials statiques
- ✅ **Navbar** : Logo, bouton déconnexion, informations utilisateur

### 5. Fonctionnalités Avancées ✓

#### Gestion des Permissions (Hiérarchie stricte)
```
Super Admin (Directeur/Client)
    ↓ Gère
Admin (Administrateur)
    ↓ Gère
Teacher (Enseignant) / Student (Étudiant)
```

**Règles de permissions** :
- **Super Admin** : CRUD complet sur tous les utilisateurs (sauf création d'autres Super Admins)
- **Admin** : CRUD uniquement sur Teachers et Students
- **Teacher** : Gestion de ses propres cours, modules et ressources
- **Student** : Consultation des cours, inscription, accès aux ressources

#### Upload de Fichiers Réel
- Utilisation de l'API FileReader
- Support PDF, MP4, AVI, MOV
- Conversion en base64 pour stockage
- Limite de 50MB par fichier

#### Système de Notifications
- Toast notifications pour toutes les actions
- Types : Success, Error, Warning, Info
- Auto-dismiss après 3 secondes

#### Classes ES6 & Programmation Avancée
- `AuthService` : Gestion authentification et sessions
- `DataStore` : Abstraction CRUD pour localStorage
- `NotificationSystem` : Système de notifications
- `Layout` : Génération dynamique du menu

---

## 🏗️ Architecture du Projet

### Structure des Fichiers

```
Mini_App_WebDev/
│
├── index.html                 # Page de connexion
├── README.md                  # Ce fichier
│
├── assets/
│   ├── css/
│   │   └── style.css         # Styles personnalisés + animations
│   └── js/
│       ├── auth.js           # Service d'authentification
│       ├── data.js           # DataStore + seed data
│       ├── layout.js         # Génération dynamique du menu
│       └── notifications.js  # Système de notifications toast
│
└── pages/
    ├── admin/
    │   ├── dashboard.html    # Dashboard avec 5+ graphiques
    │   └── users.html        # Gestion utilisateurs (CRUD)
    │
    ├── teacher/
    │   ├── dashboard.html    # Dashboard enseignant
    │   ├── courses.html      # Liste des cours
    │   ├── course-edit.html  # Création/édition de cours
    │   └── course-details.html # Gestion modules & ressources
    │
    ├── student/
    │   ├── dashboard.html    # Dashboard étudiant
    │   ├── catalogue.html    # Catalogue de cours
    │   ├── my-courses.html   # Mes cours
    │   └── course-view.html  # Vue lecture seule du cours
    │
    └── common/
        └── profile.html      # Profil utilisateur
```

### Choix Architectural : Multi-Page Application (MPA)

**Pourquoi MPA plutôt que SPA ?**

1. **Séparation des responsabilités** : Chaque rôle a ses propres pages
2. **Meilleure organisation** : Code modulaire et maintenable
3. **Sécurité** : Isolation naturelle entre les rôles
4. **Performance** : Chargement uniquement des ressources nécessaires
5. **Scalabilité** : Facile d'ajouter de nouvelles fonctionnalités

> **Note** : Bien que le professeur ait montré un exemple avec 2 fichiers (SPA), le cahier des charges n'impose aucune structure spécifique. Notre approche MPA est plus professionnelle et adaptée à un projet de cette envergure.

---

## 🚀 Installation & Utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Edge)
- Aucune installation serveur requise

### Lancement

1. **Cloner le repository**
   ```bash
   git clone [URL_DU_REPO]
   cd Mini_App_WebDev
   ```

2. **Ouvrir l'application**
   - Ouvrir `index.html` dans un navigateur
   - Ou utiliser un serveur local :
     ```bash
     # Avec Python
     python -m http.server 8000
     
     # Avec Node.js
     npx http-server
     ```

3. **Se connecter**
   - Utiliser les identifiants de test ci-dessus
   - Explorer les différents rôles

### Navigation

- **Super Admin** : Accès complet, dashboard analytique, gestion de tous les utilisateurs
- **Admin** : Gestion des enseignants et étudiants
- **Enseignant** : Création de cours, modules, upload de ressources
- **Étudiant** : Inscription aux cours, consultation des ressources

---

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes + Tailwind CSS
- **JavaScript (ES6+)** : Logique applicative

### Bibliothèques
- **Tailwind CSS** : Framework CSS utility-first
- **Chart.js** : Graphiques interactifs
- **jQuery** : Manipulation DOM simplifiée
- **FontAwesome** : Icônes

### APIs & Fonctionnalités Avancées
- **localStorage API** : Persistance des données
- **FileReader API** : Upload de fichiers
- **Classes ES6** : Architecture orientée objet
- **Async/Await** : Opérations asynchrones

---

## 📊 Fonctionnalités Détaillées

### Pour le Super Admin
- ✅ Dashboard avec 5+ graphiques analytiques
- ✅ Gestion complète des Admins (CRUD)
- ✅ Vue d'ensemble de tous les utilisateurs
- ✅ Statistiques en temps réel
- ✅ Protection du compte Super Admin (unique et non supprimable)

### Pour l'Admin
- ✅ Gestion des Enseignants (CRUD)
- ✅ Gestion des Étudiants (CRUD)
- ✅ Statistiques simplifiées
- ✅ Profil en lecture seule

### Pour l'Enseignant
- ✅ Création et gestion de cours
- ✅ Organisation en modules
- ✅ Upload de ressources (PDF, vidéos)
- ✅ Ajout de liens externes
- ✅ Suppression de modules/ressources

### Pour l'Étudiant
- ✅ Catalogue de cours disponibles
- ✅ Inscription aux cours
- ✅ Accès aux modules et ressources
- ✅ Téléchargement de documents

---

## 🎨 Caractéristiques UX/UI

- **Design Premium** : Interface moderne avec gradients et animations
- **Notifications Toast** : Feedback visuel pour chaque action
- **Micro-interactions** : Effets hover, transitions fluides
- **Responsive Design** : Adapté mobile, tablette, desktop
- **Accessibilité** : Contraste élevé, navigation au clavier
- **Scrollbar personnalisée** : Design cohérent

---

## 📈 Améliorations Futures

### Fonctionnalités en cours d'implémentation
- [ ] Pagination sur les tableaux
- [ ] Tri des colonnes
- [ ] Export CSV
- [ ] Pages "Voir Détails" avec export PDF
- [ ] Internationalisation (Ar/Fr/En)
- [ ] Filtres dynamiques sur le dashboard

### Évolutions possibles
- [ ] Intégration d'une vraie API backend
- [ ] Système de messagerie interne
- [ ] Calendrier des cours
- [ ] Quiz et évaluations
- [ ] Certificats de completion

---

## 👥 Équipe de Développement

**Projet réalisé dans le cadre du cours de JavaScript**

- Développement Frontend
- Architecture & Design
- Gestion de projet

---

## 📝 Licence

Ce projet est réalisé à des fins éducatives dans le cadre d'un cours universitaire.

---

## 🔗 Liens Utiles

- **Repository GitHub** : [À compléter]
- **Application Déployée** : [À compléter - GitHub Pages/Vercel/Netlify]
- **Documentation** : Ce README

---

## 📞 Support

Pour toute question ou problème :
1. Consulter ce README
2. Vérifier les identifiants de connexion
3. Vider le cache du navigateur si nécessaire
4. Contacter l'équipe de développement

---

**Dernière mise à jour** : Janvier 2026

**Version** : 1.0.0
