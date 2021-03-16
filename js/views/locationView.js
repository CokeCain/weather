import View from './view.js';
import * as config from '../config.js';

class LocationView extends View {
  _parentElement = config.locationDiv;
  _bookmarked;

  _generateMarkup() {
    return `<img src="${this._data.flag}">
    <p class="locations">${this._data.name}, ${this._data.country}</p>
    <i class="favorite ${this._bookmarked === true ? 'fas' : 'far'} fa-heart"></i>`;
  }
}

export default new LocationView();
