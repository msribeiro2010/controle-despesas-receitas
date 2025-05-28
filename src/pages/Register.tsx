
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PiggyBank } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registro bem-sucedido",
        description: "Verifique seu email para confirmar sua conta.",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erro ao registrar",
        description: error.message || "Ocorreu um erro durante o registro.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <PiggyBank className="h-12 w-12 text-finance-info" />
          </div>
          <CardTitle className="text-2xl">Criar uma conta</CardTitle>
          <CardDescription>
            Registre-se para começar a gerenciar suas finanças.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
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
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input 
                id="confirm-password"
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
                Entrar
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
