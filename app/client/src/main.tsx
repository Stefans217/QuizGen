//REACT ROOT

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx' // main component
import './styles/main.css' // global styles

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
