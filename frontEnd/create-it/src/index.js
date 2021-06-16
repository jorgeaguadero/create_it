import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ErrorBoundary from './ErrorBoundary';

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
