
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-2xl font-medium">Página não encontrada</p>
        <p className="text-muted-foreground">
          Oops! A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild size="lg">
          <Link to="/">Voltar para o Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
