import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppContextProvider from './context/AppContext.jsx';
import App from './App.jsx'
import
createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
)
