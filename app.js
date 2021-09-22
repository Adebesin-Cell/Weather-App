const form = document.querySelector(".header__form");
const view = document.querySelector(".view");
const viewPreloader = document.querySelector(".view__preloader");
const overview = document.querySelector(".overview");
const overviewPreloader = document.querySelector(".overview__preloader");

let isKelvin = false;

const API_KEY = "52ef113c8fe059dc0032696a2b810a91";

const renderPreloader = function (parent) {
  const html = `<div class="${parent}__preloader">Loading...</div>`;
  view.innerHTML = "";
  overview.innerHTML = "";

  view.insertAdjacentHTML("beforeend", html);
  overview.insertAdjacentHTML("beforeend", html);
};

const renderError = function (error) {
  const html = `<div>${error}, Country not found </div>`;
  view.innerHTML = overview.innerHTML = "";
  view.insertAdjacentHTML("beforeend", html);
  overview.insertAdjacentHTML("beforeend", html);
};

const createFormatDate = function () {
  const date = new Date();
  return new Intl.DateTimeFormat(navigator.language, {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

const renderView = function (data, temperature) {
  const date = createFormatDate();
  const viewHTML = `
        <div class="view__info">
            <h3 class="view__location">${data.name}</h3>
            <p class="view__date">
                <span class="view__day"> ${date} </span>
            </p>
            <h1 class="view__temperature">
                <span class="view__value"> ${Math.round(
                  temperature - 273
                )} </span>
                <span class="view__measurement"> °C </span>
            </h1>
        </div>
        <div class="view__logo">
            <div class="view__logo-wrapper">
                <div class="view__card">
                    <h1 class="view__title">${data.weather[0].main}</h1>
                    <div class="view__image-box">
                    <img
                        src="http://openweathermap.org/img/wn/${
                          data.weather[0].icon
                        }@2x.png"
                        alt="${data.weather[0].description}"
                        class="view__image"
                    />
                    </div>
                    <p class="view__description">${
                      data.weather[0].description
                    }</p>
                </div>
                <div class="view__card">
                    <h1 class="view__title">${data.weather[0].main}</h1>
                    <div class="view__image-box">
                    <img
                        src="http://openweathermap.org/img/wn/${
                          data.weather[0].icon
                        }@2x.png"
                        alt="${data.weather[0].description}"
                        class="view__image"
                    />
                    </div>
                    <p class="view__description">${
                      data.weather[0].description
                    }</p>
                </div>
                <div class="view__card">
                    <h1 class="view__title">${data.weather[0].main}</h1>
                    <div class="view__image-box">
                    <img
                        src="http://openweathermap.org/img/wn/${
                          data.weather[0].icon
                        }@2x.png"
                        alt="${data.weather[0].description}"
                        class="view__image"
                    />
                    </div>
                    <p class="view__description">${
                      data.weather[0].description
                    }</p>
                </div>
                <div class="view__card">
                    <h1 class="view__title">${data.weather[0].main}</h1>
                    <div class="view__image-box">
                    <img
                        src="http://openweathermap.org/img/wn/${
                          data.weather[0].icon
                        }@2x.png"
                        alt="${data.weather[0].description}"
                        class="view__image"
                    />
                    </div>
                    <p class="view__description">${
                      data.weather[0].description
                    }</p>
                </div>
            </div>
        </div>
            `;
  view.innerHTML = "";
  view.insertAdjacentHTML("beforeend", viewHTML);
};

const renderOverview = function (data) {
  const html = `
    <div class="overview__card">
      <h1 class="overview__title">Humidity</h1>
      <p class="overview__value">${data.main.humidity}%</p>
    </div>
    <div class="overview__card">
      <h1 class="overview__title">Wind Speed</h1>
      <p class="overview__value">${data.wind.speed}km/h</p>
    </div>
    <div class="overview__card">
      <h1 class="overview__title">Visiblity</h1>
      <p class="overview__value">${data.visibility}</p>
    </div>
    <div class="overview__card">
      <h1 class="overview__title">Pressure</h1>
      <p class="overview__value">${data.main.pressure} hPa</p>
    </div>`;

  overview.innerHTML = "";
  overview.insertAdjacentHTML("beforeend", html);
};

const tempInCelcius = function (temperature) {
  isKelvin = true;
  return temperature - 273;
};

const tempInKelvin = function (temperature) {
  isKelvin = false;
  return temperature;
};

const formatTemp = function (temperature) {
  return new Intl.NumberFormat("en-us").format(temperature);
};

const success = function (pos) {
  const { longitude: lon, latitude: lat } = pos.coords;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const temperature = formatTemp(data.main.temp);
      renderView(data, temperature);
      renderOverview(data);
    });
};

const error = function () {
  const html = `
    <div> Please enable your location </div>
  `;
  view.innerHTML = overview.innerHTML = "";
  view.insertAdjacentHTML("beforeend", html);
  overview.insertAdjacentHTML("beforeend", html);
};

const getCurrentCountry = function () {
  renderPreloader("view");
  renderPreloader("overview");
  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
  });
};

getCurrentCountry();

const getCountryWeather = function (country) {
  renderPreloader("view");
  renderPreloader("overview");
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${API_KEY}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((data) => {
      const temperature = formatTemp(data.main.temp);
      renderView(data, temperature);
      renderOverview(data);
    })
    .catch((err) => {
      renderError(err.message);
    });
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.querySelector(".header__input");
  if (input.value.trim() !== "") {
    getCountryWeather(input.value);
    input.value = "";
    input.focus();
  }
});
