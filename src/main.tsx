import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics.ts'
import { inject } from '@vercel/analytics'
import './index.css'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

if (!window.location.hash) {
  window.scrollTo(0, 0)
}

initAnalytics()
inject()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
