function searchRecipes() {
  const searchInput = document.getElementById("searchInput").value.trim();
  const query = searchInput
    .split(",")
    .map(item => item.trim())
    .join(",");

  const recipesContainer = document.getElementById("recipesContainer");
  const loader = document.getElementById("loader");

  if (!query) return;

  recipesContainer.innerHTML = "";
  loader.style.display = "block";

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`)
    .then(response => response.json())
    .then(data => {
      loader.style.display = "none";
      if (data.meals) {
        displayRecipes(data.meals);
      } else {
        recipesContainer.innerHTML = `<p class="text-center text-danger">No recipes found for "${query}". Try different ingredients.</p>`;
      }
    })
    .catch(error => {
      loader.style.display = "none";
      console.error("Error fetching recipes:", error);
      recipesContainer.innerHTML = `<p class="text-center text-danger">An error occurred. Please try again later.</p>`;
    });
}


document.querySelectorAll('.view-btn').forEach(button => {
  button.addEventListener('click', function () {
    const mealId = this.getAttribute('data-id');
    fetchRecipeDetails(mealId);
  });
});
function fetchRecipeDetails(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals && data.meals.length > 0) {
        showRecipeModal(data.meals[0]);
      } else {
        alert("No recipe details found.");
      }
    })
    .catch(error => {
      console.error("Error fetching recipe details:", error);
    });
}
function showRecipeModal(meal) {
  document.getElementById("recipeModalLabel").textContent = meal.strMeal;

  let ingredientsHTML = "<ul class='list-group'>";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredientsHTML += `<li class="list-group-item">${measure} ${ingredient}</li>`;
    }
  }
  ingredientsHTML += "</ul>";

  document.getElementById("recipeModalBody").innerHTML = `
    <img src="${meal.strMealThumb}" class="img-fluid mb-3 rounded" alt="${meal.strMeal}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <h5>Ingredients:</h5>
    ${ingredientsHTML}
    <h5 class="mt-3">Instructions:</h5>
    <p>${meal.strInstructions}</p>
    ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" class="btn btn-danger mt-2">Watch on YouTube</a>` : ""}
  `;

  const modal = new bootstrap.Modal(document.getElementById("recipeModal"));
  modal.show();
}

function getMealDetails(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      showRecipeModal(meal);
    });
}
function toggleDarkMode() {
  document.body.classList.toggle("bg-dark");
  document.body.classList.toggle("text-white");

  document.querySelectorAll('.card').forEach(card => {
    card.classList.toggle("bg-dark");
    card.classList.toggle("text-white");
  });
}
function displayRecipes(meals) {
  const recipesContainer = document.getElementById("recipesContainer");
  recipesContainer.innerHTML = "";

  meals.forEach((meal) => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card animated fadeIn">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body text-center">
          <h5 class="card-title">${meal.strMeal}</h5>
          <button class="btn btn-success" onclick="getMealDetails('${meal.idMeal}')">View Recipe</button>
        </div>
      </div>
    `;
    recipesContainer.appendChild(col);
  });
}
