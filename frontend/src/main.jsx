import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SnackbarProvider } from 'notistack';
import './index.css'
import App from './App.jsx'
import "./i18n";

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>

)
