import View from './view.js';
import * as config from '../config.js';

class AlertView extends View {
  _parentElement = config.informationModal;
  _modal = config.informationModal;

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
    config.overlay.style.display = 'block';
    // config.modal.style.display = 'block';
    this._parentElement.style.display = 'block';
    this.render(data);
  }

  closeModal() {
    config.overlay.style.display = 'none';
    // config.modal.style.display = 'none';
    this._parentElement.display = 'none';
    this._clear();
  }
}

export default new AlertView();
