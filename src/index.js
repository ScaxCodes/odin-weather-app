import "./normalize.css";
import "./styles.css";
import { format } from "date-fns";

let unitIsCelsius = true;

const loadingSpinnerModal = document.querySelector(".loading-modal");
loadingSpinnerModal.style.display = "flex";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

async function positionSuccess({ coords }) {
  const weather = await fetchWeather(null, coords.latitude, coords.longitude);
  loadingSpinnerModal.style.display = "none";
  renderWeather(weather);
}

function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page."
  );
  loadingSpinnerModal.style.display = "none";
}

function tempToggle() {
  const temperatureUnitDisplay = document.querySelector(".temp-toggle div");
  const celsiusDisplays = document.querySelectorAll(".temp");
  const fahrenheitDisplays = document.querySelectorAll(".temp-f");

  if (unitIsCelsius) {
    temperatureUnitDisplay.textContent = "Fahrenheit";
    unitIsCelsius = false;

    celsiusDisplays.forEach((element) => {
      element.style.display = "none";
    });

    fahrenheitDisplays.forEach((element) => {
      if (element.tagName == "DIV") element.style.display = "block";
      else if (element.tagName == "TD") element.style.display = "table-cell";
    });
  } else {
    temperatureUnitDisplay.textContent = "Celsius";
    unitIsCelsius = true;

    celsiusDisplays.forEach((element) => {
      if (element.tagName == "DIV") element.style.display = "block";
      else if (element.tagName == "TD") element.style.display = "table-cell";
    });

    fahrenheitDisplays.forEach((element) => {
      element.style.display = "none";
    });
  }
}

async function fetchWeather(location = null, lat, lon) {
  try {
    const API_KEY = "6d61c6b48aad4c6a9d0195337232810";
    let response;
    if (location === null) {
      response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3`,
        { mode: "cors" }
      );
    } else {
      response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3`,
        { mode: "cors" }
      );
    }

    const weather = await response.json();
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
      day: format(day.date, "eeee"),
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

function renderWeather(weather) {
  renderCurrentWeather(weather);
  renderForecastWeather(weather);
  renderHourlyWeather(weather);
}

function renderCurrentWeather(weather) {
  const currentWeather = parseCurrentWeather(weather);

  const currentDiv = document.querySelector(".current-container");
  currentDiv.style.display = "flex";

  currentWeather.temp_c = Math.round(currentWeather.temp_c);
  currentWeather.temp_c = Math.round(currentWeather.temp_f);

  document.querySelector(".city").textContent = currentWeather.name;
  document.querySelector(".temp").textContent = currentWeather.temp_c + "°";
  document.querySelector(".temp-f").textContent = currentWeather.temp_f + "°";
  document.querySelector(".text").textContent = currentWeather.text;
  const currentIcon = document.querySelector("[data-current-icon]");
  currentIcon.src = `https:${currentWeather.icon}`;
}

function renderForecastWeather(weather) {
  const forecastWeather = parseForecastWeather(weather);

  const forecastSection = document.querySelector(".forecast-container");
  const forecastTemplate = document.getElementById("forecast-template");
  forecastSection.style.display = "flex";

  forecastSection.innerHTML = "";
  forecastWeather.forEach((day) => {
    day.maxtemp_c = Math.round(day.maxtemp_c);
    day.maxtemp_f = Math.round(day.maxtemp_f);
    const element = forecastTemplate.content.cloneNode(true);
    element.querySelector(".date").textContent = day.day;
    element.querySelector(".temp").textContent = day.maxtemp_c + "°";
    element.querySelector(".temp-f").textContent = day.maxtemp_f + "°";
    element.querySelector(".text").textContent = day.text;
    const forecastIcon = element.querySelector("[data-forecast-icon]");
    forecastIcon.src = `https:${day.icon}`;
    forecastSection.append(element);
  });
}

function renderHourlyWeather(weather) {
  const hourlyWeather = parseHourlyWeather(weather);

  const hourlySection = document.querySelector("[data-hour-section]");
  const hourRowTemplate = document.getElementById("hour-row-template");
  hourlySection.innerHTML = "";
  hourlyWeather.forEach((hour) => {
    hour.temp_c = Math.round(hour.temp_c);
    hour.feelslike_c = Math.round(hour.feelslike_c);
    hour.temp_f = Math.round(hour.temp_f);
    hour.feelslike_f = Math.round(hour.feelslike_f);
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp_c, { parent: element });
    setValue("fl-temp", hour.feelslike_c, { parent: element });
    setValue("temp-f", hour.temp_f, { parent: element });
    setValue("fl-temp-f", hour.feelslike_f, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.chanceOfRain, { parent: element });
    setValue("day", formatDay(hour.timestamp), { parent: element });
    setValue("time", formatTime(hour.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = "https:" + hour.icon;
    hourlySection.append(element);
  });
}

const searchButton = document.querySelector("#search");
const inputField = document.querySelector("#location");
const toggleButton = document.querySelector("#toggle");

searchButton.addEventListener("click", async () => {
  if (!inputField.value) return;
  loadingSpinnerModal.style.display = "flex";
  const weather = await fetchWeather(inputField.value);
  loadingSpinnerModal.style.display = "none";
  inputField.value = "";
  renderWeather(weather);
});

toggleButton.addEventListener("click", () => {
  tempToggle();
});

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function formatDay(timestamp) {
  return format(new Date(timestamp * 1000), "eeee");
}

function formatTime(timestamp) {
  return format(new Date(timestamp * 1000), "ha");
}
