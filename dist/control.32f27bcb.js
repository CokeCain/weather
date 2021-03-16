// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"c07b5c1c1597ed9ba5381d1c6e586dc8":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "32f27bcbb00f7c6d064233eaf53c15a9";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets; // eslint-disable-next-line no-redeclare

var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
  var port = HMR_PORT || location.port;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(global.parcelRequire, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var absolute = /^https?:\/\//i.test(links[i].getAttribute('href'));

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(global.parcelRequire, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"17ecd430a77ab2e8d677328a39e1de5a":[function(require,module,exports) {
"use strict";

var model = _interopRequireWildcard(require("./model.js"));

var config = _interopRequireWildcard(require("./config.js"));

var _currentView = _interopRequireDefault(require("./views/currentView.js"));

var _highlightsView = _interopRequireDefault(require("./views/highlightsView.js"));

var _hourlyView = _interopRequireDefault(require("./views/hourlyView.js"));

var _dailyView = _interopRequireDefault(require("./views/dailyView.js"));

var _uiView = _interopRequireDefault(require("./views/uiView.js"));

var _alertView = _interopRequireDefault(require("./views/alertView.js"));

var _searchView = _interopRequireDefault(require("./views/searchView.js"));

var _favoritesVIew = _interopRequireDefault(require("./views/favoritesVIew.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//_________________________________________________CONTROLLER
const controller = async function (lat, lon) {
  try {
    await model.getCityCountryFlag(lat, lon);
    await model.getWeatherData(lat, lon);

    _currentView.default.render(model.state, true, model.state.favorite_codes.includes(model.state.location.code) ? true : false);

    _uiView.default.showUI();

    _hourlyView.default.render(model.state.weather, true);

    _highlightsView.default.render(model.state.weather);

    _highlightsView.default.animate();

    _dailyView.default.render(model.state.weather, true);
  } catch (err) {
    console.error(`🧨  ${err}   🧨`);
  }
};

function drawSearchCity(data) {
  if (data.length === 0 || !data) {
    config.searchResultsDiv.innerHTML = `<p>No cities matching your querry.</p><p>Please check for errors!</p>`;
    return;
  }

  _searchView.default.render(data);
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
  _uiView.default.hideWelcome();

  _uiView.default.loaderMessage('Getting location data...');

  navigator.geolocation.getCurrentPosition(function (position) {
    const {
      latitude,
      longitude
    } = position.coords;
    controller(latitude, longitude);
  });
}; //GEOLOCATION BUTTON

/* config.geolocationButton.addEventListener('click', function () {
  uiView.hideWelcome();
  uiView.loaderMessage('Getting location data...');
  getBrowserGeo();
}); */
//JUST SHOW SEARCH MODAL


config.searchButton.addEventListener('click', function () {
  _searchView.default.showModal();
}); //CLICKING ON A SEARCH RESULT

config.searchResultsDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.city-search-result');
  if (!clicked) return;

  _uiView.default.hideWelcome();

  _uiView.default.loaderMessage('Getting weather data...');

  _searchView.default.closeModal();

  controller(clicked.dataset.lat, clicked.dataset.lon);
}); //CLICKING ON ALERT BUTTON

config.currentWeatherDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.alert');
  if (!clicked) return;
  if (!model.state.weather.current.alert) return;

  _alertView.default.showModal(model.state.weather.current.alert[0], true);
}); //CLOSE MODAL BUTTONS

config.overlay.addEventListener('click', function (e) {
  const clicked = e.target.closest('.close_modal');
  if (!clicked) return;
  if (clicked.classList.contains('close_modal-search')) _searchView.default.closeModal();
  if (clicked.classList.contains('close_modal-alert')) _alertView.default.closeModal();
  if (clicked.classList.contains('close_modal-favorite')) _favoritesVIew.default.closeModal();
}); //JUST SHOW FAVORITE CITIES

config.favoriteButton.addEventListener('click', function () {
  _favoritesVIew.default.showModal(model.state.favorite_cities);
}); //CLICKING ON THE FAVORITE CITY

config.favoriteCitiesDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.favorite-city p');
  if (!clicked) return;

  _uiView.default.hideWelcome();

  _uiView.default.loaderMessage('Getting location data...');

  config.welcome.style.display = 'none';

  _favoritesVIew.default.closeModal();

  controller(clicked.dataset.lat, clicked.dataset.lon);
});

const init = function () {
  _uiView.default.addHandlerGeolocation(getBrowserGeo);

  _searchView.default.addHandlerEnterInSearch(searchForCity);

  const storage = localStorage.getItem('favorite_cities');
  const codes = localStorage.getItem('favorite_codes');

  if (storage && codes) {
    model.state.favorite_cities = JSON.parse(storage);
    model.state.favorite_codes = JSON.parse(codes);
  }
};

init(); //ADD TO FAVORITES in state.favorite_cities and state.favorite.codes

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

  _favoritesVIew.default.render(model.state.favorite_cities);
}); //ADD FAVORITE TO LOCAL STORAGE

