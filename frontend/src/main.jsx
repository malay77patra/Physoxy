import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/providers/AuthProvider'
import { ApiProvider } from '@/providers/ApiProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import '@/styles/main.css'
import App from '@/App.jsx'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ApiProvider>
            <App />
            <Toaster position="bottom-center" />
          </ApiProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
