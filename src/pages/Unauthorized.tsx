
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const { userProfile } = useAuth();

  const getRedirectPath = () => {
    switch (userProfile?.role) {
      case 'admin':
        return '/admin';
      case 'assinante':
        return '/dashboard';
      case 'visitante':
        return '/visitante';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <ShieldX className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>

        <div className="space-y-3">
          <Link to={getRedirectPath()}>
            <Button className="w-full bg-primary-600 hover:bg-primary-700">
              <Home className="h-4 w-4 mr-2" />
              Ir para Minha Área
            </Button>
          </Link>
          
          <Button variant="outline" onClick={() => window.history.back()} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
