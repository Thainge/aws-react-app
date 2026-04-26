import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Navigate, Route, Routes } from 'react-router-dom'

import ItemsPage from './pages/items'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import AppLayout from './components/AppLayout'
import RequireAuth from './auth/RequireAuth'

export default function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/items"
            element={
              <RequireAuth>
                <ItemsPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
