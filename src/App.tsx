
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Simulados from "./pages/Simulados";
import Concursos from "./pages/Concursos";
import Apostilas from "./pages/Apostilas";
import Planos from "./pages/Planos";
import Acesso from "./pages/Acesso";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AssinanteDashboard from "./pages/assinante/AssinanteDashboard";
import VisitanteDashboard from "./pages/visitante/VisitanteDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/concursos" element={<Concursos />} />
            <Route path="/apostilas" element={<Apostilas />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/acesso" element={<Acesso />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["assinante", "admin"]}>
                <AssinanteDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/simulados" element={
              <ProtectedRoute allowedRoles={["assinante", "admin"]} redirectTo="/visitante">
                <Simulados />
              </ProtectedRoute>
            } />
            
            <Route path="/visitante" element={
              <ProtectedRoute allowedRoles={["visitante", "assinante", "admin"]}>
                <VisitanteDashboard />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
