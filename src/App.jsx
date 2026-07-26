import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { Dashboard } from './components/dashboard/Dashboard'
import { MealTracker } from './components/meals/MealTracker'
import { WaterTracker } from './components/water/WaterTracker'
import { WeightTracker } from './components/weight/WeightTracker'
import { WellbeingTracker } from './components/wellbeing/WellbeingTracker'
import { TDEECalculator } from './components/tdee/TDEECalculator'
import { QuizModule } from './components/quiz/QuizModule'
import { Blog } from './components/blog/Blog'
import { Diets } from './components/diets/Diets'
import { ProfileSettings } from './components/profile/ProfileSettings'
import { Recipes } from './components/recipes/Recipes'
import { Micronutrients } from './components/micronutrients/Micronutrients'
import { Reviews } from './components/reviews/Reviews'
import { About } from './components/about/About'
import { Navbar } from './components/layout/Navbar'
import { Sidebar } from './components/layout/Sidebar'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Ładowanie...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Ładowanie...</div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meals"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MealTracker />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/water"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WaterTracker />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/weight"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WeightTracker />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wellbeing"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WellbeingTracker />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tdee"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TDEECalculator />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <QuizModule />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/diets"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Diets />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Blog />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Recipes />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/micronutrients"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Micronutrients />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Reviews />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <About />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfileSettings />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App
