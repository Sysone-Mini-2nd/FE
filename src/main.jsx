import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import router from './Router.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'

// QueryClient 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 3 * 60 * 1000,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
