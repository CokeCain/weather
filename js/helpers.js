import * as model from './model.js';

export const addZero = num => (num < 10 ? '0' + num : +num);

export const windDirectionName = function (val) {
  let value = parseFloat(val);
  if (value <= 11.25) return 'N';
  value -= 11.25;
  let allDirections = ['NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
  let dIndex = parseInt(value / 22.5);
  return allDirections[dIndex] ? allDirections[dIndex] : 'N';
};

export const capitalizeFirstLetter = string => string[0].charAt(0).toUpperCase() + string.slice(1);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const getTime = function (ms) {
  let date = new Date(ms * 1000);
  let hr = addZero(date.getHours());
  let min = addZero(date.getMinutes());
  let day = date.getDate();
  let month = months[date.getMonth()];
  return [hr, min, day, month];
};

export const checkIfFavorited = function () {
  if (model.state.favorite_codes.includes(model.state.location.code)) return `fas`;
  else return `far`;
};

export function statusMessage() {
  console.log('made it');
}

export function addCurrentImages(id, time, sunrise, sunset) {
  let curTime = time.split(':');
  let sunriseTime = sunrise.split(':');
  let sunsetTime = sunset.split(':');
  if (id >= 200 && id <= 232) return `<div class="thundery"><div class="thundery__cloud"></div><div class="thundery__rain"></div></div>`;
  if (id >= 300 && id <= 321) return `<div class="shower__rain"><div class="rainy__cloud"></div><div class="rainy__rain"></div></div>`;
  if (id >= 500 && id <= 504)
    if (curTime[0] > sunriseTime[0] && curTime[0] < sunsetTime[0])
      return `<div class="rainy"><div class="rainy__cloud"></div><div class="rainy__rain"></div><div class="smaller__sun"></div></div>`;
    else return `<div class="rainy"><div class="rainy__cloud"></div><div class="rainy__rain"></div><div class="smaller__moon"></div></div>`;
  if (id >= 511 && id <= 531) return `<div class="shower__rain"><div class="rainy__cloud"></div><div class="rainy__rain"></div></div>`;
  if (id >= 600 && id <= 622) return `<div class="snowy"><div class="rainy__cloud"></div><div class="snow"></div></div>`;
  if (id === 800) {
    if (curTime[0] > sunriseTime[0] && curTime[0] < sunsetTime[0]) return `<div class="sunny"></div>`;
    else return `<div class="moony"></div>`;
  }
  if (id === 801) {
    if (curTime[0] > sunriseTime[0] && curTime[0] < sunsetTime[0])
      return `<div class="partly_cloudy"><div class="partly_cloudy__sun"></div><div class="partly_cloudy__cloud"></div></div>`;
    else return `<div class="partly_cloudy"><div class="partly_cloudy__moon"></div><div class="partly_cloudy__cloud"></div></div>`;
  }

  if (id === 802) return `<div class="cloudy"></div>`;
  if (id >= 803 && id <= 804) return `<div class="more__cloudy"></div>`;
  if (id >= 701 && id <= 781)
    return `<div class="mist">
  <div class="mist-line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="mist-line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="mist-line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="mist-line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>`;
}

export const summarizeVisibility = function (val) {
  if (val >= 0 && val <= 2999) return `Bad 😑`;
  if (val >= 3000 && val <= 5999) return `Average 🤔`;
  if (val >= 6000) return `Great! 😍`;
};
export const summarizeAqi = function (val) {
  //Air Quality Index. Possible values: 1, 2, 3, 4, 5.
  //Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
  if (val === 1) return `Good 😍`;
  if (val === 2) return `Fair 😄`;
  if (val === 3) return `Moderate 😏`;
  if (val === 4) return `Poor 😵`;
  if (val === 5) return `Very poor 💀`;
};

export const animateUVIGraph = function (val) {
  var bar = new ProgressBar.SemiCircle('#uvi-graph', {
    strokeWidth: 12,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 5,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: null,
    text: {
      value: '',
      alignToBottom: false,
    },
    from: { color: '#FFEA82' },
    to: { color: '#ED6A5A' },
    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = Math.round(bar.value() * 100);
      if (value === 0) {
        bar.setText('');
      } else {
        bar.setText((val * 10).toFixed(2));
      }

      bar.text.style.color = state.color;
      bar.text.style.fontSize = '3rem';
    },
  });

  bar.animate(val); // Number from 0.0 to 1.0
};

export const animateHumidityBar = function (val) {
  var bar = new ProgressBar.Line('#humidity-bar', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#3c63af',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: { width: '100%', height: '100%' },
    text: {
      style: {
        // Text color.
        // Default: same as stroke color (options.color)
        color: '#000000',
        position: 'relative',
        right: '0',
        top: '-80px',
        padding: 0,
        transform: null,
        fontSize: '35px',
      },
      autoStyleContainer: false,
    },
    from: { color: '#FFEA82' },
    to: { color: '#ED6A5A' },
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100) + ' %');
      bar.setText(`${Math.round(bar.value() * 100)} <span style="font-size:18px;margin-top:-8px;position:absolute;">%</span>`);
    },
  });

  bar.animate(val); // Number from 0.0 to 1.0
};
