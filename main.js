'use strict';

const unit = 'metric';
const appid = 'dcf621faa4199052db3aa27bda63a00b';
const appikey = 'f5b9a7ccf55443d28087fe4daedee6c4';

const currentWeatherDiv = document.querySelector('.current');
const sevenWeatherDiv = document.querySelector('.seven-day');
const weatherHighlights = document.querySelector('.weather-highlights');
const hourlyWeatherDiv = document.querySelector('.hourly');
const loadingDiv = document.querySelector('.loading');
const inputSearch = document.querySelector('.search');
const searchResultsDiv = document.querySelector('.search-results');
const favoriteCitiesDiv = document.querySelector('.favorite_cities');

const welcome = document.querySelector('.welcome');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const geolocationButton = document.querySelector('.geolocation');
const favoriteButton = document.querySelector('.show-favorite-overlay');
const searchButton = document.querySelector('.search-icon');
const searchGroup = document.querySelector('.search_group');
const messageModal = document.querySelector('.message-modal');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const state = {
  location: {},
  weather: {
    current: [],
    hourly: [],
    daily: [],
  },
  favorite_cities: [],
  favorite_codes: [],
};

class Location {
  constructor(name, country, flag, coordinates, code) {
    this.name = name;
    this.country = country;
    this.flag = flag;
    this.coordinates = coordinates;
    this.code = code;
  }
}

const addZero = num => (num < 10 ? '0' + num : +num);

function windDirectionName(val) {
  let value = parseFloat(val);
  if (value <= 11.25) return 'N';
  value -= 11.25;
  let allDirections = ['NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
  let dIndex = parseInt(value / 22.5);
  return allDirections[dIndex] ? allDirections[dIndex] : 'N';
}

const capitalizeFirstLetter = string => string[0].charAt(0).toUpperCase() + string.slice(1);

function getTime(ms) {
  let date = new Date(ms * 1000);
  let hr = addZero(date.getHours());
  let min = addZero(date.getMinutes());
  let day = date.getDate();
  let month = months[date.getMonth()];
  return [hr, min, day, month];
}

const createCurrentWeatherObject = function (data, index) {
  let [hr, min, day, month] = getTime(data.dt);
  return {
    time: `${hr}:${min}, ${day}. ${month}`,
    icon: data.weather[0].icon,
    sunrise: `${getTime(data.sunrise)[0]}:${getTime(data.sunrise)[1]}`,
    sunset: `${getTime(data.sunset)[0]}:${getTime(data.sunset)[1]}`,
    uvi: data.uvi,
    visibility: data.visibility,
    temperature: Math.floor(data.temp),
    feels: data.feels_like,
    description: data.weather[0].description,
    id: data.weather[0].id,
    windDegrees: data.wind_deg,
    windDirection: windDirectionName(data.wind_deg),
    windSpeed: data.wind_speed,
    humidity: data.humidity,
    aqi: index,
  };
};

const createHourlyWeatherObject = function (data) {
  let date = new Date(data.dt * 1000);
  let time = date.getHours();
  return {
    time: time,
    icon: data.weather[0].icon,
    id: data.weather[0].id,
    temperature: Math.trunc(data.temp),
    pop: data.pop,
  };
};

const createDailyWeatherObject = function (data) {
  let date = new Date(data.dt * 1000);
  let days = date.getDay();
  const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return {
    date: day[days],
    icon: data.weather[0].icon,
    id: data.weather[0].id,
    temperatureDay: Math.trunc(data.temp.day),
    temperatureNight: Math.trunc(data.temp.night),
    description: capitalizeFirstLetter(data.weather[0].description),
    windDegrees: data.wind_deg,
    windSpeed: data.wind_speed,
    pop: data.pop,
  };
};

//_________________________________________________CONTROLLER

const controller = async function (lat, lon) {
  try {
    const [city, country, code] = await getCityCountry(lat, lon);
    const flag = await getCountryFlag(country);
    state.location = new Location(city, country, flag, [lat, lon], city.toUpperCase() + code);
    const weatherData = await loadWeatherData(lat, lon);
    const aqi = await getAirQualityIndex(lat, lon);
    populateWeatherState(weatherData, aqi);
    drawWeather();
  } catch (err) {
    console.log(`🧨🧨🧨  ${err}`);
  }
};

async function getAirQualityIndex(lat, lon) {
  try {
    const data = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${appid}`);
    let json = await data.json();
    return json.list[0].main.aqi;
  } catch (err) {
    console.log(err);
  }
}

async function getCityCountry(latitude, longitude) {
  try {
    const data = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    let json = await data.json();
    let city = json.city === '' ? json.locality : json.city;
    const { countryName, countryCode } = json;
    return [city, countryName, countryCode];
  } catch (err) {
    console.log(err);
  }
}

async function getCountryFlag(country) {
  try {
    const countryData = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
    let json = await countryData.json();
    return json[0].flag;
  } catch (err) {
    console.log(err);
  }
}

const getBrowserGeo = function () {
  loadingDiv.style.display = 'flex';
  const getLatLng = navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude, longitude } = position.coords;
    controller(latitude, longitude);
  });
};

//search for input cities with openweather api
async function searchForCity(val) {
  try {
    const data = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=5&appid=${appid}`);
    let json = await data.json();
    drawSearchCity(json);
  } catch (err) {
    console.log(err);
  }
}

