import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DemoApp } from './DemoApp'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element for the forms demo.')

createRoot(container).render(
  <StrictMode>
    <DemoApp />
  </StrictMode>,
)
