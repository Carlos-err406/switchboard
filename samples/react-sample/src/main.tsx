import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SwitchboardProvider } from '@switchboard/react'
import App from './App.tsx'
import './index.css'

const API_KEY = import.meta.env.VITE_SB_API_KEY
const HOST = import.meta.env.VITE_SB_HOST ?? 'http://127.0.0.1:3210'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SwitchboardProvider apiKey={API_KEY} switchboardHost={HOST}>
      <App />
    </SwitchboardProvider>
  </StrictMode>,
)
