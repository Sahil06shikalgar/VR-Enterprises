import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const StrictMode = React.StrictMode || React.default?.StrictMode || React.Fragment
const createRoot =
  ReactDOMClient.createRoot ||
  ReactDOMClient.default?.createRoot ||
  (typeof ReactDOMClient.default === 'function' ? ReactDOMClient.default : null)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
