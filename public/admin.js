async function chargerMessages() {
  const container = document.getElementById("messages-container");

  try {
    const reponse = await fetch("/api/messages");

    if (!reponse.ok) {
      throw new Error("Impossible de récupérer les messages.");
    }

    const messages = await reponse.json();

    container.innerHTML = "";

    if (messages.length === 0) {
      container.textContent = "Aucun message reçu pour le moment.";
      return;
    }

    messages.forEach((message) => {
      const article = document.createElement("article");

      const nom = document.createElement("h3");
      nom.textContent = message.nom;

      const email = document.createElement("p");
      email.textContent = "Email : " + message.email;

      const contenu = document.createElement("p");
      contenu.textContent = message.message;

      const date = document.createElement("small");
      date.textContent = "Envoyé le : " + message.date_envoi;

      const boutonSupprimer = document.createElement("button");
      boutonSupprimer.textContent = "Supprimer";

      boutonSupprimer.addEventListener("click", async () => {
        const confirmation = await confirmerSuppression(
          "Voulez-vous vraiment supprimer cet élément ?",
        );

        if (!confirmation) return;

        if (!confirmation) return;

        try {
          const reponse = await fetch(`/api/messages/${message.id}`, {
            method: "DELETE",
          });

          const resultat = await reponse.json();

          if (!reponse.ok) {
            throw new Error(resultat.erreur);
          }

          afficherNotification("Message supprimé avec succès !");
          chargerMessages();
        } catch (erreur) {
          afficherNotification("Erreur lors de la suppression.", "error");
          console.error(erreur);
        }
      });

      article.append(nom, email, contenu, date, boutonSupprimer);

      article.style.border = "1px solid #ccc";
      article.style.padding = "15px";
      article.style.marginBottom = "15px";

      container.appendChild(article);
    });
  } catch (erreur) {
    container.textContent = "Erreur lors du chargement des messages.";
    console.error(erreur);
  }
}

chargerMessages();

const projectForm = document.getElementById("project-form");

if (projectForm) {
  projectForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titre = document.getElementById("titre").value.trim();
    const description = document.getElementById("description").value.trim();
    const categorie = document.getElementById("categorie").value;
    const statut = document.getElementById("statut").value;

    try {
      const reponse = await fetch("/api/projets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titre,
          description,
          categorie,
          statut,
        }),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        throw new Error(resultat.erreur || "Erreur lors de l'ajout.");
      }

      afficherNotification("Projet ajouté avec succès !");
      projectForm.reset();
    } catch (erreur) {
      console.error(erreur);
      afficherNotification("Impossible d'ajouter le projet.", "error");
    }
  });
}

