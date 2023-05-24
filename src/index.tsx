import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';


const appRoot = document.getElementById('mgg-root');
if (appRoot) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    appRoot
  );
}

const roots = document.querySelectorAll('.mgg-app.test') || [];
for (let i = 0; i < roots.length; i++) {
  ReactDOM.render(
    // @ts-ignore
    <React.StrictMode><h3>test</h3></React.StrictMode>,
    roots[i]
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
