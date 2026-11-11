
// 1. Importer better-sqlite3
const Database = require("better-sqlite3");

// 2. Créer ou ouvrir la base de données
const db = new Database("./database/portfolio.db");

// 3. Activer les clés étrangères
db.pragma("foreign_keys = ON");

// 4. Créer les tables
db.exec(`

    -- Table du profil
    CREATE TABLE IF NOT EXISTS profil (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        prenom TEXT NOT NULL,
        poste TEXT,
        description TEXT,
        email TEXT,
        telephone TEXT,
        localisation TEXT,
        photo TEXT,
        cv TEXT,
        github TEXT,
        linkedin TEXT
    );

    -- Table des compétences
    CREATE TABLE IF NOT EXISTS competences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        categorie TEXT NOT NULL,
        niveau INTEGER CHECK(niveau BETWEEN 0 AND 100),
        icone TEXT,
        description TEXT,
        visible INTEGER DEFAULT 1
    );

    -- Table des projets
    CREATE TABLE IF NOT EXISTS projets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        date_debut TEXT,
        date_fin TEXT,
        statut TEXT DEFAULT 'en cours',
        url_demo TEXT,
        url_github TEXT,
        categorie TEXT,
        vedette INTEGER DEFAULT 0
    );

    -- Table des messages de contact
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        date_envoi TEXT DEFAULT CURRENT_TIMESTAMP,
        statut TEXT DEFAULT 'non lu'
    );

`);

// 5. Exporter la connexion pour les autres fichiers
module.exports = db;

console.log("Base de données connectée avec succès !");
