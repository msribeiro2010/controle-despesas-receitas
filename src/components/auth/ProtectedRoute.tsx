
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  
  // Mostra um loading enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
        <span className="ml-2">Verificando autenticação...</span>
      </div>
    );
  }
  
  // Redireciona para login se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Renderiza o conteúdo se estiver autenticado
  return <>{children}</>;
};

export default ProtectedRoute;
