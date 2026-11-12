
// 1. Importer Express
const express = require("express");

// 2. Créer notre application Express
const app = express();

const db = require("./database");

// 3. Définir le port du serveur
const PORT = 3000;

// 4. Autoriser le serveur à recevoir des données JSON
app.use(express.json());

// 5. Rendre le dossier public accessible
app.use(express.static("public"));


/* =================================
   ROUTES DE L'API
================================= */

// Récupérer le profil
app.get("/api/profil", (req, res) => {
    const profil = db.prepare("SELECT * FROM profil LIMIT 1").get();

    res.json(profil || {});
});

// Récupérer les compétences visibles
app.get("/api/competences", (req, res) => {
    const competences = db.prepare(
        "SELECT * FROM competences WHERE visible = 1"
    ).all();

    res.json(competences);
});

app.post("/api/competences", (req, res) => {
    const { nom, categorie, niveau, description } = req.body;

    if (!nom || !categorie) {
        return res.status(400).json({
            erreur: "Le nom et la catégorie sont obligatoires."
        });
    }

    const resultat = db.prepare(`
        INSERT INTO competences (nom, categorie, niveau, description)
        VALUES (?, ?, ?, ?)
    `).run(
        nom.trim(),
        categorie,
        niveau === "" || niveau == null ? null : Number(niveau),
        description || ""
    );

    res.status(201).json({
        message: "Compétence ajoutée avec succès !",
        id: resultat.lastInsertRowid
    });
});

app.put("/api/competences/:id", (req, res) => {
    const id = Number(req.params.id);
    const { nom, categorie, niveau, description } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erreur: "Identifiant invalide."
        });
    }

    if (!nom || !nom.trim() || !categorie) {
        return res.status(400).json({
            erreur: "Le nom et la catégorie sont obligatoires."
        });
    }

    const resultat = db.prepare(`
        UPDATE competences
        SET nom = ?, categorie = ?, niveau = ?, description = ?
        WHERE id = ?
    `).run(
        nom.trim(),
        categorie,
        niveau === "" || niveau == null ? null : Number(niveau),
        description || "",
        id
    );

    if (resultat.changes === 0) {
        return res.status(404).json({
            erreur: "Compétence introuvable."
        });
    }

    res.json({
        message: "Compétence modifiée avec succès !"
    });
});

app.delete("/api/competences/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erreur: "Identifiant invalide."
        });
    }

    const resultat = db.prepare(
        "DELETE FROM competences WHERE id = ?"
    ).run(id);

    if (resultat.changes === 0) {
        return res.status(404).json({
            erreur: "Compétence introuvable."
        });
    }

    res.json({
        message: "Compétence supprimée avec succès !"
    });
});

// Récupérer les projets
app.get("/api/projets", (req, res) => {
    const projets = db.prepare(
        "SELECT * FROM projets ORDER BY id DESC"
    ).all();

    res.json(projets);
});


app.post("/api/projets", (req, res) => {
    const { titre, description, categorie, statut } = req.body;

    if (
        typeof titre !== "string" || !titre.trim() ||
        typeof description !== "string" || !description.trim()
    ) {
        return res.status(400).json({
            erreur: "Le titre et la description sont obligatoires."
        });
    }

    const resultat = db.prepare(`
        INSERT INTO projets (titre, description, categorie, statut)
        VALUES (?, ?, ?, ?)
    `).run(
        titre.trim(),
        description.trim(),
        typeof categorie === "string" ? categorie.trim() : null,
        typeof statut === "string" && statut.trim()
            ? statut.trim()
            : "en cours"
    );

    res.status(201).json({
        message: "Projet ajouté avec succès !",
        id: resultat.lastInsertRowid
    });
});


app.put("/api/projets/:id", (req, res) => {
    const id = Number(req.params.id);
    const { titre, description, categorie, statut } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erreur: "Identifiant invalide."
        });
    }

    if (
        typeof titre !== "string" || !titre.trim() ||
        typeof description !== "string" || !description.trim()
    ) {
        return res.status(400).json({
            erreur: "Le titre et la description sont obligatoires."
        });
    }

    const resultat = db.prepare(`
        UPDATE projets
        SET titre = ?, description = ?, categorie = ?, statut = ?
        WHERE id = ?
    `).run(
        titre.trim(),
        description.trim(),
        typeof categorie === "string" ? categorie.trim() : null,
        typeof statut === "string" && statut.trim()
            ? statut.trim()
            : "en cours",
        id
    );

    if (resultat.changes === 0) {
        return res.status(404).json({
            erreur: "Projet introuvable."
        });
    }

    res.json({
        message: "Projet modifié avec succès."
    });
});


app.delete("/api/projets/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erreur: "Identifiant invalide."
        });
    }

    const resultat = db.prepare(
        "DELETE FROM projets WHERE id = ?"
    ).run(id);

    if (resultat.changes === 0) {
        return res.status(404).json({
            erreur: "Projet introuvable."
        });
    }

    res.json({
        message: "Projet supprimé avec succès."
    });
});


// Enregistrer un message de contact
app.post("/api/messages", (req, res) => {
    const { nom, email, message } = req.body;

    if (!nom || !email || !message) {
        return res.status(400).json({
            erreur: "Tous les champs sont obligatoires."
        });
    }

    const resultat = db.prepare(`
        INSERT INTO messages (nom, email, message)
        VALUES (?, ?, ?)
    `).run(nom, email, message);

    res.status(201).json({
        message: "Message enregistré avec succès !",
        id: resultat.lastInsertRowid
    });
});


// Récupérer tous les messages de contact
app.get("/api/messages", (req, res) => {
    const messages = db.prepare(`
        SELECT * FROM messages
        ORDER BY date_envoi DESC
    `).all();

    res.json(messages);
});


app.delete("/api/messages/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erreur: "Identifiant invalide."
        });
    }

    const resultat = db.prepare(
        "DELETE FROM messages WHERE id = ?"
    ).run(id);

    if (resultat.changes === 0) {
        return res.status(404).json({
            erreur: "Message introuvable."
        });
    }

    res.json({
        message: "Message supprimé avec succès."
    });
});


// 6. Créer une première route de test
app.get("/api/test", (req, res) => {
    res.json({
        message: "Notre API fonctionne correctement !"
    });
});

// 7. Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
