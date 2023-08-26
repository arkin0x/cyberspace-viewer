import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConstructViewer as App } from './ConstructViewer.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
