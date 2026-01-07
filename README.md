🌦️ Weather Farm
Weather Forecast & Advisory Tool (MERN Stack)

Weather Farm is a farmer-friendly weather forecasting and advisory system developed as an assignment project using the MERN stack.

The application delivers real-time weather data, short-term forecasts, visual insights, and actionable advisories, along with a PDF download feature for easy sharing and offline use.

This project highlights API integration, data visualization, backend architecture, and user-centric design.

📁 Project Structure
Weather-Farm/
├── frontend/   # React (Vite) frontend
└── backend/    # Node.js + Express backend

🌱 Frontend — React (Vite)
Overview

The frontend is built with React + Vite for fast builds and optimized performance.
It focuses on clarity, simplicity, and usability for farmers.

Key Features

Current weather information

5-day / 3-hour weather forecast

Interactive charts (temperature, humidity, etc.)

Farmer-friendly weather advisories

Download advisory report as PDF

Tech Stack

React (Vite)

Axios

Chart.js & react-chartjs-2

html2canvas

jsPDF

Prerequisites

Node.js v16+

npm

Backend running on http://localhost:5000

Setup & Run
npm create vite@latest frontend
cd frontend
npm install
npm install axios chart.js react-chartjs-2 html2canvas jspdf
npm run dev


Frontend URL:

http://localhost:5173

🌾 Backend — Node.js & Express
Overview

The backend handles data fetching, advisory generation, and persistence.

Responsibilities

Fetches live weather data from OpenWeatherMap API

Generates farmer-specific weather advisories

Stores last 5 searched locations in MongoDB

Serves REST APIs to the frontend

Tech Stack

Node.js

Express.js

MongoDB & Mongoose

Axios

CORS

dotenv

Prerequisites

Node.js v16+

npm

MongoDB (Local or Atlas)

OpenWeatherMap API Key
https://openweathermap.org

Setup & Run
cd backend
npm install
npm install axios cors dotenv express mongoose path

Environment Variables (.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweathermap_api_key

npm start


Backend URL:

http://localhost:5000

🔄 Application Flow

User searches for a location in the frontend

Frontend sends request to backend

Backend fetches weather data from OpenWeatherMap

Advisory is generated and stored in MongoDB

Data is returned to frontend and can be exported as PDF