function addToBookmarks() {
  localStorage.setItem('favorite_cities', JSON.stringify(model.state.favorite_cities));
  localStorage.setItem('favorite_codes', JSON.stringify(model.state.favorite_codes));
} //toggles heart icon when adding or removing favorites


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

  _hourlyView.default.slideRight();
});
config.currentWeatherDiv.addEventListener('click', function (e) {
  const clicked = e.target.closest('.previous-btn');
  if (!clicked) return;

  _hourlyView.default.slideLeft();
});
},{"./model.js":"74840c3318f25b13da78c459afe13880","./config.js":"1898557d11834653c60b8de26f27be98","./views/currentView.js":"4834c9d78f0d8ec1d9395c0a9b44e7a3","./views/highlightsView.js":"86d48fda7c79c6a9a066dc83981fb556","./views/hourlyView.js":"184d7559ceb43b547f07ff06053bde71","./views/dailyView.js":"834f3dec3963e9d023517963eb18d5ac","./views/uiView.js":"52910ba17b818e097e907dc8726ad052","./views/alertView.js":"2e2ad943c2fed0b46031c983314546e3","./views/searchView.js":"36c490ed82703d3a77dfe11e1df49cd0","./views/favoritesVIew.js":"4273fa8e0c2f523027ebbb0a1fcdbe19"}],"74840c3318f25b13da78c459afe13880":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWeatherData = getWeatherData;
exports.getCityCountryFlag = exports.state = void 0;

var config = _interopRequireWildcard(require("./config.js"));

var helpers = _interopRequireWildcard(require("./helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const state = {
  location: {},
  weather: {
    current: [],
    hourly: [],
    daily: []
  },
  favorite_cities: [],
  favorite_codes: []
};
exports.state = state;

class Location {
  constructor(name, country, flag, coordinates, code) {
    this.name = name;
    this.country = country;
    this.flag = flag;
    this.coordinates = coordinates;
    this.code = code;
  }

}

const getCityCountryFlag = async function (latitude, longitude) {
  try {
    const data = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    const json = await data.json();
    const city = json.city === '' ? json.locality : json.city;
    const {
      countryName,
      countryCode
    } = json;
    const flag = await getCountryFlag(countryName);
    state.location = new Location(city, countryName, flag, [latitude, longitude], city.toUpperCase() + countryCode);
  } catch (err) {
    console.log(err);
  }
};

exports.getCityCountryFlag = getCityCountryFlag;

async function getCountryFlag(country) {
  try {
    const countryData = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
    let json = await countryData.json();
    return json[0].flag;
  } catch (err) {
    console.log(err);
  }
}

async function getWeatherData(latitude, longitude) {
  try {
    const json = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${config.unit}&exclude={part}&appid=${config.appid}`);
    let weather = await json.json();
    let aqi = await getAirQualityIndex(latitude, longitude);
    populateWeatherState(weather, aqi);
  } catch (err) {
    console.log(err);
  }
}

async function getAirQualityIndex(lat, lon) {
  try {
    const data = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${config.appid}`);
    let json = await data.json();
    return json.list[0].main.aqi;
  } catch (err) {
    console.log(err);
  }
}

const createCurrentWeatherObject = function (data, index) {
  let [hr, min, day, month] = helpers.getTime(data.current.dt);
  return {
    time: `${hr}:${min}, ${day}. ${month}`,
    icon: data.current.weather[0].icon,
    sunrise: `${helpers.getTime(data.current.sunrise)[0]}:${helpers.getTime(data.current.sunrise)[1]}`,
    sunset: `${helpers.getTime(data.current.sunset)[0]}:${helpers.getTime(data.current.sunset)[1]}`,
    uvi: data.current.uvi,
    visibility: data.current.visibility,
    temperature: Math.floor(data.current.temp),
    feels: data.current.feels_like,
    description: data.current.weather[0].description,
    id: data.current.weather[0].id,
    windDegrees: data.current.wind_deg,
    windDirection: helpers.windDirectionName(data.current.wind_deg),
    windSpeed: data.current.wind_speed,
    humidity: data.current.humidity,
    aqi: index,
    //alert: alerts,
    ...(data.alerts && {
      alert: data.alerts
    })
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
    pop: data.pop
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
    description: helpers.capitalizeFirstLetter(data.weather[0].description),
    windDegrees: data.wind_deg,
    windSpeed: data.wind_speed,
    pop: data.pop
  };
};

