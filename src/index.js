import { displayGIF } from "./gifLogic.js";
import "./normalize.css";
import "./styles.css";

let unitIsCelsius = true;

/* Refactor

1. Parse API data with destructuring
  - done
2. Get location data from user
3. Render weather with location data
4. Blur screen while loading
5. Display 2days data as a grid
6. Display hourly data as a table
7. Display town if provided by API

*/

function temptoggle() {
  const temperatureUnitDisplay = document.querySelector(".temp-toggle div");
  const celsiusDisplays = document.querySelectorAll(".temp");
  const fahrenheitDisplays = document.querySelectorAll(".temp-f");

  if (unitIsCelsius) {
    temperatureUnitDisplay.textContent = "Fahrenheit";
    unitIsCelsius = false;

    celsiusDisplays.forEach((div) => {
      div.style.display = "none";
    });

    fahrenheitDisplays.forEach((div) => {
      div.style.display = "block";
    });
  } else {
    temperatureUnitDisplay.textContent = "Celsius";
    unitIsCelsius = true;

    celsiusDisplays.forEach((div) => {
      div.style.display = "block";
    });

    fahrenheitDisplays.forEach((div) => {
      div.style.display = "none";
    });
  }
}

async function fetchWeather(location) {
  try {
    const API_KEY = "6d61c6b48aad4c6a9d0195337232810";
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3`,
      { mode: "cors" }
    );
    const weather = await response.json();
    console.log("weather ", weather);
    console.log("parsedCurrentWeather", parseCurrentWeather(weather));
    console.log("parsedForecastWeather", parseForecastWeather(weather));
    console.log("parsedHourlyWeather", parseHourlyWeather(weather));
    return weather;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

function parseCurrentWeather(weather) {
  const { name } = weather.location;
  const {
    temp_c,
    temp_f,
    condition: { text, icon },
  } = weather.current;

  return {
    name,
    temp_c,
    temp_f,
    text,
    icon,
  };
}

function parseForecastWeather({ forecast: { forecastday } }) {
  return forecastday.slice(1).map((day) => {
    return {
      date: day.date,
      maxtemp_c: day.day.maxtemp_c,
      mintemp_c: day.day.mintemp_c,
      maxtemp_f: day.day.maxtemp_f,
      mintemp_f: day.day.mintemp_f,
      text: day.day.condition.text,
      icon: day.day.condition.icon,
    };
  });
}

function parseHourlyWeather({
  forecast: {
    forecastday: [currentDay],
  },
  current: { last_updated_epoch: lastUpdatedEpoch },
}) {
  // Return only hours from the current hour till midnight
  return currentDay.hour
    .filter((hour) => hour.time_epoch > lastUpdatedEpoch - 3600)
    .map((hour) => {
      return {
        timestamp: hour.time_epoch,
        icon: hour.condition.icon,
        temp_c: hour.temp_c,
        temp_f: hour.temp_f,
        feelslike_c: hour.feelslike_c,
        feelslike_f: hour.feelslike_f,
        windSpeed: hour.wind_kph,
        chanceOfRain: hour.chance_of_rain,
      };
    });
}

async function processWeather(location) {
  const weather = await fetchWeather(location);
  if (weather.error) {
    console.log("ERROR OCCURRED");
    return 1;
  }
  const weatherSelectedData = {
    current: {},
    forecastDay2: {},
    forecastDay3: {},
  };
  // Process current weather
  weatherSelectedData.current.name = weather.location.name;
  weatherSelectedData.current.celsius = weather.current.temp_c;
  weatherSelectedData.current.fahrenheit = weather.current.temp_f;
  weatherSelectedData.current.text = weather.current.condition.text;
  weatherSelectedData.current.icon = weather.current.condition.icon;

  // Process weather for tomorrow
  weatherSelectedData.forecastDay2.date = weather.forecast.forecastday[1].date;
  weatherSelectedData.forecastDay2.maxtemp_c =
    weather.forecast.forecastday[1].day.maxtemp_c;
  weatherSelectedData.forecastDay2.mintemp_c =
    weather.forecast.forecastday[1].day.mintemp_c;
  weatherSelectedData.forecastDay2.maxtemp_f =
    weather.forecast.forecastday[1].day.maxtemp_f;
  weatherSelectedData.forecastDay2.mintemp_f =
    weather.forecast.forecastday[1].day.mintemp_f;
  weatherSelectedData.forecastDay2.text =
    weather.forecast.forecastday[1].day.condition.text;
  weatherSelectedData.forecastDay2.icon =
    weather.forecast.forecastday[1].day.condition.icon;

  // Process weather for the day after tomorrow
  weatherSelectedData.forecastDay3.date = weather.forecast.forecastday[2].date;
  weatherSelectedData.forecastDay3.maxtemp_c =
    weather.forecast.forecastday[2].day.maxtemp_c;
  weatherSelectedData.forecastDay3.mintemp_c =
    weather.forecast.forecastday[2].day.mintemp_c;
  weatherSelectedData.forecastDay3.maxtemp_f =
    weather.forecast.forecastday[2].day.maxtemp_f;
  weatherSelectedData.forecastDay3.mintemp_f =
    weather.forecast.forecastday[2].day.mintemp_f;
  weatherSelectedData.forecastDay3.text =
    weather.forecast.forecastday[2].day.condition.text;
  weatherSelectedData.forecastDay3.icon =
    weather.forecast.forecastday[2].day.condition.icon;

  // console.log("weatherSeletedData ", weatherSelectedData);
  return weatherSelectedData;
}

const searchButton = document.querySelector("#search");
const inputField = document.querySelector("#location");
const toggleButton = document.querySelector("#toggle");

searchButton.addEventListener("click", () => {
  if (!inputField.value) return;
  displayWeather(inputField.value);
});

toggleButton.addEventListener("click", () => {
  temptoggle();
});

async function displayWeather(location) {
  const currentDiv = document.querySelector(".current-container");
  const forecastDivs = document.querySelectorAll(".forecast");
  const elementGIF = document.querySelector(".gif");
  currentDiv.style.display = "none";
  forecastDivs.forEach((div) => {
    div.style.display = "none";
  });
  elementGIF.style.display = "none";

  const appContainer = document.querySelector(".app-container");
  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = "Loading";
  appContainer.appendChild(loadingDiv);

  const weather = await processWeather(location);

  if (weather === 1) {
    console.log("ERROR OCCURRED");
    inputField.value = "";
    return 1;
  }

  appContainer.removeChild(loadingDiv);

  currentDiv.style.display = "flex";
  forecastDivs.forEach((div) => {
    div.style.display = "flex";
  });
  elementGIF.style.display = "flex";
  inputField.value = "";

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
  displayGIF(weather.current.text);
}
