
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PiggyBank } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta ao seu controle financeiro.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <PiggyBank className="h-12 w-12 text-finance-info" />
          </div>
          <CardTitle className="text-2xl">Entrar no FinançasPro</CardTitle>
          <CardDescription>
            Faça login para acessar seu controle financeiro.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm"
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                >
                  Esqueceu a senha?
                </Button>
              </div>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Button variant="link" className="p-0" onClick={navigateToRegister}>
                Registre-se
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
