
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PasswordProtectionProps {
  onPasswordVerified: () => void;
}

const PasswordProtection = ({ onPasswordVerified }: PasswordProtectionProps) => {
  const [invoicePassword, setInvoicePassword] = useState("");
  const { toast } = useToast();

  const verifyInvoicePassword = () => {
    // In a real app, you would verify the password against a database
    // Here we just check if the password is "1234" for demonstration purposes
    if (invoicePassword === "1234") {
      onPasswordVerified();
      toast({
        title: "Senha verificada",
        description: "Você tem acesso à visualização da fatura.",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "A senha informada não corresponde à fatura.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4 py-4 max-w-md mx-auto bg-card p-6 rounded-lg shadow">
      <div className="text-amber-500 text-center mb-4">
        <p className="text-xl font-semibold">Fatura Protegida</p>
      </div>
      <p className="text-center">Esta fatura está protegida por senha.</p>
      <p className="text-center text-sm text-muted-foreground">
        Por favor, digite a senha para visualizar o conteúdo da fatura.
      </p>
      <div className="flex space-x-2">
        <Input 
          type="password" 
          placeholder="Digite a senha da fatura" 
          value={invoicePassword}
          onChange={(e) => setInvoicePassword(e.target.value)}
          className="flex-1"
        />
        <Button onClick={verifyInvoicePassword}>Verificar</Button>
      </div>
      <div className="text-xs text-muted-foreground text-center mt-2">
        Para fins de demonstração, a senha é "1234"
      </div>
    </div>
  );
};

export default PasswordProtection;
