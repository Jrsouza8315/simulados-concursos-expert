import React from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";

import Simulados from "./pages/Simulados";
import Concursos from "./pages/Concursos";
import Apostilas from "./pages/Apostilas";
import Planos from "./pages/Planos";
import Acesso from "./pages/Acesso";
import EsqueceuSenha from "./pages/EsqueceuSenha";
import { AdminPage } from "./pages/admin";
import VisitanteDashboard from "./pages/visitante/VisitanteDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ResetSenha from "./pages/ResetSenha";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Função para verificar se devemos redirecionar para reset de senha
  const shouldRedirectToReset = () => {
    const hash = window.location.hash;
    return hash.includes("access_token=") || hash.includes("error_code=");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Router>
              <Routes>
                {/* Rota admin fora do MainLayout */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute
                      requiredRole="admin"
                      redirectTo="/unauthorized"
                    >
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />

                {/* Todas as outras rotas dentro do MainLayout */}
                <Route
                  element={
                    <MainLayout>
                      <Outlet />
                    </MainLayout>
                  }
                >
                  {/* Rota raiz com redirecionamento condicional */}
                  <Route
                    path="/"
                    element={
                      shouldRedirectToReset() ? (
                        <Navigate to="/reset-password" replace />
                      ) : (
                        <Home />
                      )
                    }
                  />

                  <Route path="/concursos" element={<Concursos />} />
                  <Route path="/apostilas" element={<Apostilas />} />
                  <Route path="/planos" element={<Planos />} />
                  <Route path="/acesso" element={<Acesso />} />
                  <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
                  <Route path="/reset-password" element={<ResetSenha />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/simulados" element={<Simulados />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["assinante", "admin"]}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/visitante"
                    element={
                      <ProtectedRoute
                        allowedRoles={["visitante", "assinante", "admin"]}
                      >
                        <VisitanteDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Rota 404 */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
