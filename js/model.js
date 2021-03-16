import * as config from './config.js';
import * as helpers from './helpers.js';

export const state = {
  location: {},
  weather: {
    current: [],
    hourly: [],
    daily: [],
  },
  favorite_cities: [],
  favorite_codes: [],
};

class Location {
  constructor(name, country, flag, coordinates, code) {
    this.name = name;
    this.country = country;
    this.flag = flag;
    this.coordinates = coordinates;
    this.code = code;
  }
}

export const getCityCountryFlag = async function (latitude, longitude) {
  try {
    const data = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const json = await data.json();
    const city = json.city === '' ? json.locality : json.city;
    const { countryName, countryCode } = json;
    const flag = await getCountryFlag(countryName);
    state.location = new Location(city, countryName, flag, [latitude, longitude], city.toUpperCase() + countryCode);
  } catch (err) {
    console.log(err);
  }
};

async function getCountryFlag(country) {
  try {
    const countryData = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
    let json = await countryData.json();
    return json[0].flag;
  } catch (err) {
    console.log(err);
  }
}

export async function getWeatherData(latitude, longitude) {
  try {
    const json = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${config.unit}&exclude={part}&appid=${config.appid}`
    );
    let weather = await json.json();
    let aqi = await getAirQualityIndex(latitude, longitude);
    populateWeatherState(weather, aqi);
  } catch (err) {
    console.log(err);
  }
}

async function getAirQualityIndex(lat, lon) {
  try {
    const data = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${config.appid}`);
    let json = await data.json();
    return json.list[0].main.aqi;
  } catch (err) {
    console.log(err);
  }
}

const createCurrentWeatherObject = function (data, index) {
  let [hr, min, day, month] = helpers.getTime(data.current.dt);
  return {
    time: `${hr}:${min}, ${day}. ${month}`,
    icon: data.current.weather[0].icon,
    sunrise: `${helpers.getTime(data.current.sunrise)[0]}:${helpers.getTime(data.current.sunrise)[1]}`,
    sunset: `${helpers.getTime(data.current.sunset)[0]}:${helpers.getTime(data.current.sunset)[1]}`,
    uvi: data.current.uvi,
    visibility: data.current.visibility,
    temperature: Math.floor(data.current.temp),
    feels: data.current.feels_like,
    description: data.current.weather[0].description,
    id: data.current.weather[0].id,
    windDegrees: data.current.wind_deg,
    windDirection: helpers.windDirectionName(data.current.wind_deg),
    windSpeed: data.current.wind_speed,
    humidity: data.current.humidity,
    aqi: index,
    //alert: alerts,
    ...(data.alerts && { alert: data.alerts }),
  };
};

const createHourlyWeatherObject = function (data) {
  let date = new Date(data.dt * 1000);
  let time = date.getHours();
  return {
    time: time,
    icon: data.weather[0].icon,
    id: data.weather[0].id,
    temperature: Math.trunc(data.temp),
    pop: data.pop,
  };
};

const createDailyWeatherObject = function (data) {
  let date = new Date(data.dt * 1000);
  let days = date.getDay();

  const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return {
    date: day[days],
    icon: data.weather[0].icon,
    id: data.weather[0].id,
    temperatureDay: Math.trunc(data.temp.day),
    temperatureNight: Math.trunc(data.temp.night),
    description: helpers.capitalizeFirstLetter(data.weather[0].description),
    windDegrees: data.wind_deg,
    windSpeed: data.wind_speed,
    pop: data.pop,
  };
};

function populateWeatherState(data, aqi) {
  state.weather.current = createCurrentWeatherObject(data, aqi);
  data.daily.map((cur, i) => (state.weather.daily[i] = createDailyWeatherObject(cur)));
  data.hourly.map((cur, i) => (state.weather.hourly[i] = createHourlyWeatherObject(cur)));
}