function populateWeatherState(data, aqi) {
  state.weather.current = createCurrentWeatherObject(data, aqi);
  data.daily.map((cur, i) => state.weather.daily[i] = createDailyWeatherObject(cur));
  data.hourly.map((cur, i) => state.weather.hourly[i] = createHourlyWeatherObject(cur));
}
},{"./config.js":"1898557d11834653c60b8de26f27be98","./helpers.js":"715c822c8e68ae99f2c71710e762106f"}],"1898557d11834653c60b8de26f27be98":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weatherDiv = exports.thisDay = exports.weatherHighlights = exports.todayWeatherDesc = exports.locationDiv = exports.tempAndImg = exports.messageModal = exports.searchGroup = exports.searchButton = exports.favoriteButton = exports.geolocationButton = exports.closeModalBtn = exports.modalOverlay = exports.overlay = exports.favoriteModal = exports.searchModal = exports.informationModal = exports.modal = exports.welcome = exports.favoriteCitiesDiv = exports.searchResultsDiv = exports.inputSearch = exports.loadingMessage = exports.loadingDiv = exports.hourlyWeatherDiv = exports.sevenWeatherDiv = exports.currentWeatherDiv = exports.appikey = exports.appid = exports.unit = void 0;
const unit = 'metric';
exports.unit = unit;
const appid = 'dcf621faa4199052db3aa27bda63a00b';
exports.appid = appid;
const appikey = 'f5b9a7ccf55443d28087fe4daedee6c4';
exports.appikey = appikey;
const currentWeatherDiv = document.querySelector('.current');
exports.currentWeatherDiv = currentWeatherDiv;
const sevenWeatherDiv = document.querySelector('.seven-day');
exports.sevenWeatherDiv = sevenWeatherDiv;
const hourlyWeatherDiv = document.querySelector('.hourly');
exports.hourlyWeatherDiv = hourlyWeatherDiv;
const loadingDiv = document.querySelector('.loading');
exports.loadingDiv = loadingDiv;
const loadingMessage = document.querySelector('.loader-message');
exports.loadingMessage = loadingMessage;
const inputSearch = document.querySelector('.search');
exports.inputSearch = inputSearch;
const searchResultsDiv = document.querySelector('.search-results');
exports.searchResultsDiv = searchResultsDiv;
const favoriteCitiesDiv = document.querySelector('.favorite-cities');
exports.favoriteCitiesDiv = favoriteCitiesDiv;
const welcome = document.querySelector('.welcome');
exports.welcome = welcome;
const modal = document.querySelector('.modal');
exports.modal = modal;
const informationModal = document.querySelector('.information-modal');
exports.informationModal = informationModal;
const searchModal = document.querySelector('.search-modal');
exports.searchModal = searchModal;
const favoriteModal = document.querySelector('.favorite-modal');
exports.favoriteModal = favoriteModal;
const overlay = document.querySelector('.overlay');
exports.overlay = overlay;
const modalOverlay = document.querySelector('.modal-overlay');
exports.modalOverlay = modalOverlay;
const closeModalBtn = document.querySelector('.close_modal');
exports.closeModalBtn = closeModalBtn;
const geolocationButton = document.querySelector('.geolocation-button');
exports.geolocationButton = geolocationButton;
const favoriteButton = document.querySelector('.favorite-button');
exports.favoriteButton = favoriteButton;
const searchButton = document.querySelector('.search-button');
exports.searchButton = searchButton;
const searchGroup = document.querySelector('.search_group');
exports.searchGroup = searchGroup;
const messageModal = document.querySelector('.message-modal');
exports.messageModal = messageModal;
const tempAndImg = document.querySelector('.temperature-and-image');
exports.tempAndImg = tempAndImg;
const locationDiv = document.querySelector('.location');
exports.locationDiv = locationDiv;
const todayWeatherDesc = document.querySelector('.today-weather-description');
exports.todayWeatherDesc = todayWeatherDesc;
const weatherHighlights = document.querySelector('.weather-highlights');
exports.weatherHighlights = weatherHighlights;
const thisDay = document.querySelector('.this-day');
exports.thisDay = thisDay;
const weatherDiv = document.querySelector('.weather');
exports.weatherDiv = weatherDiv;
},{}],"715c822c8e68ae99f2c71710e762106f":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statusMessage = statusMessage;
exports.addCurrentImages = addCurrentImages;
exports.animateHumidityBar = exports.animateUVIGraph = exports.summarizeAqi = exports.summarizeVisibility = exports.checkIfFavorited = exports.getTime = exports.capitalizeFirstLetter = exports.windDirectionName = exports.addZero = void 0;

