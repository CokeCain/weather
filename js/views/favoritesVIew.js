import View from './view.js';
import * as config from '../config.js';

class FavoritesView extends View {
  _parentElement = config.favoriteCitiesDiv;
  _modal = config.favoriteModal;

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
    config.overlay.style.display = 'block';
    // config.modal.style.display = 'block';
    this._modal.style.display = 'block';
    this._parentElement.style.display = 'block';
    this.render(data);
  }

  closeModal() {
    config.overlay.style.display = 'none';
    // config.modal.style.display = 'none';
    this._modal.style.display = 'none';
    this._parentElement.innerHTML = '';
    this._parentElement.style.display = 'none';
    this._clear();
  }
}

export default new FavoritesView();
