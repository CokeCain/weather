import * as config from '../config.js';
import * as helpers from '../helpers.js';

class uiView {
  showUI() {
    config.weatherDiv.classList.remove('hidden');
    this.toggleLoader();
  }
  _hideUi() {
    config.mainCol1.classList.add('hidden');
    config.mainCol2.classList.add('hidden');
  }

  hideWelcome() {
    if (config.welcome.classList.contains('hidden')) return;
    else config.welcome.classList.add('hidden');
  }

  loaderMessage(message) {
    config.loadingMessage.textContent = '';
    config.loadingMessage.innerHTML = message;
    //this._hideUi();
    this.toggleLoader();
  }

  toggleLoader() {
    if (config.loadingDiv.classList.contains('hidden')) {
      config.overlay.style.display = 'block';
      config.loadingDiv.classList.remove('hidden');
    } else {
      config.overlay.style.display = 'none';
      config.loadingDiv.classList.add('hidden');
    }
  }

  addHandlerGeolocation(handler) {
    config.geolocationButton.addEventListener('click', handler);
  }
}

document.querySelector('.highlights-link').addEventListener('click', function () {
  document.querySelector('.seven-day').style.display = 'none';
  document.querySelector('.weather-highlights').style.display = 'flex';
  this.classList.add('active');
  document.querySelector('.week-link').classList.remove('active');
});

document.querySelector('.week-link').addEventListener('click', function () {
  document.querySelector('.weather-highlights').style.display = 'none';
  document.querySelector('.seven-day').style.display = 'flex';
  this.classList.add('active');
  document.querySelector('.highlights-link').classList.remove('active');
});

export default new uiView();
