
import { Button } from "@/components/ui/button";
import { Check, Trash2, Edit } from "lucide-react";
import { Transaction } from "@/contexts/FinanceContext";
import { useNavigate } from "react-router-dom";

interface InvoiceActionsProps {
  transaction: Transaction;
  onMarkAsPaid: () => void;
  onDeleteTransaction: () => void;
}

const InvoiceActions = ({ transaction, onMarkAsPaid, onDeleteTransaction }: InvoiceActionsProps) => {
  const navigate = useNavigate();

  const handleEditTransaction = () => {
    navigate(`/transactions?edit=${transaction.id}`);
  };

  const isTemporaryOrInvalidAttachment = () => {
    if (!transaction.attachment) return false;
    return transaction.attachment.url.startsWith('blob:') || 
           transaction.attachment.url.startsWith('data:') ||
           !transaction.attachment.url.trim();
  };

  return (
    <div className="mt-6 flex flex-wrap justify-end gap-2 w-full">
      <Button 
        onClick={onDeleteTransaction} 
        variant="outline"
        className="flex items-center text-destructive hover:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir Fatura
      </Button>
      
      {isTemporaryOrInvalidAttachment() && (
        <Button 
          onClick={handleEditTransaction}
          variant="outline"
          className="flex items-center"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar Transação
        </Button>
      )}
      
      {transaction.status !== "PAID" && (
        <Button onClick={onMarkAsPaid} className="flex items-center">
          <Check className="mr-2 h-4 w-4" />
          Marcar como Pago
        </Button>
      )}
    </div>
  );
};

export default InvoiceActions;
