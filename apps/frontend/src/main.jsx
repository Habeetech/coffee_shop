import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { greet } from "../../../packages/utils/index.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {console.log(greet("Frontend"))}
  </StrictMode>,
)



