import * as model from './model.js';
import * as config from './config.js';
import currentView from './views/currentView.js';
import highlightsView from './views/highlightsView.js';
import hourlyView from './views/hourlyView.js';
import dailyView from './views/dailyView.js';
import uiView from './views/uiView.js';
import alertView from './views/alertView.js';
import searchView from './views/searchView.js';
import favoritesView from './views/favoritesVIew.js';

//_________________________________________________CONTROLLER

const controller = async function (lat, lon) {
  try {
    await model.getCityCountryFlag(lat, lon);
    await model.getWeatherData(lat, lon);
    currentView.render(model.state, true, model.state.favorite_codes.includes(model.state.location.code) ? true : false);
    uiView.showUI();
    hourlyView.render(model.state.weather, true);
    highlightsView.render(model.state.weather);
    highlightsView.animate();
    dailyView.render(model.state.weather, true);
  } catch (err) {
    console.error(`🧨  ${err}   🧨`);
  }
};

function drawSearchCity(data) {
  if (data.length === 0 || !data) {
    config.searchResultsDiv.innerHTML = `<p>No cities matching your querry.</p><p>Please check for errors!</p>`;
    return;
  }
  searchView.render(data);
}

async function searchForCity(val) {
  try {
    const data = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=5&appid=${config.appid}`);
    let json = await data.json();
    drawSearchCity(json);
  } catch (err) {
    console.log(err);
  }
}
const getBrowserGeo = function () {
  uiView.hideWelcome();
  uiView.loaderMessage('Getting location data...');
  navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude, longitude } = position.coords;
    controller(latitude, longitude);
  });
};

//GEOLOCATION BUTTON
/* config.geolocationButton.addEventListener('click', function () {
  uiView.hideWelcome();
  uiView.loaderMessage('Getting location data...');
  getBrowserGeo();
}); */

//JUST SHOW SEARCH MODAL
config.searchButton.addEventListener('click', function () {
  searchView.showModal();
});

//CLICKING ON A SEARCH RESULT
config.searchResultsDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.city-search-result');
  if (!clicked) return;
  uiView.hideWelcome();
  uiView.loaderMessage('Getting weather data...');
  searchView.closeModal();
  controller(clicked.dataset.lat, clicked.dataset.lon);
});

//CLICKING ON ALERT BUTTON
config.currentWeatherDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.alert');
  if (!clicked) return;
  if (!model.state.weather.current.alert) return;
  alertView.showModal(model.state.weather.current.alert[0], true);
});

//CLOSE MODAL BUTTONS
config.overlay.addEventListener('click', function (e) {
  const clicked = e.target.closest('.close_modal');
  if (!clicked) return;
  if (clicked.classList.contains('close_modal-search')) searchView.closeModal();
  if (clicked.classList.contains('close_modal-alert')) alertView.closeModal();
  if (clicked.classList.contains('close_modal-favorite')) favoritesView.closeModal();
});

//JUST SHOW FAVORITE CITIES
config.favoriteButton.addEventListener('click', function () {
  favoritesView.showModal(model.state.favorite_cities);
});

//CLICKING ON THE FAVORITE CITY
config.favoriteCitiesDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.favorite-city p');
  if (!clicked) return;
  uiView.hideWelcome();
  uiView.loaderMessage('Getting location data...');
  config.welcome.style.display = 'none';
  favoritesView.closeModal();
  controller(clicked.dataset.lat, clicked.dataset.lon);
});

const init = function () {
  uiView.addHandlerGeolocation(getBrowserGeo);
  searchView.addHandlerEnterInSearch(searchForCity);
  const storage = localStorage.getItem('favorite_cities');
  const codes = localStorage.getItem('favorite_codes');
  if (storage && codes) {
    model.state.favorite_cities = JSON.parse(storage);
    model.state.favorite_codes = JSON.parse(codes);
  }
};

init();

//ADD TO FAVORITES in state.favorite_cities and state.favorite.codes
config.currentWeatherDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.favorite');
  if (!clicked) return;

  if (model.state.favorite_codes.includes(model.state.location.code)) {
    console.log('allready favorited, deleting');
    let del = model.state.favorite_codes.indexOf(model.state.location.code);
    model.state.favorite_cities.splice(del, 1);
    model.state.favorite_codes.splice(del, 1);
    localStorage.clear();
  } else {
    console.log('adding to favorites');
    model.state.favorite_cities.push(model.state.location);
    model.state.favorite_codes.push(model.state.location.code);
    config.favoriteCitiesDiv.innerHTML = '';
  }
  toggleHeart();
  addToBookmarks();
  favoritesView.render(model.state.favorite_cities);
});

//ADD FAVORITE TO LOCAL STORAGE
function addToBookmarks() {
  localStorage.setItem('favorite_cities', JSON.stringify(model.state.favorite_cities));
  localStorage.setItem('favorite_codes', JSON.stringify(model.state.favorite_codes));
}

//toggles heart icon when adding or removing favorites
function toggleHeart() {
  if (document.querySelector('.location i').classList.contains('far')) {
    document.querySelector('.location i').classList.remove('far');
    document.querySelector('.location i').classList.add('fas');
    displayModal(`City added to favorites! 😁`);
  } else if (document.querySelector('.location i').classList.contains('fas')) {
    document.querySelector('.location i').classList.remove('fas');
    document.querySelector('.location i').classList.add('far');
    displayModal(`City removed from favorites. ☹`);
  }
}

function displayModal(message) {
  config.messageModal.innerHTML = `${message}`;
  config.messageModal.style.display = 'block';
  setInterval(function () {
    config.messageModal.style.display = 'none';
  }, 3000);
}
config.currentWeatherDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.next-btn');
  if (!clicked) return;
  hourlyView.slideRight();
});

config.currentWeatherDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.previous-btn');
  if (!clicked) return;
  hourlyView.slideLeft();
});
