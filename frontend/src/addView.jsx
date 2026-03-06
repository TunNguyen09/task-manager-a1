import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AddApp from './AppAdd.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AddApp />
  </StrictMode>,
)
