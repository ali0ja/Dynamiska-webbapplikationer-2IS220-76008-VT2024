let currentMeals = [];
let currentIndex = 0;
const resultsPerPage = 5;

const showMealCard = (meal) => {
  const { strMeal, strMealThumb } = meal;
  const randomPrice = Math.round(Math.random() * (300 - 120) + 120); // Random price between 120 and $300 kr

  const card = document.createElement("div");
  card.classList.add("meal-card");

  card.innerHTML = `
    <div class="meal-card-image" style="background-image: url(${strMealThumb});"></div>
    <h3 class="meal-card-title">${strMeal}</h3>
    <div class="meal-card-price">${randomPrice} kr</div>
  `;

  card.addEventListener("click", () => showDetails(meal));
  document.querySelector(".ingredients").appendChild(card);
};

const showDetails = (meal) => {
  document.getElementById("meal-details").innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <ul id="meal-ingredients"></ul>
  `;

  const ingredientsList = document.getElementById("meal-ingredients");
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      const listItem = document.createElement("li");
      listItem.textContent = `${measure} ${ingredient}`;
      ingredientsList.appendChild(listItem);
    }
  }
};

const showMoreMeals = () => {
  const nextMeals = currentMeals.slice(
    currentIndex,
    currentIndex + resultsPerPage
  );
  nextMeals.forEach(showMealCard);
  currentIndex += resultsPerPage;

  if (currentIndex >= currentMeals.length) {
    document.querySelector(".load-more").style.display = "none";
  }
};

const fetchMealData = async (query = "") => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const { meals } = await res.json();
  return meals || [];
};

const loadMeals = async (query = "") => {
  currentMeals = await fetchMealData(query);
  currentIndex = 0;

  document.querySelector(".ingredients").innerHTML = "";
  document.getElementById("meal-details").innerHTML = "";

  if (currentMeals.length > 0) {
    showMoreMeals();
    if (currentMeals.length > resultsPerPage) {
      document.querySelector(".load-more").style.display = "block";
    } else {
      document.querySelector(".load-more").style.display = "none";
    }
  } else {
    alert("No meals found.");
    document.querySelector(".load-more").style.display = "none";
  }
};

const searchMeal = (e) => {
  e.preventDefault();
  const query = document.querySelector(".input").value.trim();
  if (query) {
    loadMeals(query);
  } else {
    alert("Please enter a meal name to search.");
  }
};

export const initMeals = () => {
  document.querySelector("form").addEventListener("submit", searchMeal);
  document.querySelector(".magnifier").addEventListener("click", searchMeal);
  document.querySelector(".load-more").addEventListener("click", showMoreMeals);

  loadMeals();
};
