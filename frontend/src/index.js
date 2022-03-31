import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {HelmetProvider } from 'react-helmet-async';
import App from './App';
import StoreProvider from './Store';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

