import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/App.css'
import AddApp from './AppAdd.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AddApp />
  </StrictMode>,
)
