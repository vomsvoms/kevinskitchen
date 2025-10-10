// A map to link JSON categories (lowercase) to their HTML list element IDs
const categoryMap = {
    'appetizers': 'appetizers-list',
    'main courses': 'main-courses-list',
    'desserts': 'desserts-list',
    'sauces': 'sauces-list'
};

// Select the main containers
const recipeList = document.getElementById("recipe-list");
const recipeDetails = document.getElementById("recipe-details");
const recipeContent = document.getElementById("recipe-content");
const backBtn = document.getElementById("back-btn");

// ----------------------------------------
// 1. Load Recipes and Sort by Category
// ----------------------------------------

fetch("recipes.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Access the recipes array nested under the 'recipes' key in your JSON
        const recipes = data.recipes; 

        // Prepare an object to hold references to the HTML lists
        const recipeListElements = {};
        for (const key in categoryMap) {
            recipeListElements[key] = document.getElementById(categoryMap[key]);
        }

        // Loop through recipes and sort them into the correct list
        recipes.forEach(recipe => {
            // Normalize category for lookup: 'Main Courses' -> 'main courses'
            const categoryKey = recipe.category.toLowerCase();

            const targetList = recipeListElements[categoryKey];

            if (targetList) {
                // Create the recipe card element (as an <li>)
                const card = createRecipeCard(recipe);
                
                // Attach click listener to show details
                card.addEventListener("click", () => {
                    showRecipe(recipe);
                });

                // Append the card to the correct category list
                targetList.appendChild(card);
            } else {
                console.warn(`Recipe '${recipe.name}' has an unknown category: ${recipe.category}.`);
            }
        });

        // Attach the back button listener only after data is successfully loaded
        backBtn.addEventListener("click", showRecipeList);
    })
    .catch(err => {
        console.error("Error loading recipes:", err);
        recipeList.innerHTML = '<p style="color: red; padding: 20px;">Error: Could not load recipes. Please check the `recipes.json` file and path.</p>';
    });

// ----------------------------------------
// 2. Helper Functions
// ----------------------------------------

function createRecipeCard(recipe) {
    // Creates the <li> element for each recipe card
    const li = document.createElement("li"); 
    li.className = "recipe-card"; 
    li.innerHTML = `
        <img src="${recipe.image || 'placeholder.jpg'}" alt="${recipe.name}">
        <h3>${recipe.name}</h3>
        <p>${recipe.description || ''}</p> 
    `;
    return li;
}

// Show recipe details
function showRecipe(recipe) {
    recipeList.classList.add("hidden"); 
    recipeDetails.classList.remove("hidden");

    recipeContent.innerHTML = `
        <span class="recipe-category-tag">${recipe.category}</span>
        <h2>${recipe.name}</h2>
        
        <img src="${recipe.image || 'placeholder.jpg'}" alt="${recipe.name}" style="width:300px; max-width: 100%; height: auto; border-radius:10px;">
        
        <h3>Ingredients</h3>
        <ul>
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}
        </ul>

        <h3>Instructions</h3>
        ${Array.isArray(recipe.instructions) 
            ? `<ol>${recipe.instructions.map(inst => `<li>${inst}</li>`).join("")}</ol>`
            : `<p>${recipe.instructions}</p>`
        }
    `;
}

// Show recipe list
function showRecipeList() {
    recipeDetails.classList.add("hidden");
    recipeList.classList.remove("hidden");
}