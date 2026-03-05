import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AddTask from './Component/AddTask.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AddTask />
  </StrictMode>,
)
