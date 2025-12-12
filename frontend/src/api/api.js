// src/api/api.js
import axios from 'axios';

export function getWeather(location) {
  return axios.get(`http://localhost:5000/api/weather?q=${encodeURIComponent(location)}`);
}
