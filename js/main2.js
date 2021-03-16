'use strict';

const appid = 'dcf621faa4199052db3aa27bda63a00b';
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const addZero = num => (num < 10 ? '0' + num : +num);

const model = {
  current: {},
  daily: [],
  hourly: [],
  geolocation: {},
  city: {},
  flag: [],
  favorite_cities: [],
};

class AllWeather {
  constructor() {}
}

function windDirectionName(val) {
  let value = parseFloat(val);
  if (value <= 11.25) return 'N';
  value -= 11.25;
  var allDirections = ['NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
  var dIndex = parseInt(value / 22.5);
  return allDirections[dIndex] ? allDirections[dIndex] : 'N';
}

const capitalizeFirstLetter = string => string[0].charAt(0).toUpperCase() + string.slice(1);

const createCurrentWeatherObject = function (data) {
  let date = new Date(data.dt * 1000);
  let hr = addZero(date.getHours());
  let min = addZero(date.getMinutes());
  let day = date.getDate();
  let month = months[date.getMonth()];
  return {
    time: `${hr}:${min}, ${day}. ${month}`,
    icon: data.weather[0].icon,
    temperature: data.temp,
    feels: data.feels_like,
    description: data.weather[0].description,
    windDegrees: data.wind_deg,
    windDirection: windDirectionName(data.wind_deg),
    windSpeed: data.wind_speed,
  };
};

const createHourlyWeatherObject = function (data) {
  let date = new Date(data.dt * 1000);
  let time = date.getHours();
  return {
    time: time,
    icon: data.weather[0].icon,
    temperature: Math.trunc(data.temp),
    pop: data.pop,
  };
};

const createDailyWeatherObject = function (data) {
  let date = new Date(data.dt * 1000);
  let days = date.getDay();
  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    date: day[days],
    icon: data.weather[0].icon,
    temperatureDay: Math.trunc(data.temp.day),
    temperatureNight: Math.trunc(data.temp.night),
    description: capitalizeFirstLetter(data.weather[0].description),
    windDegrees: data.wind_deg,
    windSpeed: data.wind_speed,
    pop: data.pop,
  };
};

//_________________________________________________CONTROLLER

const controller;

const setCityName = async function (latitude, longitude) {
  try {
    const data = await fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
    let json = await data.json();
    console.log(json);
    const { city, country } = json;
    model.geolocation = [latitude, longitude, getCountryFlag(json.country)];
    model.city = [city, country];
    loadWeather(latitude, longitude);
  } catch (err) {
    console.log(err);
  }
};

async function getCountryFlag(country) {
  try {
    const countryData = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
    let json = await countryData.json();
    console.log(json);
    model.flag = json[0].flag;
    console.log(json[0].flag);
  } catch (err) {
    console.log(err);
  }
}

const getBrowserGeo = function () {
  const getLatLng = navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude, longitude } = position.coords;
    setCityName(latitude, longitude);
  });
};

//search for input cities with openweather api
async function searchForCity(val) {
  try {
    const data = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=5&appid=${appid}`);
    let json = await data.json();
    console.log(json);
    drawSearchCity(json);
  } catch (err) {
    console.log(err);
  }
}
async function getCountryFlagShort(country) {
  try {
    const countryData = await fetch(`https://restcountries.eu/rest/v2/alpha/${country}`);
    let json = await countryData.json();
    model.flag = json[0].flag;
    console.log(json[0].flag);
  } catch (err) {
    console.log(err);
  }
}

function drawSearchCity(data) {
  document.querySelector('.overlay').style.display = 'block';
  document.querySelector('.modal').style.display = 'block';
  let drawTo = document.querySelector('.search-results');
  drawTo.innerHTML = '';
  if (data.length === 0) {
    drawTo.innerHTML = `<p>No cities matching your querry.</p><p>Please check for errors!</p>`;
    return;
  } else {
    data.forEach(cur => {
      let html = `<div class="city-search-result" data-lat="${cur.lat}" data-lon="${cur.lon}">${cur.name}, ${cur.country}</div>`;
      drawTo.insertAdjacentHTML('beforeend', html);
    });
  }
}

