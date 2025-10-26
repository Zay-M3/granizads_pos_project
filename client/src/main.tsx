import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router/App.tsx'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)