async function chargerProjetsAdmin() {
  const container = document.getElementById("projects-container");

  try {
    const reponse = await fetch("/api/projets");

    if (!reponse.ok) {
      throw new Error("Impossible de charger les projets.");
    }

    const projets = await reponse.json();

    container.innerHTML = "";

    if (projets.length === 0) {
      container.textContent = "Aucun projet enregistré.";
      return;
    }

    projets.forEach((projet) => {
      const article = document.createElement("article");

      const titre = document.createElement("h3");
      titre.textContent = projet.titre;

      const description = document.createElement("p");
      description.textContent = projet.description;

      const categorie = document.createElement("p");
      categorie.textContent =
        "Catégorie : " + (projet.categorie || "Non définie");

      const statut = document.createElement("p");
      statut.textContent = "Statut : " + projet.statut;

      const boutonModifier = document.createElement("button");
      boutonModifier.textContent = "Modifier";

      boutonModifier.addEventListener("click", async () => {
        const nouveauTitre = prompt("Nouveau titre :", projet.titre);

        if (nouveauTitre === null) return;

        const nouvelleDescription = prompt(
          "Nouvelle description :",
          projet.description,
        );

        if (nouvelleDescription === null) return;

        const nouvelleCategorie = prompt(
          "Nouvelle catégorie :",
          projet.categorie || "html",
        );

        if (nouvelleCategorie === null) return;

        const nouveauStatut = prompt(
          "Nouveau statut (en cours ou termine) :",
          projet.statut,
        );

        if (nouveauStatut === null) return;

        try {
          const reponse = await fetch(`/api/projets/${projet.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              titre: nouveauTitre,
              description: nouvelleDescription,
              categorie: nouvelleCategorie,
              statut: nouveauStatut,
            }),
          });

          const resultat = await reponse.json();

          if (!reponse.ok) {
            throw new Error(resultat.erreur || "Erreur de modification.");
          }

          afficherNotification("Projet modifié avec succès !");
          chargerProjetsAdmin();
        } catch (erreur) {
          afficherNotification("Impossible de modifier le projet.", "error");
          console.error(erreur);
        }
      });

      article.append(titre, description, categorie, statut, boutonModifier);

      const boutonSupprimer = document.createElement("button");
      boutonSupprimer.textContent = "Supprimer";

      boutonSupprimer.addEventListener("click", async () => {
        const confirmation = await confirmerSuppression(
          "Voulez-vous vraiment supprimer cet élément ?",
        );

        if (!confirmation) return;

        if (!confirmation) return;

        try {
          const reponse = await fetch(`/api/projets/${projet.id}`, {
            method: "DELETE",
          });

          const resultat = await reponse.json();

          if (!reponse.ok) {
            throw new Error(resultat.erreur || "Erreur de suppression.");
          }

          afficherNotification("Projet supprimé avec succès !");
          chargerProjetsAdmin();
        } catch (erreur) {
          afficherNotification("Impossible de supprimer le projet.", "error");
          console.error(erreur);
        }
      });

      article.appendChild(boutonSupprimer);

      container.appendChild(article);
    });
  } catch (erreur) {
    container.textContent = "Erreur lors du chargement des projets.";
    console.error(erreur);
  }
}

chargerProjetsAdmin();

async function chargerStatistiques() {
  try {
    const [reponseProjets, reponseMessages] = await Promise.all([
      fetch("/api/projets"),
      fetch("/api/messages"),
    ]);

    if (!reponseProjets.ok || !reponseMessages.ok) {
      throw new Error("Impossible de charger les statistiques.");
    }

    const projets = await reponseProjets.json();
    const messages = await reponseMessages.json();

    document.getElementById("total-projects").textContent = projets.length;

    document.getElementById("total-messages").textContent = messages.length;
  } catch (erreur) {
    console.error("Erreur statistiques :", erreur);
  }
}

chargerStatistiques();

function rechercherElements(inputId, containerId) {
  const champ = document.getElementById(inputId);
  const container = document.getElementById(containerId);

  if (!champ || !container) return;

  champ.addEventListener("input", () => {
    const recherche = champ.value.toLowerCase().trim();

    const elements = container.querySelectorAll("article");

    elements.forEach((element) => {
      const contenu = element.textContent.toLowerCase();

      element.style.display = contenu.includes(recherche) ? "" : "none";
    });
  });
}

rechercherElements("search-projects", "projects-container");
rechercherElements("search-messages", "messages-container");

// ===== AFFICHER UNE NOTIFICATION =====

function afficherNotification(message, type = "success") {
  const notification = document.getElementById("notification");

  notification.textContent = message;
  notification.className = "notification " + type + " show";

  clearTimeout(window.notificationTimer);

  window.notificationTimer = setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// ===== CONFIRMATION PERSONNALISEE =====

function confirmerSuppression(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirmation-modal");
    const texte = document.getElementById("confirmation-text");
    const boutonOui = document.getElementById("confirm-delete");
    const boutonNon = document.getElementById("cancel-delete");

    texte.textContent = message;
    modal.classList.add("show");

    function terminer(reponse) {
      modal.classList.remove("show");

      boutonOui.removeEventListener("click", oui);
      boutonNon.removeEventListener("click", non);

      resolve(reponse);
    }

    function oui() {
      terminer(true);
    }

    function non() {
      terminer(false);
    }

    boutonOui.addEventListener("click", oui);
    boutonNon.addEventListener("click", non);
  });
}

async function chargerCompetencesAdmin() {
  try {
    const reponse = await fetch("/api/competences");

    if (!reponse.ok) {
      throw new Error("Impossible de charger les compétences.");
    }

    const competences = await reponse.json();

    const conteneur = document.getElementById("skills-container");
    conteneur.innerHTML = "";

    competences.forEach((competence) => {
      const carte = document.createElement("article");

      const titre = document.createElement("h3");
      titre.textContent = competence.nom;

      const categorie = document.createElement("p");
      categorie.textContent = "Catégorie : " + competence.categorie;

      const niveau = document.createElement("p");
      niveau.textContent =
        "Niveau : " +
        (competence.niveau !== null
          ? competence.niveau + "%"
          : "Non renseigné");

      const description = document.createElement("p");
      description.textContent = competence.description || "Aucune description";

      const boutonModifier = document.createElement("button");
      boutonModifier.textContent = "Modifier";

      boutonModifier.addEventListener("click", async () => {
        const nom = prompt("Nouveau nom :", competence.nom);
        if (nom === null) return;

        const categorie = prompt("Nouvelle catégorie :", competence.categorie);
        if (categorie === null) return;

        const niveau = prompt(
          "Nouveau niveau (0 à 100) :",
          competence.niveau ?? "",
        );
        if (niveau === null) return;

        const description = prompt(
          "Nouvelle description :",
          competence.description || "",
        );
        if (description === null) return;

        if (!nom.trim() || !categorie.trim()) {
          afficherNotification(
            "Le nom et la catégorie sont obligatoires.",
            "error",
          );
          return;
        }

        if (
          niveau !== "" &&
          (!Number.isInteger(Number(niveau)) ||
            Number(niveau) < 0 ||
            Number(niveau) > 100)
        ) {
          afficherNotification(
            "Le niveau doit être compris entre 0 et 100.",
            "error",
          );
          return;
        }

        try {
          const reponse = await fetch(`/api/competences/${competence.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nom,
              categorie,
              niveau,
              description,
            }),
          });

          const resultat = await reponse.json();

          if (!reponse.ok) {
            throw new Error(
              resultat.erreur || "Erreur lors de la modification.",
            );
          }

          afficherNotification("Compétence modifiée avec succès !");
          chargerCompetencesAdmin();
        } catch (erreur) {
          afficherNotification(erreur.message, "error");
        }
      });

      

      carte.appendChild(boutonModifier);

      const boutonSupprimer = document.createElement("button");
boutonSupprimer.textContent = "Supprimer";

boutonSupprimer.addEventListener("click", async () => {
    const confirmation = await confirmerSuppression(
        `Voulez-vous vraiment supprimer la compétence "${competence.nom}" ?`
    );

    if (!confirmation) return;

    try {
        const reponse = await fetch(`/api/competences/${competence.id}`, {
            method: "DELETE"
        });

        const resultat = await reponse.json();

        if (!reponse.ok) {
            throw new Error(resultat.erreur || "Erreur lors de la suppression.");
        }

        afficherNotification("Compétence supprimée avec succès !");
        chargerCompetencesAdmin();
        chargerStatistiques();

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
});

carte.appendChild(boutonSupprimer);

      carte.appendChild(titre);
      carte.appendChild(categorie);
      carte.appendChild(niveau);
      carte.appendChild(description);

      conteneur.appendChild(carte);
    });
  } catch (erreur) {
    console.error(erreur);
    afficherNotification("Erreur lors du chargement des compétences.", "error");
  }
}

chargerCompetencesAdmin();

const skillForm = document.getElementById("skill-form");

skillForm.addEventListener("submit", async (evenement) => {
  evenement.preventDefault();

  const nom = document.getElementById("skill-name").value;
  const categorie = document.getElementById("skill-category").value;
  const niveau = document.getElementById("skill-level").value;
  const description = document.getElementById("skill-description").value;

  try {
    const reponse = await fetch("/api/competences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom,
        categorie,
        niveau,
        description,
      }),
    });

    const resultat = await reponse.json();

    if (!reponse.ok) {
      throw new Error(resultat.erreur || "Erreur lors de l'ajout.");
    }

    afficherNotification("Compétence ajoutée avec succès !");
    skillForm.reset();

    chargerCompetencesAdmin();
    chargerStatistiques();
  } catch (erreur) {
    afficherNotification(erreur.message, "error");
  }
});
