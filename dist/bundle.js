/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
async function fetchWeather(location) {
  try {
    const API_KEY = "6d61c6b48aad4c6a9d0195337232810";
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`, {
      mode: "cors"
    });
    const weatherJson = await response.json();
    return weatherJson;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// async function printWeather() {
//   const weather = await fetchWeather("aschaffenburg");
//   console.log("This is the current weather in Aschaffenburg:");
//   console.log(weather);
// }

async function processWeather(location) {
  const weather = await fetchWeather(location);
  const weatherSelectedData = {};
  weatherSelectedData.name = weather.location.name;
  weatherSelectedData.celsius = weather.current.temp_c;
  weatherSelectedData.fahrenheit = weather.current.temp_f;
  weatherSelectedData.text = weather.current.condition.text;
  weatherSelectedData.icon = weather.current.condition.icon;
  console.log(weatherSelectedData);
}
processWeather("mainz");
/******/ })()
;
//# sourceMappingURL=bundle.js.map