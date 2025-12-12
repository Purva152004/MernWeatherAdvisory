// routes/weather.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Search = require('../models/Search');

// Helper: convert m/s to km/h
function mpsToKmh(ms) {
  return ms * 3.6;
}

// Advisory generator — simple rule-based system (at least 5 rules)
function generateAdvisories(current, forecastNext6h) {
  // current: { temp, humidity, wind_kmh, pop } (pop optional)
  const adv = [];

  // Rule 1: Rain probability > 60%
  if (current.pop !== undefined && current.pop > 60) {
    adv.push('High rain probability (>60%) — avoid irrigation and pesticide spraying today.');
  }

  // Rule 2: High temperature
  if (current.temp >= 35) {
    adv.push('High temperature (>35°C) — increase irrigation frequency for heat-sensitive crops.');
  } else if (current.temp >= 30) {
    adv.push('Warm conditions (30–35°C) — monitor soil moisture; adjust irrigation if needed.');
  }

  // Rule 3: Wind speed
  if (current.wind_kmh > 15) {
    adv.push('High wind (>15 km/h) — do NOT spray pesticides due to drift risk.');
  } else if (current.wind_kmh < 10 && (!current.pop || current.pop < 20) ) {
    adv.push('Good spraying window: wind <10 km/h and low short-term rain risk.');
  }

  // Rule 4: High humidity
  if (current.humidity >= 80) {
    adv.push('High humidity (>80%) — possible fungal infection risk; monitor and consider prophylactic measures.');
  }

  // Rule 5: No rain expected in next 6 hours (from forecastNext6h)
  const rainIn6h = forecastNext6h.some(item => (item.pop || 0) > 30 || (item.rain && item.rain['3h'] > 0));
  if (!rainIn6h) {
    adv.push('No rain expected in next 6 hours — safe to irrigate if needed.');
  } else {
    adv.push('Rain expected within next 6 hours — postpone irrigation if possible.');
  }

  // Rule 6: low temp
  if (current.temp <= 5) {
    adv.push('Low temperature (≤5°C) — risk of cold damage for sensitive crops.');
  }

  return adv;
}

// GET /api/weather?q=cityname
router.get('/', async function (req, res) {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Missing query parameter q (location)' });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Server misconfigured: missing OpenWeatherMap API key' });

    // 1) Geocoding: get lat/lon from OpenWeatherMap (direct geocoding)
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${apiKey}`;
    const geoResp = await axios.get(geoUrl);
    if (!geoResp.data || geoResp.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    const { lat, lon, name, country } = geoResp.data[0];

    // 2) One Call API (current + hourly + daily). Use 3-hour blocks forecast via 5-day/3-hour endpoint for convenience
    // Current weather: use the "weather" endpoint (or One Call if using paid). We'll call the 5-day/3-hour forecast plus current.
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const currUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const [forecastResp, currResp] = await Promise.all([axios.get(forecastUrl), axios.get(currUrl)]);
    const forecast = forecastResp.data; // list - 3-hour blocks for 5 days
    const current = currResp.data; // current observations

    // Extract metrics
    const currentMetric = {
      temp: current.main.temp,
      humidity: current.main.humidity,
      wind_kmh: Math.round(mpsToKmh(current.wind.speed)),
      description: current.weather && current.weather[0] && current.weather[0].description,
      // pop is not provided by current; approximate: check forecast first item
      pop: forecast.list && forecast.list.length ? Math.round((forecast.list[0].pop || 0) * 100) : undefined
    };

    // Take next 6 hours forecast items (two 3-hour blocks)
    const nowUnix = Math.floor(Date.now() / 1000);
    const forecastNext6h = [];
    for (let i = 0; i < forecast.list.length && forecastNext6h.length < 2; i++) {
      const item = forecast.list[i];
      if (item.dt >= nowUnix) {
        forecastNext6h.push({
          dt: item.dt,
          temp: item.main.temp,
          pop: Math.round((item.pop || 0) * 100),
          wind_kmh: Math.round(mpsToKmh(item.wind.speed)),
          rain: item.rain || null
        });
      }
    }

    const advisories = generateAdvisories({
      temp: currentMetric.temp,
      humidity: currentMetric.humidity,
      wind_kmh: currentMetric.wind_kmh,
      pop: currentMetric.pop
    }, forecastNext6h);

    // Save to MongoDB (keep only last 5 entries) — OPTIONAL (if MONGO_URI set)
    if (process.env.MONGO_URI) {
      try {
        const search = new Search({
          location: `${name}, ${country}`,
          result: {
            current: currentMetric,
            advisories,
            timestamp: Date.now()
          }
        });
        await search.save();

        // keep last 5
        const count = await Search.countDocuments();
        if (count > 5) {
          const excess = await Search.find().sort({ createdAt: 1 }).limit(count - 5);
          for (const doc of excess) {
            await Search.deleteOne({ _id: doc._id });
          }
        }
      } catch (e) {
        // non-fatal - just log
        console.error('Mongo save error:', e.message);
      }
    }

    // Respond
    return res.json({
      location: { name, country, lat, lon },
      current: currentMetric,
      forecastNext6h,
      advisories,
      forecastList: forecast.list.slice(0, 16) // first 16 blocks ~ 2 days of 3-hour blocks (optional)
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
