import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppAbout from './AppAbout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppAbout />
  </StrictMode>,
)
