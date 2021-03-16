import View from './view.js';
import hourlyView from './hourlyView.js';
import * as config from '../config.js';
import * as helpers from '../helpers.js';

class HighlightsView extends View {
  _parentElement = config.weatherHighlights;
  _bookmarked;

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

export default new HighlightsView();
