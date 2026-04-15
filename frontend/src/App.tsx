import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { VectorAuthProvider, AuthCallback } from '@govector/auth'
import { Toaster } from '@vector-ui'
import { LandingPage } from '@/pages/LandingPage'
import DashboardPage from '@/pages/DashboardPage'

const authConfig = {
  authProxyUrl: import.meta.env.VITE_AUTH_PROXY_URL,
  appId: import.meta.env.VITE_APP_ID,
  appVersionId: import.meta.env.VITE_APP_VERSION_ID,
}

function AuthCallbackPage() {
  const navigate = useNavigate()
  return <AuthCallback onSuccess={() => navigate('/dashboard', { replace: true })} />
}

function App() {
  return (
    <VectorAuthProvider config={authConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </VectorAuthProvider>
  )
}

export default App
