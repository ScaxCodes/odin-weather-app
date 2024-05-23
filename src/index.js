import "./normalize.css";
import "./styles.css";
import { format } from "date-fns";

let unitIsCelsius = true;

/* Refactor

1. Parse API data with destructuring
  - done
2. Get location data from user
  - done
3. Render weather with location data
  - done
4. Blur screen while loading
  - done
5. Display 2days data in a row
 - done
6. Display hourly data as a table
 - done
7. Display town if provided by API
 - done 
8. refactor code with new parsed API data
 - done
9. Make textsearch working again or delete feature
10. Enhance styling

*/

const modal = document.querySelector(".loading-modal");
modal.style.display = "flex";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

async function positionSuccess({ coords }) {
  const weather = await fetchWeather("", coords.latitude, coords.longitude);
  modal.style.display = "none";
  renderWeather(weather);
}

function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page."
  );
  modal.style.display = "none";
}

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

async function fetchWeather(location, lat, lon) {
  try {
    const API_KEY = "6d61c6b48aad4c6a9d0195337232810";
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3`,
      { mode: "cors" }
    );
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

  forecastWeather.forEach((day) => {
    const element = forecastTemplate.content.cloneNode(true);
    element.querySelector(".date").textContent = day.date;
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
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp_c, { parent: element });
    setValue("fl-temp", hour.feelslike_c, { parent: element });
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

searchButton.addEventListener("click", () => {
  if (!inputField.value) return;
  displayWeather(inputField.value);
});

toggleButton.addEventListener("click", () => {
  temptoggle();
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
