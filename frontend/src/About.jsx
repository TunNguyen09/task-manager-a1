import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Desc from './Component/Description.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Desc />
  </StrictMode>,
)
