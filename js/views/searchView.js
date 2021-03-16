import View from './view.js';
import * as config from '../config.js';

class SearchView extends View {
  _parentElement = config.searchResultsDiv;
  _modal = config.searchModal;

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
    config.overlay.style.display = 'block';
    //config.modal.style.display = 'block';
    this._modal.style.display = 'block';
    config.searchGroup.style.display = 'block';
    config.inputSearch.focus();
  }

  closeModal() {
    config.overlay.style.display = 'none';
    //config.modal.style.display = 'none';
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
  }

  //ENTER ON SEARCH, CLEAR ALL WEATHER INFO AND START SEARCH---------------------------------------------------
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

export default new SearchView();
