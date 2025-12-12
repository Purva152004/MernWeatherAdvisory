// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';

const rootEl = document.getElementById('root');
const root = createRoot(rootEl);
root.render(<App />);
