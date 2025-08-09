import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Shell } from '@/layouts/Shell'
import Overview from "./pages/Overview"
import Transactions from "./pages/Transactions"
import Reports from "./pages/Reports"
import Analytics from "./pages/Analytics"
import Auth from "./pages/Auth"
import NotFound from "./pages/NotFound"
import { useAuth } from "@/hooks/useAuth"

const queryClient = new QueryClient()

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
        <Route element={user ? <Shell /> : <Navigate to="/auth" />}>
          <Route path="/" element={<Overview />} />
          <Route path="/transactions" element={<Transactions />} />
          {/* Removed Goals, Investments, Debt routes */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
)

export default App