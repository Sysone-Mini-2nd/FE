import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from './Router.jsx'
import { AuthProvider } from './contexts/AuthContext.js'

createRoot(document.getElementById('root')).render(

    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>

)
