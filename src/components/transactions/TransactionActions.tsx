
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Transaction } from "@/contexts/FinanceContext";

interface TransactionActionsProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionActions = ({ transaction, onEdit, onDelete }: TransactionActionsProps) => {
  const navigate = useNavigate();

  // Check if the transaction has an attachment - fix for null attachment error
  const hasInvoiceAttached = () => {
    return transaction.attachment && 
           transaction.attachment.url && 
           transaction.attachment.url !== "";
  };

  const handleViewInvoice = () => {
    navigate(`/invoice/${transaction.id}`);
  };

  return (
    <div className="flex items-center justify-end space-x-1">
      {hasInvoiceAttached() && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleViewInvoice}
              >
                <Eye className="h-4 w-4 text-finance-info" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visualizar Fatura</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(transaction)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(transaction.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TransactionActions;
