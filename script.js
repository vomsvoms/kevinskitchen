// Load recipes from JSON and display them
fetch("recipes.json")
  .then(response => response.json())
  .then(data => {
    const recipeList = document.getElementById("recipe-list");
    const recipeDetails = document.getElementById("recipe-details");
    const recipeContent = document.getElementById("recipe-content");
    const backBtn = document.getElementById("back-btn");

    // Render recipe cards
    data.recipes.forEach((recipe, index) => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}">
        <h3>${recipe.name}</h3>
      `;
      card.addEventListener("click", () => {
        showRecipe(recipe);
      });
      recipeList.appendChild(card);
    });

    // Show recipe details
    function showRecipe(recipe) {
      recipeList.style.display = "none";
      recipeDetails.classList.remove("hidden");

      recipeContent.innerHTML = `
        <h2>${recipe.name}</h2>
        <img src="${recipe.image}" alt="${recipe.name}" style="width:300px; border-radius:10px;">
        <h3>Ingredients</h3>
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <h3>Instructions</h3>
        <p>${recipe.instructions}</p>
      `;
    }

    // Back button
    backBtn.addEventListener("click", () => {
      recipeDetails.classList.add("hidden");
      recipeList.style.display = "grid";
    });
  })
  .catch(err => console.error("Error loading recipes:", err));
