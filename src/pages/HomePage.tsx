import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mail } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Chat Bolt
            </h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Olá, {user?.username}!
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
              {user?.role && (
                <p className="text-sm text-gray-500">
                  Função: {user.role}
                </p>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bem-vindo ao Chat Bolt
            </h3>
            <p className="text-gray-600 mb-4">
              Você está logado com sucesso! Esta é sua área protegida.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🔒 Autenticação Segura</h4>
                <p className="text-sm text-blue-700">
                  Sistema de autenticação com cookies HTTP-only para máxima segurança.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">⚡ React Query</h4>
                <p className="text-sm text-green-700">
                  Cache inteligente e sincronização automática de dados.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">🎨 UI Moderna</h4>
                <p className="text-sm text-purple-700">
                  Interface responsiva e acessível com Tailwind CSS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 