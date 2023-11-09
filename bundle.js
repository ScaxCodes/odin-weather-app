/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gifLogic.js":
/*!*************************!*\
  !*** ./src/gifLogic.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   displayGIF: () => (/* binding */ displayGIF)
/* harmony export */ });
function selectGIF(text) {
  text = text.toLowerCase();
  if (text.includes("ice") || text.includes("freez") || text.includes("blizzard")) return "//media1.giphy.com/media/KFUx0Rtz7p0HTzbJ7x/giphy.gif";else if (text.includes("snow")) return "//media3.giphy.com/media/26tneSGWphvmFlUju/giphy.gif";else if (text.includes("sun")) return "//media0.giphy.com/media/98UMeH7pPiOpM5sHDw/giphy.gif";else if (text.includes("rain")) return "//media1.giphy.com/media/Mgq7EMQUrhcvC/giphy.gif";else if (text.includes("cloud") || text.includes("overcast")) return "//media0.giphy.com/media/gk3s6G7AdUNkey0YpE/giphy.gif";else if (text.includes("fog")) return "//media3.giphy.com/media/ZWRCWdUymIGNW/giphy.gif";else return 0;
}
function displayGIF(text) {
  const elementGIF = document.querySelector(".gif");
  const url = selectGIF(text);
  if (url) elementGIF.innerHTML = `<img src="${url}">`;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gifLogic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gifLogic.js */ "./src/gifLogic.js");

let unitIsCelsius = true;
function temptoggle() {
  const temperatureUnitDisplay = document.querySelector(".temp-toggle div");
  const celsiusDisplays = document.querySelectorAll(".temp");
  const fahrenheitDisplays = document.querySelectorAll(".temp-f");
  if (unitIsCelsius) {
    temperatureUnitDisplay.textContent = "Fahrenheit";
    unitIsCelsius = false;
    celsiusDisplays.forEach(div => {
      div.style.display = "none";
    });
    fahrenheitDisplays.forEach(div => {
      div.style.display = "block";
    });
  } else {
    temperatureUnitDisplay.textContent = "Celsius";
    unitIsCelsius = true;
    celsiusDisplays.forEach(div => {
      div.style.display = "block";
    });
    fahrenheitDisplays.forEach(div => {
      div.style.display = "none";
    });
  }
}
async function fetchWeather(location) {
  try {
    const API_KEY = "6d61c6b48aad4c6a9d0195337232810";
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3`, {
      mode: "cors"
    });
    const weatherJson = await response.json();
    // console.log(weatherJson);
    return weatherJson;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function processWeather(location) {
  const weather = await fetchWeather(location);
  const weatherSelectedData = {
    current: {},
    forecastDay2: {},
    forecastDay3: {}
  };
  // Process current weather
  weatherSelectedData.current.name = weather.location.name;
  weatherSelectedData.current.celsius = weather.current.temp_c;
  weatherSelectedData.current.fahrenheit = weather.current.temp_f;
  weatherSelectedData.current.text = weather.current.condition.text;
  weatherSelectedData.current.icon = weather.current.condition.icon;

  // Process weather for tomorrow
  weatherSelectedData.forecastDay2.date = weather.forecast.forecastday[1].date;
  weatherSelectedData.forecastDay2.maxtemp_c = weather.forecast.forecastday[1].day.maxtemp_c;
  weatherSelectedData.forecastDay2.mintemp_c = weather.forecast.forecastday[1].day.mintemp_c;
  weatherSelectedData.forecastDay2.maxtemp_f = weather.forecast.forecastday[1].day.maxtemp_f;
  weatherSelectedData.forecastDay2.mintemp_f = weather.forecast.forecastday[1].day.mintemp_f;
  weatherSelectedData.forecastDay2.text = weather.forecast.forecastday[1].day.condition.text;
  weatherSelectedData.forecastDay2.icon = weather.forecast.forecastday[1].day.condition.icon;

  // Process weather for the day after tomorrow
  weatherSelectedData.forecastDay3.date = weather.forecast.forecastday[2].date;
  weatherSelectedData.forecastDay3.maxtemp_c = weather.forecast.forecastday[2].day.maxtemp_c;
  weatherSelectedData.forecastDay3.mintemp_c = weather.forecast.forecastday[2].day.mintemp_c;
  weatherSelectedData.forecastDay3.maxtemp_f = weather.forecast.forecastday[2].day.maxtemp_f;
  weatherSelectedData.forecastDay3.mintemp_f = weather.forecast.forecastday[2].day.mintemp_f;
  weatherSelectedData.forecastDay3.text = weather.forecast.forecastday[2].day.condition.text;
  weatherSelectedData.forecastDay3.icon = weather.forecast.forecastday[2].day.condition.icon;
  return weatherSelectedData;
}
const searchButton = document.querySelector("#search");
const inputField = document.querySelector("#location");
const toggleButton = document.querySelector("#toggle");
searchButton.addEventListener("click", () => {
  displayWeather(inputField.value);
  const currentDiv = document.querySelector(".current-container");
  const forecastDivs = document.querySelectorAll(".forecast");
  currentDiv.style.display = "flex";
  forecastDivs.forEach(div => {
    div.style.display = "flex";
  });
  inputField.value = "";
});
toggleButton.addEventListener("click", () => {
  temptoggle();
});
async function displayWeather(location) {
  const weather = await processWeather(location);

  // Select current DOM
  const city = document.querySelector(".city");
  const temp = document.querySelector(".temp");
  const tempF = document.querySelector(".temp-f");
  const text = document.querySelector(".text");
  const icon = document.querySelector(".icon");

  // Fill current DOM
  city.textContent = weather.current.name;
  temp.textContent = `${weather.current.celsius}°`;
  tempF.textContent = `${weather.current.fahrenheit}°`;
  text.textContent = weather.current.text;
  icon.innerHTML = `<img src="${weather.current.icon}">`;

  // Select forecast DOM
  const dateForecast = document.querySelectorAll(".forecast .date");
  const tempForecast = document.querySelectorAll(".forecast .temp");
  const tempFForecast = document.querySelectorAll(".forecast .temp-f");
  const textForecast = document.querySelectorAll(".forecast .text");
  const iconForecast = document.querySelectorAll(".forecast .icon");

  // Fill forecast DOM
  dateForecast.forEach((div, index) => {
    div.textContent = weather[`forecastDay${index + 2}`].date;
  });
  tempForecast.forEach((div, index) => {
    div.textContent = `
    ${weather[`forecastDay${index + 2}`].mintemp_c}° - 
    ${weather[`forecastDay${index + 2}`].maxtemp_c}°
    `;
  });
  tempFForecast.forEach((div, index) => {
    div.textContent = `
    ${weather[`forecastDay${index + 2}`].mintemp_f}° - 
    ${weather[`forecastDay${index + 2}`].maxtemp_f}°
    `;
  });
  textForecast.forEach((div, index) => {
    div.textContent = weather[`forecastDay${index + 2}`].text;
  });
  iconForecast.forEach((div, index) => {
    div.innerHTML = `<img src="${weather[`forecastDay${index + 2}`].icon}">`;
  });

  // Display GIF
  (0,_gifLogic_js__WEBPACK_IMPORTED_MODULE_0__.displayGIF)(weather.current.text);
}

// displayWeather("mainz");
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map