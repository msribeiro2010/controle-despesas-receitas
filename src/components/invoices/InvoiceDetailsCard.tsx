
import { Transaction } from "@/contexts/FinanceContext";

interface InvoiceDetailsCardProps {
  transaction: Transaction;
  formatCurrency: (amount: number) => string;
}

const InvoiceDetailsCard = ({ transaction, formatCurrency }: InvoiceDetailsCardProps) => {
  // Check if attachment exists and has valid URL
  const hasValidAttachment = () => {
    return transaction?.attachment && 
           transaction.attachment.url && 
           transaction.attachment.url.trim() !== "" &&
           !transaction.attachment.url.startsWith('blob:'); // Avoid expired blob URLs
  };

  // Check if it's a blob URL (temporary)
  const isBlobUrl = () => {
    return transaction?.attachment?.url?.startsWith('blob:') || false;
  };

  return (
    <div className="bg-muted/30 w-full p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-3">Detalhes da Transação</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Categoria</p>
          <p className="font-medium">{transaction.category}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Valor</p>
          <p className={`font-medium ${
            transaction.type === "INCOME" 
              ? "text-finance-income" 
              : "text-finance-expense"
          }`}>
            {transaction.type === "INCOME" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Vencimento</p>
          <p className="font-medium">{new Date(transaction.date).toLocaleDateString("pt-BR")}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="font-medium">
            {transaction.status === "PAID" ? "Pago" : 
             transaction.status === "DUE" ? "A Pagar" : "Pendente"}
          </p>
        </div>
        {transaction.attachment && (
          <div className="col-span-full">
            <p className="text-sm text-muted-foreground">Arquivo</p>
            <p className="font-medium truncate">{transaction.attachment.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Status: {hasValidAttachment() ? "Disponível" : 
                       isBlobUrl() ? "Expirado (temporário)" : "Indisponível"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailsCard;
