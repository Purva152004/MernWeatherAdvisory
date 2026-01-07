Weather Farm — Backend

Node.js + Express backend for the Weather Forecast & Advisory Tool (MERN).
This service fetches live weather data from OpenWeatherMap, generates farmer-friendly advisories, and stores the last 5 searched locations in MongoDB.

Prerequisites

Node.js (v16+ recommended)

npm (comes with Node.js)

MongoDB running locally or a MongoDB Atlas URI

OpenWeatherMap API Key (free tier)
https://openweathermap.org

Setup
1. Install dependencies
cd backend
npm install
npm install axios chart.js react-chartjs-2 cors dotenv express mongoose path

2. Environment variables

Create a .env file in the backend directory and add the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweathermap_api_key

3. Run the backend server
npm start


The backend will run on:

http://localhost:5000


Weather Farm — Frontend

React (Vite) frontend for the Weather Forecast & Advisory Tool (MERN).
This interface displays real-time weather data, short-term forecasts, interactive charts, and farmer-friendly advisories, with support for downloading advisory reports as PDF.

Prerequisites

Node.js (v16+ recommended)

npm (comes with Node.js)

Backend running on
http://localhost:5000

Setup
1. Install dependencies
cd frontend
npm install
npm install axios chart.js react-chartjs-2 html2canvas jspdf

2. Run the frontend application
npm run dev


The frontend will run on:

http://localhost:5173

Stores the last 5 searched locations in MongoDB

Provides REST APIs for the frontend
