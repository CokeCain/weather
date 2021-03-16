import View from './View.js';
import * as config from '../config.js';
import * as helpers from '../helpers.js';

class DailyView extends View {
  _parentElement = config.sevenWeatherDiv;

  _generateMarkup() {
    const setUnit = config.unit === 'metric' ? '°C' : '°F';

    return this._data.daily
      .map(
        cur => `
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
    </div>`
      )
      .join('');
  }
}

export default new DailyView();
