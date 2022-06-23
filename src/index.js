import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import Web3ContextProvider from "./services/web3";
import reportWebVitals from './reportWebVitals';

import './assets/css/font-awesome.min.css';
import './assets/css/bootstrap4.0.css';
import './assets/css/style.css';


ReactDOM.render(<Web3ContextProvider><App /></Web3ContextProvider>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

