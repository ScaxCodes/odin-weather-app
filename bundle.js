/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
async function fetchWeather(location) {
  try {
    const API_KEY = "6d61c6b48aad4c6a9d0195337232810";
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3`, {
      mode: "cors"
    });
    const weatherJson = await response.json();
    console.log(weatherJson);
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
searchButton.addEventListener("click", () => {
  displayWeather(inputField.value);
  inputField.value = "";
});
async function displayWeather(location) {
  const weather = await processWeather(location);

  // Select current DOM
  const city = document.querySelector(".city");
  const temp = document.querySelector(".temp");
  const text = document.querySelector(".text");
  const icon = document.querySelector(".icon");

  // Fill current DOM
  city.textContent = weather.current.name;
  temp.textContent = `${weather.current.celsius}°`;
  text.textContent = weather.current.text;
  icon.innerHTML = `<img src="${weather.current.icon}">`;

  // Select forecast DOM
  const dateForecast = document.querySelectorAll(".forecast .date");
  const tempForecast = document.querySelectorAll(".forecast .temp");
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
  textForecast.forEach((div, index) => {
    div.textContent = weather[`forecastDay${index + 2}`].text;
  });
  iconForecast.forEach((div, index) => {
    div.innerHTML = `<img src="${weather[`forecastDay${index + 2}`].icon}">`;
  });
}
displayWeather("mainz");
/******/ })()
;
//# sourceMappingURL=bundle.js.map