import { removeIdea, editIdea} from "./script.js";
import { getIdeas, addIdea, updateIdea, deleteIdea } from "./superbase.js";

window.removeIdea = removeIdea;
window.editIdea = editIdea;

const ideasContainer = document.getElementById("ideasContainer");
const formMessage = document.getElementById("formMessage");

export function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = "form-message";
  formMessage.classList.add(type);
}

export function clearMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

export function displayIdeas(ideas) {
  ideasContainer.innerHTML = "";

  if (ideas.length === 0) {
    ideasContainer.innerHTML = `
    <p>
        Aucune idée disponible.
    </p>`;

    return;
  }

  ideas.forEach((idea) => {
    const card = document.createElement("div");

    card.classList.add("idea-card");

    const categoryClass = getCategory(idea.categorie);

    card.innerHTML = `

    <span
        class="badge ${categoryClass}"
    >
        ${idea.categorie}
    </span>

    <h3>
        ${idea.titre}
    </h3>

    <p>
        ${idea.description}
    </p>

    <div class="actions">

        <button
            class="edit-btn"
            onclick="
            editIdea('${idea.id}')
            "
        >
            Modifier
        </button>

        <button
            class="delete-btn"
            onclick="
            removeIdea('${idea.id}')
            "
        >
            Supprimer
        </button>

    </div>

    `;

    ideasContainer.appendChild(card);
  });
}

export function getCategory(category) {
  if (category === "Pédagogie") {
    return "pedagogie";
  }

  if (category === "Événement") {
    return "evenement";
  }

  if (category === "Vie de campus") {
    return "campus";
  }

  return "technique";
}