var model = _interopRequireWildcard(require("./model.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const addZero = num => num < 10 ? '0' + num : +num;

exports.addZero = addZero;

const windDirectionName = function (val) {
  let value = parseFloat(val);
  if (value <= 11.25) return 'N';
  value -= 11.25;
  let allDirections = ['NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
  let dIndex = parseInt(value / 22.5);
  return allDirections[dIndex] ? allDirections[dIndex] : 'N';
};

exports.windDirectionName = windDirectionName;

const capitalizeFirstLetter = string => string[0].charAt(0).toUpperCase() + string.slice(1);

exports.capitalizeFirstLetter = capitalizeFirstLetter;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getTime = function (ms) {
  let date = new Date(ms * 1000);
  let hr = addZero(date.getHours());
  let min = addZero(date.getMinutes());
  let day = date.getDate();
  let month = months[date.getMonth()];
  return [hr, min, day, month];
};

exports.getTime = getTime;

const checkIfFavorited = function () {
  if (model.state.favorite_codes.includes(model.state.location.code)) return `fas`;else return `far`;
};

exports.checkIfFavorited = checkIfFavorited;

function statusMessage() {
  console.log('made it');
}

function addCurrentImages(id, time, sunrise, sunset) {
  let curTime = time.split(':');
  let sunriseTime = sunrise.split(':');
  let sunsetTime = sunset.split(':');
  if (id >= 200 && id <= 232) return `<div class="thundery"><div class="thundery__cloud"></div><div class="thundery__rain"></div></div>`;
  if (id >= 300 && id <= 321) return `<div class="shower__rain"><div class="rainy__cloud"></div><div class="rainy__rain"></div></div>`;
  if (id >= 500 && id <= 504) if (curTime[0] > sunriseTime[0] && curTime[0] < sunsetTime[0]) return `<div class="rainy"><div class="rainy__cloud"></div><div class="rainy__rain"></div><div class="smaller__sun"></div></div>`;else return `<div class="rainy"><div class="rainy__cloud"></div><div class="rainy__rain"></div><div class="smaller__moon"></div></div>`;
  if (id >= 511 && id <= 531) return `<div class="shower__rain"><div class="rainy__cloud"></div><div class="rainy__rain"></div></div>`;
  if (id >= 600 && id <= 622) return `<div class="snowy"><div class="rainy__cloud"></div><div class="snow"></div></div>`;

  if (id === 800) {
    if (curTime[0] > sunriseTime[0] && curTime[0] < sunsetTime[0]) return `<div class="sunny"></div>`;else return `<div class="moony"></div>`;
  }

  if (id === 801) {
    if (curTime[0] > sunriseTime[0] && curTime[0] < sunsetTime[0]) return `<div class="partly_cloudy"><div class="partly_cloudy__sun"></div><div class="partly_cloudy__cloud"></div></div>`;else return `<div class="partly_cloudy"><div class="partly_cloudy__moon"></div><div class="partly_cloudy__cloud"></div></div>`;
  }

  if (id === 802) return `<div class="cloudy"></div>`;
  if (id >= 803 && id <= 804) return `<div class="more__cloudy"></div>`;
  if (id >= 701 && id <= 781) return `<div class="mist">
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

const summarizeVisibility = function (val) {
  if (val >= 0 && val <= 2999) return `Bad 😑`;
  if (val >= 3000 && val <= 5999) return `Average 🤔`;
  if (val >= 6000) return `Great! 😍`;
};

exports.summarizeVisibility = summarizeVisibility;

const summarizeAqi = function (val) {
  //Air Quality Index. Possible values: 1, 2, 3, 4, 5.
  //Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
  if (val === 1) return `Good 😍`;
  if (val === 2) return `Fair 😄`;
  if (val === 3) return `Moderate 😏`;
  if (val === 4) return `Poor 😵`;
  if (val === 5) return `Very poor 💀`;
};

exports.summarizeAqi = summarizeAqi;

const animateUVIGraph = function (val) {
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
      alignToBottom: false
    },
    from: {
      color: '#FFEA82'
    },
    to: {
      color: '#ED6A5A'
    },
    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = Math.round(bar.value() * 100);

      if (value === 0) {
        bar.setText('');
      } else {
        bar.setText((val * 10).toFixed(2));
      }

      bar.text.style.color = state.color;
      bar.text.style.fontSize = '3rem';
    }
  });
  bar.animate(val); // Number from 0.0 to 1.0
};

exports.animateUVIGraph = animateUVIGraph;

const animateHumidityBar = function (val) {
  var bar = new ProgressBar.Line('#humidity-bar', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#3c63af',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: {
      width: '100%',
      height: '100%'
    },
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
        fontSize: '35px'
      },
      autoStyleContainer: false
    },
    from: {
      color: '#FFEA82'
    },
    to: {
      color: '#ED6A5A'
    },
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100) + ' %');
      bar.setText(`${Math.round(bar.value() * 100)} <span style="font-size:18px;margin-top:-8px;position:absolute;">%</span>`);
    }
  });
  bar.animate(val); // Number from 0.0 to 1.0
};

exports.animateHumidityBar = animateHumidityBar;
},{"./model.js":"74840c3318f25b13da78c459afe13880"}],"4834c9d78f0d8ec1d9395c0a9b44e7a3":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View = _interopRequireDefault(require("./View.js"));

var config = _interopRequireWildcard(require("../config.js"));

var helpers = _interopRequireWildcard(require("../helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CurrentView extends _View.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_parentElement", config.currentWeatherDiv);
  }

  _generateMarkup() {
    const setUnit = config.unit === 'metric' ? '°C' : '°F';
    return `
    <div class="weather-data">
    <div class="location">
    <div>
      <p class="city-name">${this._data.location.name},</p>
      <img class="flag" src="${this._data.location.flag}"><p class="country-name">${this._data.location.country}</p>
      <i class="favorite ${this._bookmarked === true ? 'fas' : 'far'} fa-heart"></i>
      <p class="date-time">${this._data.weather.current.time}</p>
      </div>
      <div class="temperature-and-image">
      <div class="weather-images">${helpers.addCurrentImages(this._data.weather.current.id, this._data.weather.current.time, this._data.weather.current.sunrise, this._data.weather.current.sunset)}</div>
      <div>
      <p class="temperature">${this._data.weather.current.temperature}<span>${setUnit}</span></p>
      <p class="description">${this._data.weather.current.description}</p>
      </div>
    </div>
    <div class="today-weather-description">
    <div class="description-icon wind"><img src="img/wind-icon.png"><p>${this._data.weather.current.windSpeed} km/h</p></div>
    <div class="description-icon rain"><img src="img/rain-icon.png"><p>${this._data.weather.current.humidity} %</p></div>
    <div class="description-icon pop"><img src="img/pop-icon.png"><p>${Math.round(this._data.weather.hourly[0].pop * 100)} %</p></div>
    </div>
    <div class="data alert-label">
            <p class="tag alert">${this._checkForAlerts()}</p>
    </div>
    <div class="direction-buttons">
    <div class="botun previous-btn">Previous 4 hours</i></div>
    <div class="botun next-btn">Next 4 hours</div>
    </div>
    `;
  }

  _checkForAlerts() {
    if (this._data.weather.current.alert === undefined) return `No alerts!`;else return `${this._data.weather.current.alert[0].event}`;
  }

}

var _default = new CurrentView();

exports.default = _default;
},{"./View.js":"6da7298b7a1ae02dfd20dd548d976f5c","../config.js":"1898557d11834653c60b8de26f27be98","../helpers.js":"715c822c8e68ae99f2c71710e762106f"}],"6da7298b7a1ae02dfd20dd548d976f5c":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class View {
  constructor() {
    _defineProperty(this, "_data", void 0);

    _defineProperty(this, "_bookmarked", void 0);
  }

  render(data, render = true, bookmarked) {
    this._data = data;
    this._bookmarked = bookmarked;

    const markup = this._generateMarkup(); //if (!render) return markup;


    this._clear();

    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

}

exports.default = View;
},{}],"86d48fda7c79c6a9a066dc83981fb556":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View = _interopRequireDefault(require("./View.js"));

var _hourlyView = _interopRequireDefault(require("./hourlyView.js"));

var config = _interopRequireWildcard(require("../config.js"));

var helpers = _interopRequireWildcard(require("../helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HighlightsView extends _View.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_parentElement", config.weatherHighlights);

    _defineProperty(this, "_bookmarked", void 0);
  }

  _generateMarkup() {
    const setUnit = config.unit === 'metric' ? '°C' : '°F';
    return `<div class="highlight-card">
    <p class="card-title">UV Index</p>
    <div id="uvi-graph"></div>
    </div>
    <div class="highlight-card">
    <p class="card-title">Wind Status</p>
    <p class="wind-speed"><span class="number">${this._data.current.windSpeed}</span> m/s</p>
    <div class="wind-direction-flex">
    <img class="wind-arr" src="img/wind-arr-cb.png" style="transform:rotate(${this._data.current.windDegrees}deg)">
    <p class="wind-direction">Direction: ${this._data.current.windDirection}</p>
    </div>
    </div>
    <div class="highlight-card">
    <p class="card-title">Sunrise & Sunset</p>
    <div class="sunrise-div">
    <div class="sunny up"></div>
    <i class="fas fa-sort-up"></i>
    <p>${this._data.current.sunrise}</p>
    </div>
    <div class="sunset-div">
    <i class="fas fa-sort-down"></i>
    <div class="sunny up"></div>
    <p>${this._data.current.sunset}</p>
    </div>
    </div>
    <div class="highlight-card">
    <p class="card-title">Humidity</p>
    <div class="humidity-bar" id="humidity-bar"></div>
    </div>
    <div class="highlight-card">
    <p class="card-title">Visibility</p>
    <p class="visibility"><span class="number">${this._data.current.visibility / 1000}</span> km</p>
    <p class="visibility-summary">${helpers.summarizeVisibility(this._data.current.visibility)}</p>
    </div>
    <div class="highlight-card">
    <p class="card-title">Air Quality Index</p>
    <p class="air-quality"><span class="number">${this._data.current.aqi}</span></p>
    <p class="aqi-summary">${helpers.summarizeAqi(this._data.current.aqi)}</p>
    </div>
    `;
  }

  animate() {
    helpers.animateUVIGraph(this._data.current.uvi / 10);
    helpers.animateHumidityBar(this._data.current.humidity / 100);
  }

  hourlyMarkup() {
    const setUnit = config.unit === 'metric' ? '°C' : '°F';
    console.log(this._data.hourly[0].time);
    return `${this._data.hourly.forEach(cur => cur.uvi)}`;
  }

}

var _default = new HighlightsView();

exports.default = _default;
},{"./View.js":"6da7298b7a1ae02dfd20dd548d976f5c","./hourlyView.js":"184d7559ceb43b547f07ff06053bde71","../config.js":"1898557d11834653c60b8de26f27be98","../helpers.js":"715c822c8e68ae99f2c71710e762106f"}],"184d7559ceb43b547f07ff06053bde71":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View = _interopRequireDefault(require("./View.js"));

var config = _interopRequireWildcard(require("../config.js"));

var helpers = _interopRequireWildcard(require("../helpers.js"));

var _hourlyViewMarkup = _interopRequireDefault(require("./hourlyViewMarkup.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HourlyView extends _View.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_parentElement", config.hourlyWeatherDiv);

    _defineProperty(this, "_hoursPerPage", 4);

    _defineProperty(this, "_totalHours", 48);

    _defineProperty(this, "_page", 1);
  }

  _generateMarkup() {
    const setUnit = config.unit === 'metric' ? '°C' : '°F';
    return this._data.hourly.map(cur => {
      return `<div class="one-hour">
    <div class="col-1">
        <p class="hour">${cur.time}:00</p>
    </div>
    <div class="col-2">
    ${helpers.addCurrentImages(cur.id, this._data.current.time, this._data.current.sunrise, this._data.current.sunset)}

    </div>
    <div class="col-3">
    <p class="temperature">${cur.temperature}${setUnit}</p>
    </div>
    </div>`;
    }).join('');
  }

  _generateMarkup2() {
    return this._data.hourly.map(cur => _hourlyViewMarkup.default.render(cur, false)).join('');
  }

  slideRight() {
    let width = document.querySelector('.one-hour').offsetWidth + 15;
    let rect = config.hourlyWeatherDiv.getBoundingClientRect();
    let rect2 = config.currentWeatherDiv.getBoundingClientRect();

    if (this._page < this._totalHours / this._hoursPerPage) {
      config.hourlyWeatherDiv.style.right = this._page * this._hoursPerPage * width + 'px';
      this._page++;
      document.querySelector('.previous-btn').style.display = 'block';
    } else {
      document.querySelector('.next-btn').style.display = 'none';
    }
  }

  slideLeft() {
    let width = document.querySelector('.one-hour').offsetWidth + 15;

    if (this._page > 1) {
      config.hourlyWeatherDiv.style.right = (this._page - 2) * this._hoursPerPage * width + 'px';
      this._page--;
      document.querySelector('.next-btn').style.display = 'block';
    } else {
      document.querySelector('.previous-btn').style.display = 'none';
    }
  }

}

var _default = new HourlyView();

exports.default = _default;
},{"./View.js":"6da7298b7a1ae02dfd20dd548d976f5c","../config.js":"1898557d11834653c60b8de26f27be98","../helpers.js":"715c822c8e68ae99f2c71710e762106f","./hourlyViewMarkup.js":"6ec9afdbe04e7072500fc8b097ef5b76"}],"6ec9afdbe04e7072500fc8b097ef5b76":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View = _interopRequireDefault(require("./View.js"));

var config = _interopRequireWildcard(require("../config.js"));

var helpers = _interopRequireWildcard(require("../helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class hourlyViewMarkup extends _View.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_parentElement", '');
  }

  _generateMarkup(val) {
    const setUnit = config.unit === 'metric' ? '°C' : '°F';
    return `<div class="one-hour">
    <div class="col-1">
        <p class="hour">${this._data.time}:00</p>
    </div>
    <div class="col-2">
    ${helpers.addCurrentImages(cur.id, this._data.current.time, this._data.current.sunrise, this._data.current.sunset)}
    </div>
    <div class="col-3">
    <p class="temperature">${this._data.temperature}${setUnit}</p>
    </div>
    <div class="col-4">
    <img class="pop-icon" src="img/rain-icon.png">
    <p class="pop">${this._data.pop}%</p>
    </div>
    </div>`;
  }

}

var _default = new hourlyViewMarkup();

exports.default = _default;
},{"./View.js":"6da7298b7a1ae02dfd20dd548d976f5c","../config.js":"1898557d11834653c60b8de26f27be98","../helpers.js":"715c822c8e68ae99f2c71710e762106f"}],"834f3dec3963e9d023517963eb18d5ac":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View = _interopRequireDefault(require("./View.js"));

var config = _interopRequireWildcard(require("../config.js"));

var helpers = _interopRequireWildcard(require("../helpers.js"));

var _dailyViewMarkup = _interopRequireDefault(require("./dailyViewMarkup.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DailyView extends _View.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_parentElement", config.sevenWeatherDiv);
  }

  _generateMarkup() {
    const setUnit = config.unit === 'metric' ? '°C' : '°F';
    return this._data.daily.map(cur => `
    <div class="one-day">
    <div class="row row-1">
    <p class="date">${cur.date}</p>
    </div>
       
    <div class="row row-2">
    ${helpers.addCurrentImages(cur.id, this._data.current.time, this._data.current.sunrise, this._data.current.sunset)}
    </div>
         
    <div class="row row-3">
    <img class="pop-icon" src="img/rain-icon.png">
    <p class="pop">${cur.pop * 100}%</p>
    </div>
    
    <div class="row row-4">
    <p class="temperature">${cur.temperatureDay}/${cur.temperatureNight}${setUnit}</p>
    </div>
            
    <div class="row row-5">
    <p class="description">${cur.description}</p>
    </div>
    </div>`).join('');
  }

}

var _default = new DailyView();

exports.default = _default;
},{"./View.js":"6da7298b7a1ae02dfd20dd548d976f5c","../config.js":"1898557d11834653c60b8de26f27be98","../helpers.js":"715c822c8e68ae99f2c71710e762106f","./dailyViewMarkup.js":"3b2a5df15f17a53165e944ed87068f1c"}],"3b2a5df15f17a53165e944ed87068f1c":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View = _interopRequireDefault(require("./View.js"));

var config = _interopRequireWildcard(require("../config.js"));

var helpers = _interopRequireWildcard(require("../helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DailyViewMarkup extends _View.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_parentElement", '');
  }

  _generateMarkup() {
    const setUnit = config.unit === 'metric' ? '°C' : '°F';
    return `
    <div class="one-day">
    <div class="row row-1">
    <p class="date">${this._data.date}</p>
    </div>
       
    <div class="row row-2">
    ${helpers.addCurrentImages(this._data.id)}
    </div>
         
    <div class="row row-3">
    <img class="pop-icon" src="img/rain-icon.png">
    <p class="pop">${this._data.pop}%</p>
    </div>
    
    <div class="row row-4">
    <p class="temperature">${this._data.temperatureDay}/${this._data.temperatureNight}${setUnit}</p>
    </div>
            
    <div class="row row-5">
    <p class="description">${this._data.description}</p>
    </div>
    </div> `;
    /*   <div class="one-hour">
    <div class="col-1">
        <p class="hour">${this._data.time}:00</p>
    </div>
    <div class="col-2">
      </div>
    <div class="col-3">
    <p class="temperature">${this._data.temperature}${setUnit}</p>
    </div>
    <div class="col-4">
    <img class="pop-icon" src="img/rain-icon.png">
    <p class="pop">${this._data.pop}%</p>
    </div>
    </div>; */
  }

}

var _default = new DailyViewMarkup();

exports.default = _default;
},{"./View.js":"6da7298b7a1ae02dfd20dd548d976f5c","../config.js":"1898557d11834653c60b8de26f27be98","../helpers.js":"715c822c8e68ae99f2c71710e762106f"}],"52910ba17b818e097e907dc8726ad052":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var config = _interopRequireWildcard(require("../config.js"));

var helpers = _interopRequireWildcard(require("../helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class uiView {
  showUI() {
    config.weatherDiv.classList.remove('hidden');
    this.toggleLoader();
  }

  _hideUi() {
    config.mainCol1.classList.add('hidden');
    config.mainCol2.classList.add('hidden');
  }

  hideWelcome() {
    if (config.welcome.classList.contains('hidden')) return;else config.welcome.classList.add('hidden');
  }

  loaderMessage(message) {
    config.loadingMessage.textContent = '';
    config.loadingMessage.innerHTML = message; //this._hideUi();

    this.toggleLoader();
  }

  toggleLoader() {
    if (config.loadingDiv.classList.contains('hidden')) {
      config.overlay.style.display = 'block';
      config.loadingDiv.classList.remove('hidden');
    } else {
      config.overlay.style.display = 'none';
      config.loadingDiv.classList.add('hidden');
    }
  }

  addHandlerGeolocation(handler) {
    config.geolocationButton.addEventListener('click', handler);
  }

}

document.querySelector('.highlights-link').addEventListener('click', function () {
  document.querySelector('.seven-day').style.display = 'none';
  document.querySelector('.weather-highlights').style.display = 'flex';
  this.classList.add('active');
  document.querySelector('.week-link').classList.remove('active');
});
document.querySelector('.week-link').addEventListener('click', function () {
  document.querySelector('.weather-highlights').style.display = 'none';
  document.querySelector('.seven-day').style.display = 'flex';
  this.classList.add('active');
  document.querySelector('.highlights-link').classList.remove('active');
});

var _default = new uiView();

exports.default = _default;
},{"../config.js":"1898557d11834653c60b8de26f27be98","../helpers.js":"715c822c8e68ae99f2c71710e762106f"}],"2e2ad943c2fed0b46031c983314546e3":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View = _interopRequireDefault(require("./View.js"));

var config = _interopRequireWildcard(require("../config.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AlertView extends _View.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_parentElement", config.informationModal);

    _defineProperty(this, "_modal", config.informationModal);
  }

  _generateMarkup() {
    return `
    <div class="close_modal close_modal-alert"><i class="far fa-times-circle"></i></div>
    <div class="information-modal-title">
        <p>Weather alerts</p>
    </div>
    <div class="information-modal-content">
      <p class="event">${this._data.event}</p>
      <p class="description">${this._data.description}</p>
      <p class="sender">${this._data.sender_name}</p>
    </div>`;
  }

  showModal(data) {
    config.overlay.style.display = 'block'; // config.modal.style.display = 'block';

    this._parentElement.style.display = 'block';
    this.render(data);
  }

  closeModal() {
    config.overlay.style.display = 'none'; // config.modal.style.display = 'none';

    this._parentElement.display = 'none';

    this._clear();
  }

}

var _default = new AlertView();

exports.default = _default;
},{"./View.js":"6da7298b7a1ae02dfd20dd548d976f5c","../config.js":"1898557d11834653c60b8de26f27be98"}],"36c490ed82703d3a77dfe11e1df49cd0":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View = _interopRequireDefault(require("./View.js"));

var config = _interopRequireWildcard(require("../config.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SearchView extends _View.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_parentElement", config.searchResultsDiv);

    _defineProperty(this, "_modal", config.searchModal);
  }

  _generateMarkup() {
    return this._data.map(cur => this._markup(cur)).join('');
  }

  _markup(val) {
    return `<div class="city-search-result" data-lat="${val.lat}" data-lon="${val.lon}">
    <img style="width:30px;margin-right:10px;" src="https://www.countryflags.io/${val.country}/flat/32.png">
    <p>${val.name}, ${val.country}</p>
</div>`;
  }

  showModal() {
    config.overlay.style.display = 'block'; //config.modal.style.display = 'block';

    this._modal.style.display = 'block';
    config.searchGroup.style.display = 'block';
    config.inputSearch.focus();
  }

  closeModal() {
    config.overlay.style.display = 'none'; //config.modal.style.display = 'none';

    config.searchGroup.style.display = 'none';
    config.inputSearch.value = '';
    this._modal.style.display = 'none';

    this._clear();
  }

  hideInputField() {
    config.searchGroup.style.display = 'none';
  }

  message() {
    let markup = `<p>No cities matching your querry.</p><p>Please check for errors!</p>`;

    this._parentElement.insertAdjacentHTML('beforeend', markup);
  } //ENTER ON SEARCH, CLEAR ALL WEATHER INFO AND START SEARCH---------------------------------------------------


  addHandlerEnterInSearch(handler) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        let cityName = config.inputSearch.value;
        if (!cityName) return;
        handler(cityName);
      }
    });
  }

}

var _default = new SearchView();

exports.default = _default;
},{"./View.js":"6da7298b7a1ae02dfd20dd548d976f5c","../config.js":"1898557d11834653c60b8de26f27be98"}],"4273fa8e0c2f523027ebbb0a1fcdbe19":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View = _interopRequireDefault(require("./View.js"));

var config = _interopRequireWildcard(require("../config.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FavoritesView extends _View.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_parentElement", config.favoriteCitiesDiv);

    _defineProperty(this, "_modal", config.favoriteModal);
  }

  _generateMarkup() {
    if (this._data.length === 0) return '<h2>No favorites yet ☹</h2>';
    return `
    <h2>Favorite cities:</h2>
    ${this._data.map(cur => this._markup(cur)).join('')}
    `;
  }

  _markup(val) {
    return `<div class="favorite-city">
<img style="width:30px;margin-right:10px;" src="${val.flag}">
<p data-lat="${val.coordinates[0]}" data-lon="${val.coordinates[1]}"data-city="${val.name}" data-country="${val.country}">${val.name}, ${val.country}</p>
</div>`;
  }

  showModal(data) {
    config.overlay.style.display = 'block'; // config.modal.style.display = 'block';

    this._modal.style.display = 'block';
    this._parentElement.style.display = 'block';
    this.render(data);
  }

  closeModal() {
    config.overlay.style.display = 'none'; // config.modal.style.display = 'none';

    this._modal.style.display = 'none';
    this._parentElement.innerHTML = '';
    this._parentElement.style.display = 'none';

    this._clear();
  }

}

var _default = new FavoritesView();

exports.default = _default;
},{"./View.js":"6da7298b7a1ae02dfd20dd548d976f5c","../config.js":"1898557d11834653c60b8de26f27be98"}]},{},["c07b5c1c1597ed9ba5381d1c6e586dc8","17ecd430a77ab2e8d677328a39e1de5a"], null)

//# sourceMappingURL=control.32f27bcb.js.map
