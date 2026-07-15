import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Real device (Capacitor shell) or phone-sized viewport: every screen's
// drawn iPhone mockup chrome is neutralized via CSS (see index.css) so the
// app renders full-bleed. Desktop keeps the mockup frame for design review.
const isDevice = !!window.Capacitor?.isNativePlatform?.()
  || window.matchMedia('(max-width: 520px)').matches
if (isDevice) document.documentElement.classList.add('fylos-device')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

