import View from './View.js';
import * as config from '../config.js';
import * as helpers from '../helpers.js';

class DailyViewMarkup extends View {
  _parentElement = '';

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

export default new DailyViewMarkup();
