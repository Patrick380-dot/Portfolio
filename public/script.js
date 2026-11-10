// ============================================
// Portfolio – script.js
// ============================================

const root = document.documentElement; // la balise <html>


// ---------- 1. Thème clair / sombre ----------

const themeButton = document.getElementById("theme");

// Renvoie true si la page est actuellement en mode sombre
function isDarkMode() {
  const selectedTheme = root.getAttribute("data-theme");

  if (selectedTheme) {
    return selectedTheme === "dark";
  }
  // Pas de choix fait : on suit le réglage de l'ordinateur / du téléphone
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Applique un thème et le mémorise dans le navigateur
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Si le stockage est bloqué, on ignore : le thème marchera quand même
  }
}

// Au chargement : on remet le thème choisi la dernière fois
try {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  }
} catch (error) {}

// Au clic : on bascule entre sombre et clair
themeButton.addEventListener("click", () => {
  applyTheme(isDarkMode() ? "light" : "dark");
});


// ---------- 2. Année dans le pied de page ----------

document.getElementById("year").textContent = new Date().getFullYear();


// ---------- 3. Filtres des projets ----------

const filterButtons = document.querySelectorAll(".filters button");
const projectCards = document.querySelectorAll(".card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.f; // "all", "html" ou "js"

    // Le bouton cliqué devient le bouton actif
    filterButtons.forEach((b) => b.classList.remove("on"));
    button.classList.add("on");

    // On affiche ou cache chaque carte
    projectCards.forEach((card) => {
      const shouldBeVisible = category === "all" || card.dataset.cat === category;
      card.hidden = !shouldBeVisible;
    });
  });
});


// ---------- 4. Apparition des sections au scroll ----------

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return; // pas encore visible

      const section = entry.target;
      section.classList.add("in");

      // Remplit les barres de compétences de cette section
      section.querySelectorAll("[data-w]").forEach((bar) => {
        bar.style.width = bar.dataset.w + "%";
      });

      revealObserver.unobserve(section); // une seule fois suffit
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((section) => {
  revealObserver.observe(section);
});


// ---------- 5. Lien actif dans le menu ----------

const menuLinks = document.querySelectorAll('.links a[href^="#"]');

const menuObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      menuLinks.forEach((link) => {
        const target = "#" + entry.target.id;
        link.classList.toggle("active", link.getAttribute("href") === target);
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

document.querySelectorAll("section[id]").forEach((section) => {
  menuObserver.observe(section);
});


// ---------- 6. Formulaire de contact ----------


const form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nom = document.getElementById("nom").value.trim();
        const email = document.getElementById("mail").value.trim();
        const message = document.getElementById("txt").value.trim();

        if (!nom || !email || !message) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const reponse = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nom,
                    email,
                    message
                })
            });

            const resultat = await reponse.json();

            if (!reponse.ok) {
                throw new Error(resultat.erreur || "Une erreur est survenue.");
            }

            afficherNotification("Merci ! Ton message a bien été envoyé.");
            form.reset();

        } catch (erreur) {
            console.error("Erreur :", erreur);
            alert("Impossible d'envoyer le message. Réessaie plus tard.");
        }
    });
}


// Charger les compétences depuis la base de données
async function chargerCompetences() {
    try {
        const reponse = await fetch("/api/competences");
        const competences = await reponse.json();

        const liste = document.getElementById("skills-list");

        liste.innerHTML = "";

        competences.forEach((competence) => {
            const element = document.createElement("li");
            element.textContent = competence.nom;
            liste.appendChild(element);
        });

    } catch (erreur) {
        console.error("Erreur lors du chargement des compétences :", erreur);
    }
}

// Charger les projets depuis la base de données
async function chargerProjets() {
    try {
        const reponse = await fetch("/api/projets");
        const projets = await reponse.json();

        const grille = document.getElementById("projects-grid");

        grille.innerHTML = "";

        projets.forEach((projet) => {
            const carte = document.createElement("article");
            carte.className = "card";
            carte.dataset.cat = projet.categorie;

            const titre = document.createElement("h3");
            titre.textContent = projet.titre;

            const description = document.createElement("p");
            description.textContent = projet.description;

            carte.appendChild(titre);
            carte.appendChild(description);
            grille.appendChild(carte);
        });

    } catch (erreur) {
        console.error("Erreur lors du chargement des projets :", erreur);
    }
}

function afficherNotification(message, type = "success") {
    const notification = document.getElementById("notification");

    notification.textContent = message;
    notification.className = "notification " + type + " show";

    clearTimeout(window.notificationTimer);

    window.notificationTimer = setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// Lancer le chargement
chargerCompetences();
chargerProjets();
