import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {HelmetProvider } from 'react-helmet-async';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

