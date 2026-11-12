
const db = require("./database");

// Vérifier si les compétences existent déjà
const nombreCompetences = db.prepare(
    "SELECT COUNT(*) AS total FROM competences"
).get().total;

// Insérer les compétences uniquement si la table est vide
if (nombreCompetences === 0) {

    const ajouterCompetence = db.prepare(`
        INSERT INTO competences
        (nom, categorie, niveau, description)
        VALUES (?, ?, ?, ?)
    `);

    const competences = [
        ["HTML5 sémantique", "Frontend", 90, "Structure des pages web"],
        ["CSS3 / Flexbox / Grid", "Frontend", 80, "Mise en forme et disposition"],
        ["JavaScript (ES6+)", "Frontend", 65, "Programmation et interaction"],
        ["Responsive design", "Frontend", null, "Adaptation aux écrans"],
        ["Git & GitHub", "Outils", null, "Gestion de versions"],
        ["Figma", "Outils", null, "Conception d'interfaces"],
        ["Node.js", "Backend", null, "Développement serveur"],
        ["SQLite", "Base de données", null, "Gestion des données"]
    ];

    const insererCompetences = db.transaction((liste) => {
        liste.forEach((competence) => {
            ajouterCompetence.run(...competence);
        });
    });

    insererCompetences(competences);
}

// Vérifier si les projets existent déjà
const nombreProjets = db.prepare(
    "SELECT COUNT(*) AS total FROM projets"
).get().total;

// Insérer les projets uniquement si la table est vide
if (nombreProjets === 0) {

    const ajouterProjet = db.prepare(`
        INSERT INTO projets
        (titre, description, statut, categorie)
        VALUES (?, ?, ?, ?)
    `);

    const projets = [
        [
            "Page de présentation",
            "Landing page responsive construite avec Flexbox et Grid.",
            "termine",
            "html"
        ],
        [
            "To-do list",
            "Ajout, suppression et filtrage de tâches avec manipulation du DOM.",
            "termine",
            "js"
        ],
        [
            "Application météo",
            "Appel d'API et affichage dynamique des prévisions.",
            "termine",
            "js"
        ],
        [
            "Galerie photo",
            "Grille adaptative avec effets au survol.",
            "termine",
            "html"
        ]
    ];

    const insererProjets = db.transaction((liste) => {
        liste.forEach((projet) => {
            ajouterProjet.run(...projet);
        });
    });

    insererProjets(projets);
}

console.log("Données de démonstration enregistrées avec succès !");
