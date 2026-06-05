const form = document.getElementById("ideaForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const submitBtn = document.getElementById("submitBtn");
const titleError = document.getElementById("titleError");
const descriptionError = document.getElementById("descriptionError");
let editingId = null;
let ideaToDelete = null;
function sanitize(text) {
  return text.trim().replace(/</g, "").replace(/>/g, "");
}

function clearErrors() {
  titleError.textContent = "";
  descriptionError.textContent = "";

  titleInput.classList.remove("input-error");
  descriptionInput.classList.remove("input-error");
}

function validateForm(title, description) {
  clearErrors();

  let isValid = true;

  if (title.length < 3) {
    titleError.textContent = "Le titre doit contenir au moins 3 caractères.";

    titleInput.classList.add("input-error");

    isValid = false;
  }

  if (description.length < 10) {
    descriptionError.textContent =
      "La description doit contenir au moins 10 caractères.";

    descriptionInput.classList.add("input-error");
    isValid = false;
  }

  return isValid;
}

async function loadIdeas() {
  try {
    const ideas = await getIdeas();

    displayIdeas(ideas);
  } catch (error) {
    console.error(error);

    showMessage("Erreur lors du chargement des idées.", "error");
  }
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  clearMessage();

  const title = sanitize(titleInput.value);

  const description = sanitize(descriptionInput.value);

  const isValid = validateForm(title, description);

  if (!isValid) {
    return;
  }

  submitBtn.disabled = true;

  showMessage("Analyse IA en cours...", "loading");

  let category;

  try {
    category = await (title, description);
  } catch (error) {
    console.error(error);

    category = "Amélioration technique";
  }

  // try {
  //   await addIdea({
  //     titre: title,
  //     categorie: category,
  //     description: description,
  //   });

  //   form.reset();

  //   await loadIdeas();

  //   showMessage("Idée ajoutée avec succès.", "success");
  // } 
try {
  if (editingId) {
    await updateIdea(
      editingId,
      title,
      description
    );

    showMessage("Idée modifiée avec succès.", "success");

    editingId = null;

    submitBtn.textContent = "Ajouter une idée";
  } else {
    await addIdea({
      titre: title,
      categorie: category,
      description: description,
    });

    showMessage("Idée ajoutée avec succès.", "success");
  }

  form.reset();

  await loadIdeas();
}
  
  catch (error) {
    console.error(error);

    showMessage("Erreur lors de l'enregistrement.", "error");
  }

  submitBtn.disabled = false;
});

// 

function removeIdea(id) {
  ideaToDelete = id;

  document
    .getElementById("deleteConfirmation")
    .classList.remove("hidden");
}

// async function editIdea(id) {
//   const newTitle = prompt("Nouveau titre :");

//   if (!newTitle || newTitle.trim() === "") {
//     return;
//   }

//   const newDescription = prompt("Nouvelle description :");

//   if (!newDescription || newDescription.trim() === "") {
//     return;
//   }

//   try {
//     await updateIdea(id, sanitize(newTitle), sanitize(newDescription));

//     await loadIdeas();

//     showMessage("Idée modifiée.", "success");
//   } catch (error) {
//     console.error(error);

//     showMessage("Erreur lors de la modification.", "error");
//   }
// }
async function editIdea(id) {
  try {
    const ideas = await getIdeas();

    const idea = ideas.find((item) => item.id === id);

    if (!idea) {
      return;
    }

    titleInput.value = idea.titre;
    descriptionInput.value = idea.description;

    editingId = id;

    submitBtn.textContent = "Modifier l'idée";

    titleInput.focus();
  } catch (error) {
    console.error(error);

    showMessage("Erreur lors du chargement de l'idée.", "error");
  }
}
document
  .getElementById("confirmDelete")
  .addEventListener("click", async () => {
    try {
      await deleteIdea(ideaToDelete);

      await loadIdeas();

      showMessage("Idée supprimée avec succès.", "success");
    } catch (error) {
      console.error(error);

      showMessage("Erreur lors de la suppression.", "error");
    }

    document
      .getElementById("deleteConfirmation")
      .classList.add("hidden");

    ideaToDelete = null;
  });

document
  .getElementById("cancelDelete")
  .addEventListener("click", () => {
    document
      .getElementById("deleteConfirmation")
      .classList.add("hidden");

    ideaToDelete = null;
  });
document.addEventListener("DOMContentLoaded", loadIdeas);
