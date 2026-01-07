# Weather Farm — Weather Forecast & Advisory Tool (MERN)

Weather Farm is a MERN-based Weather Forecast & Advisory Tool.
It provides real-time weather data, short-term forecasts, visual charts, and farmer-friendly advisories, with a Download PDF feature for easy sharing.

# Weather Farm — Frontend

React (Vite) frontend for the Weather Forecast & Advisory Tool.
Displays current weather, 5-day/3-hour forecast, charts, and farmer-friendly advisories.
Includes a "Download PDF" feature for advisories.

---

## Prerequisites

- Node.js (v16+ recommended)
- npm
- Backend running (default: http://localhost:5000)

---
## Setup

1. Install dependencies
```bash
npm create vite@latest frontend
cd frontend
npm install
npm i axios chart.js react-chartjs-2 html2canvas jspdf
```
# Weather Farm — Backend

Node.js + Express backend for the Weather Forecast & Advisory Tool (MERN).
This service fetches weather data from OpenWeatherMap, generates farmer advisories,
and stores the last 5 searched locations in MongoDB.

---

## Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node)
- MongoDB running locally or a MongoDB Atlas URI
- OpenWeatherMap API Key (free tier) — https://openweathermap.org
---
## Setup
1. Install dependencies
```bash
cd backend
npm install
npm i axios chart.js react-chartjs-2 cors dotevn express mongoose path