const clearAllWeather = function () {
  document.querySelector('.current').innerHTML = '';
  document.querySelector('.seven-day').innerHTML = '';
  document.querySelector('.hourly').innerHTML = '';
  document.querySelector('.search').value = '';
  document.querySelector('.search-results').innerHTML = '';
};

const loadWeather = function (latitude, longitude, unit = 'metric') {
  clearAllWeather();
  document.querySelector('.loading').style.display = 'block';
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${unit}&exclude={part}&appid=${appid}`)
    .then(response => response.json())
    .then(data => {
      model.current = createCurrentWeatherObject(data.current);
      for (let i = 0; i < 6; i++) {
        model.hourly[i] = createHourlyWeatherObject(data.hourly[i]);
      }
      data.daily.forEach((cur, i) => {
        model.daily[i] = createDailyWeatherObject(cur);
      });

      document.querySelector('.current').insertAdjacentHTML('afterbegin', drawCurrentWeather(model.current));
      model.daily.forEach(cur => {
        document.querySelector('.seven-day').insertAdjacentHTML('beforeend', drawDailyWeather(cur));
      });
      model.hourly.forEach((cur, i) => {
        document.querySelector('.hourly').insertAdjacentHTML('beforeend', drawHourlyWeather(cur));
      });
    })
    .catch(err => console.log(err))
    .finally(() => {
      document.querySelector('.loading').style.display = 'none';
    });
};
//loadWeather();

function checkIfFavorited() {
  model.favorite -
    cities.forEach(cur => {
      if (cur[0] === model.city[0]) return 'far';
      else return 'fas';
    });
}

function drawCurrentWeather(data, type = 'current', unit = 'metric') {
  const setUnit2 = unit === 'metric' ? '°C' : 'deg f';
  return `
    <div class="${type}">
        <div class="weather-data">
        <p class="time">${data.time}</p>
        <div class="location">
        <img src="${model.flag}">
        <p class="locations">${model.city[0]}, ${model.city[1]}</p>
        <i class="favorite far fa-heart"></i>
        </div>
            <div class="icon">
                <img style="height:100px;width:100px" src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
                <p class="temperature">${data.temperature}${setUnit2}</p>
            </div>
            <div class="data">
                <p class="description">Feels like ${data.feels}${setUnit2}. ${data.description}</p>
                <div class="wind">
                <img class="wind-arr" src="img/wind-arr-cb.png" style="transform:rotate(${data.windDegrees}deg)">
                <p class="description">Wind: ${data.windDegrees}° @ ${data.windSpeed}m/s Direction: ${data.windDirection}</p>
                </div>
            </div>
        </div>
    </div>
    `;
}

function drawHourlyWeather(data, type = 'hourly', unit = 'metric') {
  let setUnit = unit === 'metric' ? '°C' : 'deg f';
  return `
        <div class="one-hour">
            <div class="col-1">
                <p class="hour">${data.time}:00</p>
            </div>
            <div class="col-2">
                <img class="icon" src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
            </div>
            <div class="col-3">
                <p class="temperature">${data.temperature}${setUnit}</p>
            </div>
            <div class="col-4">
                <img class="pop-icon" src="img/rain-icon.png">
                <p class="pop">${data.pop}%</p>
            </div>
        </div>
    `;
}

function drawDailyWeather(data, type = 'one-day', unit = 'metric') {
  const setUnit2 = unit === 'metric' ? '°C' : 'deg f';
  return `
    <div class="${type}">

    <div class="row row-1">
    <p class="date">${data.date}</p>
    </div>
       
    <div class="row row-2">
    <img class="icon" src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
    </div>
         
    <div class="row row-3">
    <img class="pop-icon" src="img/rain-icon.png">
    <p class="pop">${data.pop}%</p>
    </div>
    
    <div class="row row-4">
    <p class="temperature">${data.temperatureDay}/${data.temperatureNight}${setUnit2}</p>
    </div>
            
    <div class="row row-5">
    <p class="description">${data.description}</p>
    </div>
       
    </div>
    `;
}

//CLOSE MODAL AND OVERLAY
document.querySelector('.close_modal').addEventListener('click', function () {
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('.modal').style.display = 'none';
  document.querySelector('.search_group').style.display = 'none';
  document.querySelector('.favorite-cities').style.display = 'none';
});

//JUST SHOW SEARCH MODAL
document.querySelector('.search-icon').addEventListener('click', function () {
  document.querySelector('.overlay').style.display = 'block';
  document.querySelector('.modal').style.display = 'block';
  document.querySelector('.search_group').style.display = 'block';
  document.querySelector('.search').focus();
});

//JUST SHOW FAVORITE CITIES
document.querySelector('.show-favorite-overlay').addEventListener('click', function () {
  document.querySelector('.overlay').style.display = 'block';
  document.querySelector('.modal').style.display = 'block';
  document.querySelector('.favorite-cities').style.display = 'block';
});

//GEOLOCATION BUTTON
document.querySelector('.geolocation').addEventListener('click', function () {
  document.querySelector('.welcome').style.display = 'none';
  getBrowserGeo();
});

//CLICKING ON A SEARCH RESULT
document.querySelector('.search-results').addEventListener('click', function (e) {
  const clicked = e.target.closest('.city-search-result');
  if (!clicked) return;
  document.querySelector('.welcome').style.display = 'none';
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('.search_group').style.display = 'none';
  setCityName(clicked.dataset.lat, clicked.dataset.lon);
});

//ADD TO FAVORITES
document.querySelector('.current').addEventListener('click', function () {
  if (!model.geolocation) return;
  let thisCity = model.city.concat(model.geolocation);
  model.favorite - cities.push(thisCity);
  addToBookmarks();
  document.querySelector('.favorite-cities').innerHTML = '';
  displayFavoriteCities();
});
//ENTER ON SEARCH, CLEAR ALL WEATHER INFO AND START SEARCH---------------------------------------------------
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    let cityName = document.querySelector('.search').value;
    if (!cityName) return;
    clearAllWeather();
    searchForCity(cityName);
  }
});
//ADD FAVORITE TO LOCAL STORAGE
function addToBookmarks() {
  localStorage.setItem('favorite-cities', JSON.stringify(model.favorite - cities));
}

//DRAW FAVORITES CITIES IN THE FAVORITE OVERLAY
const displayFavoriteCities = function () {
  document.querySelector('.favorite-cities').innerHTML = 'Favorite cities:';

  model.favorite -
    cities.forEach(cur => {
      let html = `<p class="favorite-city" data-lat="${cur[2]}" data-lon="${cur[3]}"data-city="${cur[0]}" data-country="${cur[1]}">${cur[0]}, ${cur[1]}</p>`;
      document.querySelector('.favorite-cities').insertAdjacentHTML('beforeend', html);
    });
};

//CLICKING ON THE FAVORITE CITY
document.querySelector('.favorite-cities').addEventListener('click', function (e) {
  const clicked = e.target.closest('.favorite-city');
  if (!clicked) return;
  document.querySelector('.welcome').style.display = 'none';
  document.querySelector('.modal').style.display = 'none';
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('.favorite-cities').style.display = 'none';
  //model.city=[clicked.dataset.city,clicked.dataset.country];
  setCityName(clicked.dataset.lat, clicked.dataset.lon);
});

//INIT, LOAD FAVORITE CITIES FROM LOCAL STORAGE
const init = function () {
  const storage = localStorage.getItem('favorite-cities');
  if (storage) {
    model.favorite_cities = JSON.parse(storage);
    displayFavoriteCities();
  }
};

init();
