# 💼 Portfolio personnel

## 📌 Présentation du projet

Ce projet consiste à développer un portfolio personnel dynamique permettant de présenter un profil professionnel, ses compétences et ses réalisations.

L'application dispose de deux espaces :

- **Espace public :** permet aux visiteurs de découvrir le portfolio, de consulter les compétences et les projets, et d'envoyer un message.
- **Espace administration :** permet de gérer les projets, les compétences et les messages reçus.

Les données sont stockées dans une base de données SQLite et récupérées dynamiquement grâce à une API développée avec Node.js et Express.

---

## 🎯 Objectifs du projet

- Développer une application web dynamique.
- Mettre en place une API REST avec Express.
- Utiliser SQLite pour stocker les données.
- Manipuler les données avec des requêtes SQL.
- Communiquer entre le frontend et le backend avec `fetch()`.
- Créer une interface d'administration.
- Mettre en pratique les opérations CRUD.
- Utiliser Git et GitHub pour versionner le projet.

---

## 🛠️ Technologies utilisées

### Frontend
- HTML5 : structure des pages.
- CSS3 : mise en forme et design responsive.
- JavaScript : interactions et communication avec l'API.
- Fetch API : échanges de données avec le serveur.

### Backend
- Node.js : environnement d'exécution JavaScript.
- Express.js : création du serveur et des routes API.
- Nodemon : redémarrage automatique du serveur pendant le développement.

### Base de données
- SQLite : système de gestion de base de données.
- Better-SQLite3 : connexion et manipulation de la base de données.

### Outils
- Visual Studio Code.
- Postman : test des routes API.
- Git et GitHub : gestion des versions du projet.

---

## ✨ Fonctionnalités

### 1. Espace public

- Présentation du profil.
- Affichage dynamique des compétences.
- Affichage dynamique des projets.
- Filtrage des projets par catégorie.
- Formulaire de contact.
- Enregistrement des messages dans la base de données.
- Interface responsive.

### 2. Espace administration

Accessible depuis :

`http://localhost:3000/admin.html`

#### Gestion des projets
- Ajouter un projet.
- Afficher la liste des projets.
- Modifier un projet.
- Supprimer un projet.

#### Gestion des compétences
- Ajouter une compétence.
- Afficher les compétences.
- Modifier une compétence.
- Supprimer une compétence.
- Définir une catégorie, un niveau et une description.

#### Gestion des messages
- Consulter les messages reçus.
- Rechercher un message.
- Supprimer un message.

#### Tableau de bord
- Affichage du nombre total de projets.
- Affichage du nombre total de messages.
- Recherche dans les listes.
- Notifications personnalisées.
- Fenêtre de confirmation avant suppression.

---

## 🗄️ Base de données

Le projet utilise SQLite avec les tables suivantes :

| Table         | Description                               |

| `profil`      | Informations du propriétaire du portfolio |
| `competences` | Compétences et niveaux                    |
| `projets`     | Projets présentés dans le portfolio       |
| `messages`    | Messages envoyés par les visiteurs        |

Les données sont récupérées depuis la base de données et affichées dynamiquement dans les pages.

---

## 📁 Structure du projet

```text
portfolio/
│
├── database/
│   └── portfolio.db
│
├── public/
│   ├── index.html
│   ├── admin.html
│   ├── style.css
│   ├── admin.css
│   ├── script.js
│   └── admin.js
│
├── database.js
├── seed.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

**Rôle des principaux fichiers :**

- `server.js` : configure le serveur Express et les routes API.
- `database.js` : initialise la connexion SQLite et crée les tables.
- `seed.js` : insère les données de départ dans la base de données.
- `index.html` : page publique du portfolio.
- `admin.html` : interface d'administration.
- `script.js` : gère les interactions de la page publique.
- `admin.js` : gère les fonctionnalités de l'administration.
- `style.css` : styles de la page publique.
- `admin.css` : styles de la page d'administration.
- `package.json` : contient les dépendances et les scripts npm.

---

## ⚙️ Installation et configuration

### Prérequis

Avant de commencer, il faut installer :

- Node.js et npm.
- Git.
- Visual Studio Code (recommandé).

### 1. Récupérer le projet

```bash
git clone URL_DU_DEPOT_GITHUB
```

Remplacer `URL_DU_DEPOT_GITHUB` par l'adresse réelle du dépôt GitHub.

Entrer dans le dossier :

```bash
cd portfolio
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande installe les dépendances nécessaires au fonctionnement du projet.

### 3. Initialiser la base de données

```bash
node initialiser-bdd.js
```

Cette commande ajoute les données de démonstration dans la base de données si les tables concernées sont vides.

### 4. Démarrer le serveur

En mode développement :

```bash
npm run dev
```

Ou en mode normal :

```bash
npm start
```

Lorsque le serveur démarre correctement, un message indique que la base de données est connectée et que le serveur est disponible.

### 5. Accéder à l'application

**Portfolio public :**

http://localhost:3000

**Administration :**

http://localhost:3000/admin.html

---

## 🔌 API REST

L'application communique avec le backend grâce à plusieurs routes API.

### Profil

| Méthode | Route         | Description         |

| GET     | `/api/profil` | Récupérer le profil |

### Compétences

| Méthode |  Route                 | Description                       |

| GET     | `/api/competences`     | Afficher les compétences visibles |
| POST    | `/api/competences`     | Ajouter une compétence            |
| PUT     | `/api/competences/:id` | Modifier une compétence           |
| DELETE  | `/api/competences/:id` | Supprimer une compétence          |

### Projets

| Méthode |  Route             | Description          |

| GET     | `/api/projets`     | Afficher les projets |
| POST    | `/api/projets`     | Ajouter un projet    |
| PUT     | `/api/projets/:id` | Modifier un projet   |
| DELETE  | `/api/projets/:id` | Supprimer un projet  |

### Messages

| Méthode |  Route              | Description            |

| GET     | `/api/messages`     | Afficher les messages  |
| POST    | `/api/messages`     | Enregistrer un message |
| DELETE  | `/api/messages/:id` | Supprimer un message   |

---

## 🔐 Sécurité et bonnes pratiques

- Utilisation de requêtes SQL préparées pour les opérations sur la base de données.
- Vérification des données envoyées à l'API.
- Utilisation de `.gitignore` pour exclure les fichiers inutiles ou sensibles.
- Utilisation de `textContent` pour afficher les données reçues sans interpréter leur contenu comme du HTML.

**Important :** dans la version actuelle, les routes d'administration ne sont pas protégées par une authentification. L'administration est donc destinée à un environnement de démonstration ou de développement local. Une authentification et des contrôles d'accès devront être ajoutés avant toute mise en ligne publique.

---

## 🚀 Améliorations futures

Plusieurs améliorations peuvent être envisagées :

- Ajouter un système de connexion administrateur.
- Ajouter une gestion complète du profil.
- Améliorer les animations et les interactions.

---

## 👨‍💻 Auteur

**Patrick**

Projet réalisé dans le cadre d'un projet de formation et d'un examen de développement web.

---

## 📄 Licence

Projet réalisé à des fins pédagogiques et personnelles.