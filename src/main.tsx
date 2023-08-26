import React from 'react'
import ReactDOM from 'react-dom/client'
import ConstructViewer from './ConstructViewer.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConstructViewer/>
  </React.StrictMode>,
)
