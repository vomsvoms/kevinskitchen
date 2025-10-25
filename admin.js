let recipes = [];
let editIndex = null;

const recipeTableBody = document.getElementById("recipeTableBody");
const formSection = document.getElementById("formSection");
const formTitle = document.getElementById("formTitle");
const recipeForm = document.getElementById("recipeForm");
const nameInput = document.getElementById("recipeName");
const categoryInput = document.getElementById("recipeCategory");
const imageInput = document.getElementById("recipeImage");
const uploadInput = document.getElementById("uploadImage");
const imagePreview = document.getElementById("imagePreview");
const ingredientsInput = document.getElementById("recipeIngredients");
const instructionsInput = document.getElementById("recipeInstructions");

// Load recipes from JSON
fetch("recipes.json")
  .then(response => response.json())
  .then(data => {
    recipes = data.recipes || [];
    renderTable();
  })
  .catch(err => console.error("Error loading recipes:", err));

// Render recipe table
function renderTable() {
  recipeTableBody.innerHTML = "";
  recipes.forEach((recipe, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${recipe.image}" alt="${recipe.name}" class="recipe-thumb"></td>
      <td>${recipe.name}</td>
      <td>
        <button onclick="editRecipe(${i})">✏️ Edit</button>
        <button onclick="deleteRecipe(${i})">🗑️ Delete</button>
      </td>
    `;
    recipeTableBody.appendChild(row);
  });
}

// Show Add Form
document.getElementById("addRecipeBtn").addEventListener("click", () => {
  formSection.classList.remove("hidden");
  formTitle.textContent = "Add Recipe";
  recipeForm.reset();
  imagePreview.innerHTML = "";
  editIndex = null;
  formSection.scrollIntoView({ behavior: "smooth" });

});

// Handle Image Preview
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      imageInput.value = `images/${file.name}`;
    };
    reader.readAsDataURL(file);
  }
});

// Save Recipe (Add or Edit)
recipeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newRecipe = {
    name: nameInput.value.trim(),
    category: categoryInput.value.trim(),
    image: imageInput.value.trim(),
    ingredients: ingredientsInput.value.split("\n").map(i => i.trim()).filter(i => i),
    instructions: instructionsInput.value.trim()
  };

  if (editIndex !== null) {
    recipes[editIndex] = newRecipe;
  } else {
    recipes.push(newRecipe);
  }

  renderTable();
  formSection.classList.add("hidden");
});

// Cancel Form
document.getElementById("cancelBtn").addEventListener("click", () => {
  formSection.classList.add("hidden");
});

// Edit Recipe
window.editRecipe = function (index) {
  const r = recipes[index];
  editIndex = index;
  formSection.classList.remove("hidden");
  formTitle.textContent = "Edit Recipe";

  nameInput.value = r.name;
  categoryInput.value = r.category || "";
  imageInput.value = r.image;
  ingredientsInput.value = r.ingredients.join("\n");
  instructionsInput.value = r.instructions;
  imagePreview.innerHTML = `<img src="${r.image}" alt="Preview">`;

  formSection.scrollIntoView({ behavior: "smooth" });

};

// Delete Recipe
window.deleteRecipe = function (index) {
  if (confirm(`Delete "${recipes[index].name}"?`)) {
    recipes.splice(index, 1);
    renderTable();
  }
};

// Export JSON
document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ recipes }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "recipes.json";
  a.click();
});


