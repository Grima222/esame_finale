import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // tue regole CSS
import App from './App';
import "animate.css";


// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// React Toastify
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
