import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';
import { FullPageSpinner } from '@/components/Loading';

// Lazy-loaded pages for code splitting
const Landing = lazy(() => import('@/pages/Landing'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const LoanEligibility = lazy(() => import('@/pages/LoanEligibility'));
const CreditAnalyzer = lazy(() => import('@/pages/CreditAnalyzer'));
const EMICalculator = lazy(() => import('@/pages/EMICalculator'));
const FinancialAdvisor = lazy(() => import('@/pages/FinancialAdvisor'));
const History = lazy(() => import('@/pages/History'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Suspense fallback={<FullPageSpinner />}>
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/loan-eligibility"
              element={<ProtectedRoute><LoanEligibility /></ProtectedRoute>}
            />
            <Route
              path="/credit-analyzer"
              element={<ProtectedRoute><CreditAnalyzer /></ProtectedRoute>}
            />
            <Route
              path="/emi-calculator"
              element={<ProtectedRoute><EMICalculator /></ProtectedRoute>}
            />
            <Route
              path="/financial-advisor"
              element={<ProtectedRoute><FinancialAdvisor /></ProtectedRoute>}
            />
            <Route
              path="/history"
              element={<ProtectedRoute><History /></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><Settings /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="relative min-h-screen flex flex-col">
            <AnimatedBackground />
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <Navbar />
            <main className="flex-1 pt-16" id="main-content">
              <AnimatedRoutes />
            </main>
            <Footer />
            <Toaster richColors position="top-right" />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
