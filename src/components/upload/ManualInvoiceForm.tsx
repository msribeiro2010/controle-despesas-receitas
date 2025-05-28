
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";

interface ManualInvoiceFormProps {
  manualAmount: string;
  setManualAmount: (amount: string) => void;
  isPasswordProtected: boolean;
  setIsPasswordProtected: (isProtected: boolean) => void;
  invoicePassword: string;
  setInvoicePassword: (password: string) => void;
}

const ManualInvoiceForm = ({
  manualAmount,
  setManualAmount,
  isPasswordProtected,
  setIsPasswordProtected,
  invoicePassword,
  setInvoicePassword
}: ManualInvoiceFormProps) => {
  return (
    <div className="mt-6 space-y-4 border-t pt-4">
      <h3 className="font-medium text-lg">Detalhes da Fatura (Manual)</h3>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="amount">Valor da Fatura</Label>
          <Input 
            id="amount" 
            type="number" 
            step="0.01"
            value={manualAmount}
            onChange={(e) => setManualAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="protected" 
            checked={isPasswordProtected}
            onCheckedChange={setIsPasswordProtected}
          />
          <Label htmlFor="protected" className="flex items-center gap-2 cursor-pointer">
            <Lock className="h-4 w-4" />
            Proteger fatura com senha
          </Label>
        </div>
        
        {isPasswordProtected && (
          <div className="grid gap-2">
            <Label htmlFor="password">Senha da Fatura</Label>
            <Input 
              id="password" 
              type="password" 
              value={invoicePassword}
              onChange={(e) => setInvoicePassword(e.target.value)}
              placeholder="Digite uma senha para a fatura"
            />
            <p className="text-xs text-muted-foreground">
              A senha será necessária para visualizar esta fatura posteriormente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualInvoiceForm;
