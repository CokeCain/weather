import View from './View.js';
import * as config from '../config.js';
import * as helpers from '../helpers.js';

class hourlyViewMarkup extends View {
  _parentElement = '';

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

export default new hourlyViewMarkup();
