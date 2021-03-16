import View from './view.js';
import * as config from '../config.js';
import * as helpers from '../helpers.js';

class CurrentView extends View {
  _parentElement = config.currentWeatherDiv;

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
      <div class="weather-images">${helpers.addCurrentImages(
        this._data.weather.current.id,
        this._data.weather.current.time,
        this._data.weather.current.sunrise,
        this._data.weather.current.sunset
      )}</div>
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
    if (this._data.weather.current.alert === undefined) return `No alerts!`;
    else return `${this._data.weather.current.alert[0].event}`;
  }
}

export default new CurrentView();
