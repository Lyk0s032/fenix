import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './components/store/store.js';
import axios from 'axios';
import dayjs from 'dayjs';

axios.defaults.baseURL = 'https://comercialapi-production.up.railway.app/';
// axios.defaults.baseURL = 'http://192.168.1.15:3000/';
 
createRoot(document.getElementById('root')).render( 
  <Provider store={store}>
      <StrictMode> 
      <App />
    </StrictMode>
  </Provider>,  
)
