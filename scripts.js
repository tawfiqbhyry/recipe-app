let searchEL = document.getElementById("search");
let textInputEL = document.getElementById("text-input");
let favMealContainer = document.querySelector(".fav-meals .img");
let arrowRight = document.querySelector(".fa-angle-right");
let arrowLeft = document.querySelector(".fa-angle-left");
let removeFood = document.querySelector("#remove-food");
let mainExplanationEL = document.querySelector(".recipeExplained");
let mainContainer = document.querySelector(".main-container");

let mealsArray = [];
let favMeals = [];
let currentMeal = {};
let currentMealIndex = 0;

async function getDailyMeal() {
  let dailyMeal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/random.php`
  );
  const data = await dailyMeal.json();
  let meal = data.meals[0];
  let mealID = meal["idMeal"];
  let area = meal["strArea"];
  let category = meal["strCategory"];
  let instructions = meal["strInstructions"];
  let image = meal["strMealThumb"];
  let name = meal["strMeal"];
  let video = meal["strYoutube"];
  let MealTags = meal["strTags"];

  let ingredients = [];

  Object.keys(meal).forEach((key) => {
    if (meal[key] && meal[key] != "") {
      if (key.includes("strIngredient")) {
        var ingrid = {};
        ingrid[meal[key]] = meal[key.replace("strIngredient", "strMeasure")];
        ingredients.push(ingrid);
      }
    }
  });
  let mealObject = {
    mealID: mealID,
    area: area,
    category: category,
    instructions: instructions,
    image: image,
    name: name,
    video: video,
    ingredients: ingredients,
    tags: MealTags,
  };
  return mealObject;
}

async function setDailyMeal() {
  const meal = await getDailyMeal();
  currentMeal = meal;

  document.querySelector(".daily-recipe .title h4").innerHTML = meal.name;
  document
    .querySelector(".daily-recipe .daily-recipe-img")
    .setAttribute("src", meal.image);

  document
    .querySelector(".daily-recipe .daily-recipe-img")
    .addEventListener("click", () => {
      descriptionOfMail(meal);
      mainExplanationEL.style.display = "flex";
      mainContainer.style.display = "none";
    });
  document.querySelector(
    ".daily-recipe .description .meal-description"
  ).innerHTML = meal.name;
}

function descriptionOfMail(meal) {
  let removeEL = document.querySelector(".recipeExplained #icon-remove");
  let id = document.querySelector(".recipeExplained .data #recipe-id span");
  let name = document.querySelector(
    ".recipeExplained .data #recipe-title span"
  );
  let mainTitle = document.querySelector(".recipeExplained .head #title");
  let mainImg = document.querySelector(".recipeExplained .image img");
  let area = document.querySelector(".recipeExplained .data #recipe-area span");
  let category = document.querySelector(
    ".recipeExplained .data #recipe-category span"
  );
  let instructions = document.querySelector(
    ".recipeExplained .data #recipe-instructions span"
  );
  let ingredients = document.querySelector(
    ".recipeExplained .data #ingrediants"
  );
  let tags = document.querySelector(".recipeExplained .data #tags span");
  let video = document.querySelector(".recipeExplained .data #video span a");
  id.innerHTML = meal.mealID;
  name.innerHTML = meal.name;
  area.innerHTML = meal.area;
  mainImg.setAttribute("src", meal.image);
  mainTitle.innerHTML = meal.name;
  category.innerHTML = meal.category + "<br>";
  instructions.innerHTML = meal.instructions;
  meal.ingredients.forEach((meal) => {
    Object.keys(meal).forEach((key) => {
      let item = document.createElement("li");
      item.innerHTML = `${key}: ${meal[key]}`;
      ingredients.appendChild(item);
    });
  });
  tags.innerHTML = meal.tags;
  video.setAttribute("href", meal.video);
  removeEL.addEventListener("click", () => {
    mainContainer.style.display = "block";
    mainExplanationEL.style.display = "none";
  });
}

async function searchMeals() {
  document.querySelector(".meals").innerHTML = "";
  let length = textInputEL.value.length;
  let text = textInputEL.value;
  let results;
  if (length > 0) {
    if (length == 1) {
      results = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${text}`
      );
    } else if (length > 1) {
      results = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`
      );
    }
  } else {
    results = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
  }
  const data = await results.json();
  mealsArray = data.meals;
  mealsArray.forEach((meal) => {
    let mealID = meal["idMeal"];
    let area = meal["strArea"];
    let category = meal["strCategory"];
    let instructions = meal["strInstructions"];
    let image = meal["strMealThumb"];
    let name = meal["strMeal"];
    let video = meal["strYoutube"];
    let MealTags = meal["strTags"];

    let ingredients = [];

    Object.keys(meal).forEach((key) => {
      if (meal[key] && meal[key] != "") {
        if (key.includes("strIngredient")) {
          var ingrid = {};
          ingrid[meal[key]] = meal[key.replace("strIngredient", "strMeasure")];
          ingredients.push(ingrid);
        }
      }
    });
    let mealObject = {
      mealID: mealID,
      area: area,
      category: category,
      instructions: instructions,
      image: image,
      name: name,
      video: video,
      ingredients: ingredients,
      tags: MealTags,
    };
    let mealContainer = document.createElement("div");
    mealContainer.classList.add("meal-searched-container");
    mealContainer.setAttribute("id", mealID);

    let mealImage = document.createElement("img");
    mealImage.setAttribute("src", image);
    mealImage.setAttribute("alt", name);
    mealImage.classList.add("meal-image");

    mealImage.addEventListener("click", () => {
      descriptionOfMail(mealObject);
      mainExplanationEL.style.display = "flex";
      mainContainer.style.display = "none";
    });

    let line = document.createElement("div");
    line.classList.add("line-bottom");

    let plusIcon = document.createElement("i");
    plusIcon.classList.add("fa-light", "fa-plus");
    plusIcon.setAttribute("id", "plus-icon");

    let mealName = document.createElement("p");
    mealName.innerHTML = name;

    plusIcon.addEventListener("click", async () => {
      let mealsSaved = await getSavedMeals();
      if (mealsSaved) {
        mealsSaved.push(mealObject);
        await localStorage.setItem("savedMeals", JSON.stringify(mealsSaved));
      } else {
        favMeals.push(mealObject);
        await localStorage.setItem("savedMeals", JSON.stringify(favMeals));
      }
    });

    mealContainer.appendChild(mealImage);
    mealContainer.appendChild(plusIcon);
    mealContainer.appendChild(mealName);
    mealContainer.appendChild(line);
    document.querySelector(".meals").appendChild(mealContainer);
  });
}

function getSavedMeals() {
  let savedMeals = JSON.parse(localStorage.getItem("savedMeals"));
  if (savedMeals) {
    favMeals = savedMeals;
    favMealContainer.style.display = "flex";
    arrowRight.style.display = "block";
    arrowLeft.style.display = "block";
    document.querySelector(".fav-meals .no-meals").style.display = "none";

    document.querySelector(".fav-meals .img p").innerHTML =
      favMeals[currentMealIndex].category;
    document
      .querySelector(".fav-meals .img img")
      .setAttribute("src", favMeals[currentMealIndex].image);
    return savedMeals;
  } else {
    favMeals = [];
    document.querySelector(".fav-meals .no-meals").style.display = "block";
    favMealContainer.style.display = "none";
    arrowRight.style.display = "none";
    arrowLeft.style.display = "none";
  }
}

let favMealsCheck = setInterval(getSavedMeals, 1500);

textInputEL.addEventListener("input", searchMeals);
searchEL.addEventListener("click", searchMeals);

arrowLeft.addEventListener("click", () => {
  if (currentMealIndex < 0) {
    currentMealIndex = favMeals.length - 1;
  } else if (currentMealIndex > 0) {
    currentMealIndex--;
  } else if (currentMealIndex == 0) {
    currentMealIndex = 0;
  }
});

arrowRight.addEventListener("click", () => {
  if (currentMealIndex == favMeals.length - 1) {
    currentMealIndex = 0;
  } else {
    currentMealIndex++;
  }
});

removeFood.addEventListener("click", () => {
  if (favMeals.length == 0) {
    localStorage.removeItem("savedMeals");
    favMealContainer.style.display = "none";
    arrowRight.style.display = "none";
    arrowLeft.style.display = "none";
    document.querySelector(".fav-meals .no-meals").style.display = "block";
  } else if (favMeals.length > 0) {
    favMeals.splice(currentMealIndex, 1);
    localStorage.setItem("savedMeals", JSON.stringify(favMeals));
  }
});

setDailyMeal();

stars = [];
for (let i = 1; i <= 5; i++) {
  stars.push(document.getElementById(`${i}-star`));
}
stars.forEach((star) => {
  star.addEventListener("click", async () => {
    if (stars.indexOf(star) + 1 >= 3) {
      favMeals.push(currentMeal);
      await localStorage.setItem("savedMeals", JSON.stringify(favMeals));
    }
    for (let count = 0; count <= stars.indexOf(star); count++) {
      stars[count].classList.remove("fa-light");
      stars[count].classList.add("fa-solid");
    }
  });
});

document
  .querySelector(".daily-recipe .fa-plus")
  .addEventListener("click", async () => {
    favMeals.push(currentMeal);
    await localStorage.setItem("savedMeals", JSON.stringify(favMeals));
  });

document.querySelector(".fav-meals .img img").addEventListener("click", () => {
  descriptionOfMail(favMeals[currentMealIndex]);
  mainExplanationEL.style.display = "flex";
  mainContainer.style.display = "none";
});
