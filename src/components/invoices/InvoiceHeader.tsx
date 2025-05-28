
interface InvoiceHeaderProps {
  transactionId: string;
  invoiceActualAmount: number | null;
  transactionAmount: number;
  transactionType: "INCOME" | "EXPENSE";
  formatCurrency: (amount: number) => string;
}

const InvoiceHeader = ({ 
  transactionId, 
  invoiceActualAmount, 
  transactionAmount, 
  transactionType, 
  formatCurrency 
}: InvoiceHeaderProps) => {
  const hasAmountDifference = invoiceActualAmount && invoiceActualAmount !== transactionAmount;

  return (
    <div>
      <h3 className="text-lg font-semibold">Fatura #{transactionId.slice(-8)}</h3>
      {hasAmountDifference && (
        <div className="text-sm text-muted-foreground mt-1">
          <p>Valor da transação: {formatCurrency(transactionAmount)}</p>
          <p>Valor da fatura: {formatCurrency(invoiceActualAmount)}</p>
          <p className="text-amber-600 font-medium">
            Diferença: {formatCurrency(Math.abs(invoiceActualAmount - transactionAmount))}
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoiceHeader;
