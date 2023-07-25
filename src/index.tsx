import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoadComponents from './LoadComponents';
import Sentry from './components/error/Sentry';

Sentry.init();

const appRoot = document.getElementById('mgg-root');
if (appRoot) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    appRoot
  );
}

LoadComponents.loadAll();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
