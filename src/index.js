import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import './assets/styles/css/root/index.css';
import App from './App'

/*
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyB9MFJV3QtzXnn38X8whz5N0UJQliDBGgg",
    authDomain: "messenger-365ce.firebaseapp.com",
    projectId: "messenger-365ce",
    storageBucket: "messenger-365ce.appspot.com",
    messagingSenderId: "376109866114",
    appId: "1:376109866114:web:493d844fd192c1949e289b",
    measurementId: "G-N9CG2FRYDE"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

*/


// Initialize App

const root = ReactDOM.createRoot(document.getElementById('root'));

export const Context = createContext({})
const variables = {
    API_URL: process.env.REACT_APP_PRODUCTION === 'true' ? process.env.REACT_APP_API_KEY : ''
}

root.render(
    <BrowserRouter>
        <Context.Provider value={variables}>
            <App />
        </Context.Provider>
    </BrowserRouter>
);