const clearAllWeather = function () {
  currentWeatherDiv.innerHTML = '';
  sevenWeatherDiv.innerHTML = '';
  hourlyWeatherDiv.innerHTML = '';
  inputSearch.value = '';
  searchResultsDiv.innerHTML = '';
  weatherHighlights.innerHTML = '';
};

async function loadWeatherData(latitude, longitude) {
  try {
    const json = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${unit}&exclude={part}&appid=${appid}`
    );
    let weather = await json.json();
    return weather;
  } catch (err) {
    console.log(err);
  }
}

function populateWeatherState(data, index) {
  state.weather.current = createCurrentWeatherObject(data.current, index);
  for (let i = 0; i < 6; i++) {
    state.weather.hourly[i] = createHourlyWeatherObject(data.hourly[i]);
  }
  data.daily.forEach((cur, i) => (state.weather.daily[i] = createDailyWeatherObject(cur)));
}

function showUI() {
  document.querySelector('.main-col-1').style.display = 'flex';
  document.querySelector('.main-col-2').style.display = 'flex';
}
function hideUI() {
  document.querySelector('.main-col-1').style.display = 'none';
  document.querySelector('.main-col-2').style.display = 'none';
}
const drawWeather = function () {
  const weather = state.weather;
  clearAllWeather();
  showUI();
  currentWeatherDiv.insertAdjacentHTML('afterbegin', drawCurrentWeather(weather.current));
  weatherHighlights.insertAdjacentHTML('afterbegin', drawTodaysHighlights(weather.current));
  animateUVIGraph(weather.current.uvi / 10);
  animateHumidityBar(weather.current.humidity / 100);
  weather.daily.map(cur => sevenWeatherDiv.insertAdjacentHTML('beforeend', drawDailyWeather(cur)));
  weather.hourly.map((cur, i) => hourlyWeatherDiv.insertAdjacentHTML('beforeend', drawHourlyWeather(cur)));
  loadingDiv.style.display = 'none';
};

function checkIfFavorited() {
  if (state.favorite_codes.includes(state.location.code)) return `fas`;
  else return `far`;
}
function summarizeVisibility(val) {
  if (val >= 0 && val <= 2999) return `Bad 😑`;
  if (val >= 3000 && val <= 5999) return `Average 🤔`;
  if (val >= 6000) return `Great! 😍`;
}
function summarizeAqi(val) {
  //Air Quality Index. Possible values: 1, 2, 3, 4, 5.
  //Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
  if (val === 1) return `Good 😍`;
  if (val === 2) return `Fair 😄`;
  if (val === 3) return `Moderate 😏`;
  if (val === 4) return `Poor 😵`;
  if (val === 5) return `Very poor 💀`;
}

function drawCurrentWeather(data, unit = 'metric') {
  const setUnit = unit === 'metric' ? '°C' : '°F';
  return `
  <div class="weather-data">
     <div class="weather-images">${addCurrentImages(data.id)}</div>
    <p class="temperature">${data.temperature}${setUnit}</p>
    <p class="time">${data.time}</p>
    <div class="separator"></div>
    <div class="location">
      <img src="${state.location.flag}">
      <p class="locations">${state.location.name}, ${state.location.country}</p>
      <i class="favorite ${checkIfFavorited()} fa-heart"></i>
    </div>
    <div class="data">
      <p class="description">${data.description}. Feels like ${data.feels}${setUnit}.</p>
      <div class="rain-data">
      <img class="pop-icon" src="img/rain-icon.png">
      <p class="description pop">Rain - ${state.weather.hourly[0].pop}%</p>
      </div>
    </div>
  </div>`;
}

//     <img style="height:200px;width:200px" src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
function drawTodaysHighlights(data) {
  return `
  <div class="highlight-card">
    <p class="card-title">UV Index</p>
    <div id="uvi-graph"></div>
  </div>
  <div class="highlight-card">
    <p class="card-title">Wind Status</p>
    <p class="wind-speed"><span class="number">${data.windSpeed}</span> m/s</p>
    <div class="wind-direction-flex">
    <img class="wind-arr" src="img/wind-arr-cb.png" style="transform:rotate(${data.windDegrees}deg)">
    <p class="wind-direction">Direction: ${data.windDirection}</p>
    </div>
  </div>
  <div class="highlight-card">
  <p class="card-title">Sunrise & Sunset</p>
<div class="sunrise-div">
<div class="sunny up"></div>
<i class="fas fa-sort-up"></i>
  <p>${data.sunrise}</p>
  </div>
  <div class="sunset-div">
  <i class="fas fa-sort-down"></i>
  <div class="sunny up"></div>
  <p>${data.sunset}</p>
  </div>
  </div>
  <div class="highlight-card">
  <p class="card-title">Humidity</p>
  <div class="humidity-bar" id="humidity-bar"></div>
</div>
<div class="highlight-card">
  <p class="card-title">Visibility</p>
  <p class="visibility"><span class="number">${data.visibility / 1000}</span> km</p>
  <p class="visibility-summary">${summarizeVisibility(data.visibility)}</p>
  </div>
  <div class="highlight-card">
  <p class="card-title">Air Quality Index</p>
  <p class="air-quality"><span class="number">${data.aqi}</span></p>
  <p class="aqi-summary">${summarizeAqi(data.aqi)}</p>
  </div>

  `;
}

function drawHourlyWeather(data, unit = 'metric') {
  let setUnit = unit === 'metric' ? '°C' : '°F';
  return `<div class="one-hour">
            <div class="col-1">
                <p class="hour">${data.time}:00</p>
            </div>
            <div class="col-2">
            ${addCurrentImages(data.id)}
            </div>
            <div class="col-3">
            <p class="temperature">${data.temperature}${setUnit}</p>
            </div>
            <div class="col-4">
            <img class="pop-icon" src="img/rain-icon.png">
            <p class="pop">${data.pop}%</p>
            </div>
            </div>`;
}

// <img class="icon" src="http://openweathermap.org/img/wn/${data.icon}@2x.png">

function drawDailyWeather(data, unit = 'metric') {
  const setUnit = unit === 'metric' ? '°C' : '°F';
  return `
    <div class="one-day">
    <div class="row row-1">
    <p class="date">${data.date}</p>
    </div>
       
    <div class="row row-2">
    ${addCurrentImages(data.id)}
    </div>
         
    <div class="row row-3">
    <img class="pop-icon" src="img/rain-icon.png">
    <p class="pop">${data.pop}%</p>
    </div>
    
    <div class="row row-4">
    <p class="temperature">${data.temperatureDay}/${data.temperatureNight}${setUnit}</p>
    </div>
            
    <div class="row row-5">
    <p class="description">${data.description}</p>
    </div>
    </div> `;
}

//CLOSE MODAL AND OVERLAY
document.querySelector('.close_modal').addEventListener('click', function () {
  overlay.style.display = 'none';
  modal.style.display = 'none';
  searchGroup.style.display = 'none';
  favoriteCitiesDiv.style.display = 'none';
});

//JUST SHOW SEARCH MODAL
searchButton.addEventListener('click', function () {
  overlay.style.display = 'block';
  modal.style.display = 'block';
  searchGroup.style.display = 'block';
  inputSearch.focus();
});

//JUST SHOW FAVORITE CITIES
favoriteButton.addEventListener('click', function () {
  overlay.style.display = 'block';
  modal.style.display = 'block';
  favoriteCitiesDiv.style.display = 'block';
});

//GEOLOCATION BUTTON
geolocationButton.addEventListener('click', function () {
  welcome.style.display = 'none';
  hideUI();
  clearAllWeather();
  getBrowserGeo();
});

//CLICKING ON A SEARCH RESULT
searchResultsDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.city-search-result');
  if (!clicked) return;
  welcome.style.display = 'none';
  overlay.style.display = 'none';
  searchGroup.style.display = 'none';
  loadingDiv.style.display = 'flex';
  controller(clicked.dataset.lat, clicked.dataset.lon);
});

//DRAW SEARCH RESULTS
function drawSearchCity(data) {
  overlay.style.display = 'block';
  modal.style.display = 'block';
  searchResultsDiv.innerHTML = '';
  if (data.length === 0) {
    searchResultsDiv.innerHTML = `<p>No cities matching your querry.</p><p>Please check for errors!</p>`;
    return;
  } else {
    data.forEach(cur => {
      let html = `<div class="city-search-result" data-lat="${cur.lat}" data-lon="${cur.lon}"><img style="width:30px;margin-right:10px;" src="https://www.countryflags.io/${cur.country}/flat/32.png"><p>${cur.name}, ${cur.country}</p></div>`;
      searchResultsDiv.insertAdjacentHTML('beforeend', html);
    });
  }
}

//ADD TO FAVORITES in state.favorite_cities and state.favorite.codes
currentWeatherDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.favorite');
  if (!clicked) return;

  if (state.favorite_codes.includes(state.location.code)) {
    console.log('allready favorited, deleting');
    let del = state.favorite_codes.indexOf(state.location.code);
    state.favorite_cities.splice(del, 1);
    state.favorite_codes.splice(del, 1);
    localStorage.clear();
  } else {
    console.log('adding to favorites');
    state.favorite_cities.push(state.location);
    state.favorite_codes.push(state.location.code);
    favoriteCitiesDiv.innerHTML = '';
  }
  toggleHeart();
  addToBookmarks();
  displayFavoriteCities();
});

//toggles heart icon when adding or removing favorites
function toggleHeart() {
  if (document.querySelector('.current i').classList.contains('far')) {
    document.querySelector('.current i').classList.remove('far');
    document.querySelector('.current i').classList.add('fas');
    displayModal(`City added to favorites! 😁`);
  } else if (document.querySelector('.current i').classList.contains('fas')) {
    document.querySelector('.current i').classList.remove('fas');
    document.querySelector('.current i').classList.add('far');
    displayModal(`City removed from favorites. ☹`);
  }
}

function displayModal(message) {
  messageModal.innerHTML = `${message}`;
  messageModal.style.display = 'block';
  setInterval(function () {
    messageModal.style.display = 'none';
  }, 3000);
}

//ENTER ON SEARCH, CLEAR ALL WEATHER INFO AND START SEARCH---------------------------------------------------
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    let cityName = inputSearch.value;
    if (!cityName) return;
    clearAllWeather();
    searchForCity(cityName);
  }
});
//ADD FAVORITE TO LOCAL STORAGE
function addToBookmarks() {
  localStorage.setItem('favorite_cities', JSON.stringify(state.favorite_cities));
  localStorage.setItem('favorite_codes', JSON.stringify(state.favorite_codes));
}

//DRAW FAVORITES CITIES IN THE FAVORITE OVERLAY
const displayFavoriteCities = function () {
  if (state.favorite_cities.length === 0) favoriteCitiesDiv.innerHTML = '<h2>No favorites yet ☹</h2>';
  else {
    favoriteCitiesDiv.innerHTML = '<h2>Favorite cities:</h2>';

    state.favorite_cities.forEach(cur => {
      let html = `<div class="favorite-city"><img style="width:30px;margin-right:10px;" src="${cur.flag}"><p data-lat="${cur.coordinates[0]}" data-lon="${cur.coordinates[1]}"data-city="${cur.name}" data-country="${cur.country}">${cur.name}, ${cur.country}</p></div>`;
      favoriteCitiesDiv.insertAdjacentHTML('beforeend', html);
    });
  }
};

//CLICKING ON THE FAVORITE CITY
favoriteCitiesDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.favorite-city p');
  if (!clicked) return;
  hideUI();
  welcome.style.display = 'none';
  modal.style.display = 'none';
  overlay.style.display = 'none';
  favoriteCitiesDiv.style.display = 'none';
  loadingDiv.style.display = 'flex';
  clearAllWeather();
  controller(clicked.dataset.lat, clicked.dataset.lon);
});

//INIT, LOAD FAVORITE CITIES FROM LOCAL STORAGE
const init = function () {
  const storage = localStorage.getItem('favorite_cities');
  const codes = localStorage.getItem('favorite_codes');
  if (storage && codes) {
    state.favorite_cities = JSON.parse(storage);
    state.favorite_codes = JSON.parse(codes);
    displayFavoriteCities();
  } else {
    favoriteCitiesDiv.innerHTML = '<h2>No favorites yet ☹</h2>';
  }
};

init();

function addCurrentImages(id) {
  let curTime = state.weather.current.time.split(':');
  let sunriseTime = state.weather.current.sunrise.split(':');
  let sunsetTime = state.weather.current.sunset.split(':');
  if (id >= 200 && id <= 232) return `<div class="thundery"><div class="thundery__cloud"></div><div class="thundery__rain"></div></div>`;
  if (id >= 300 && id <= 321) return `<div class="shower__rain"><div class="rainy__cloud"></div><div class="rainy__rain"></div></div>`;
  if (id >= 500 && id <= 504)
    return `<div class="rainy"><div class="rainy__cloud"></div><div class="rainy__rain"></div><div class="smaller__sun"></div></div>`;
  if (id >= 511 && id <= 531) return `<div class="shower__rain"><div class="rainy__cloud"></div><div class="rainy__rain"></div></div>`;
  if (id >= 600 && id <= 622) return `<div class="snowy"><div class="rainy__cloud"></div><div class="snow"></div></div>`;
  if (id === 800) {
    if (curTime[0] > sunriseTime[0] && curTime[0] < sunsetTime[0]) return `<div class="sunny"></div>`;
    else return `<div class="moony"></div>`;
  }
  if (id === 801) {
    if (curTime[0] > sunriseTime[0] && curTime[0] < sunsetTime[0])
      return `<div class="partly_cloudy"><div class="partly_cloudy__sun"></div><div class="partly_cloudy__cloud"></div></div>`;
    else return `<div class="partly_cloudy"><div class="partly_cloudy__moon"></div><div class="partly_cloudy__cloud"></div></div>`;
  }

  if (id === 802) return `<div class="cloudy"></div>`;
  if (id >= 803 && id <= 804) return `<div class="more__cloudy"></div>`;
  if (id >= 701 && id <= 781)
    return `<div class="mist">
  <div class="mist-line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="mist-line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="mist-line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="mist-line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>`;
}

//______

function animateUVIGraph(val) {
  var bar = new ProgressBar.SemiCircle('#uvi-graph', {
    strokeWidth: 12,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 5,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: null,
    text: {
      value: '',
      alignToBottom: false,
    },
    from: { color: '#FFEA82' },
    to: { color: '#ED6A5A' },
    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = Math.round(bar.value() * 100);
      if (value === 0) {
        bar.setText('');
      } else {
        bar.setText(val * 10);
      }

      bar.text.style.color = state.color;
      bar.text.style.fontSize = '3rem';
    },
  });

  bar.animate(val); // Number from 0.0 to 1.0
}

function animateHumidityBar(val) {
  var bar = new ProgressBar.Line('#humidity-bar', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#3c63af',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: { width: '100%', height: '100%' },
    text: {
      style: {
        // Text color.
        // Default: same as stroke color (options.color)
        color: '#000000',
        position: 'relative',
        right: '0',
        top: '-80px',
        padding: 0,
        transform: null,
        fontSize: '35px',
      },
      autoStyleContainer: false,
    },
    from: { color: '#FFEA82' },
    to: { color: '#ED6A5A' },
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100) + ' %');
      bar.setText(`${Math.round(bar.value() * 100)} <span style="font-size:18px;margin-top:-8px;position:absolute;">%</span>`);
    },
  });

  bar.animate(val); // Number from 0.0 to 1.0
}

/* document.querySelector('.menu-today').addEventListener('click', function () {
  document.querySelector('.seven-day').style.display = 'none';
  document.querySelector('.this-day').style.display = 'block';
  this.classList.add('active');
});
document.querySelector('.menu-week').addEventListener('click', function () {
  document.querySelector('.this-day').style.display = 'none';
  document.querySelector('.seven-day').style.display = 'block';
  this.classList.add('active');

  // if(this.classList.contains('seven-day'))
}); */

document.querySelectorAll('.link').forEach(cur => {
  cur.addEventListener('click', event => {
    if (cur.classList.contains('today')) {
      document.querySelector('.seven-day').style.display = 'none';
      document.querySelector('.this-day').style.display = 'block';
      document.querySelectorAll('.link').forEach(link => link.classList.remove('active'));
      cur.classList.add('active');
    }
    if (cur.classList.contains('week')) {
      document.querySelector('.this-day').style.display = 'none';
      document.querySelector('.seven-day').style.display = 'block';
      document.querySelectorAll('.link').forEach(link => link.classList.remove('active'));
      cur.classList.add('active');
    }
  });
});
