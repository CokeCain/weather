import View from './view.js';
import * as config from '../config.js';
import * as helpers from '../helpers.js';
import hourlyViewMarkup from './hourlyViewMarkup.js';

class HourlyView extends View {
  _parentElement = config.hourlyWeatherDiv;
  _hoursPerPage = 4;
  _totalHours = 48;
  _page = 1;

  _generateMarkup() {
    const setUnit = config.unit === 'metric' ? '°C' : '°F';

    return this._data.hourly
      .map(cur => {
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
      })
      .join('');
  }

  _generateMarkup2() {
    return this._data.hourly.map(cur => hourlyViewMarkup.render(cur, false)).join('');
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

export default new HourlyView();
