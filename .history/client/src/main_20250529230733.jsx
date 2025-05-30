import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppContextProvider } from './context/AppContext';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
// import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider>
     
        <App />
      </ClerkProvider>
  </AppContextProvider>
  </BrowserRouter>
)
