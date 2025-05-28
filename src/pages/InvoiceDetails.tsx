import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Transaction, useFinance } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import InvoiceDetailsHeader from "@/components/invoices/InvoiceDetailsHeader";
import PasswordProtection from "@/components/invoices/PasswordProtection";
import InvoiceViewer from "@/components/invoices/InvoiceViewer";
import InvoiceDetailsCard from "@/components/invoices/InvoiceDetailsCard";
import InvoiceActions from "@/components/invoices/InvoiceActions";

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions, updateTransaction, deleteTransaction } = useFinance();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [invoiceActualAmount, setInvoiceActualAmount] = useState<number | null>(null);

  useEffect(() => {
    // Find the transaction with the given ID
    const foundTransaction = transactions.find(t => t.id === id);
    if (foundTransaction) {
      setTransaction(foundTransaction);
      
      // Check if this invoice has password protection (simulate by checking if the description contains "protegida")
      const isProtected = foundTransaction.description.toLowerCase().includes("protegida") || 
                         foundTransaction.description.toLowerCase().includes("protected");
      setIsPasswordProtected(isProtected);
      setIsPasswordVerified(!isProtected); // If not protected, consider it verified
      
      // Set a different amount to simulate the actual invoice amount differing from transaction
      const actualAmount = foundTransaction.type === "EXPENSE" ? 
        foundTransaction.amount * 1.05 : // 5% higher for expenses to simulate fees
        foundTransaction.amount * 0.95;  // 5% lower for income to simulate discounts
      
      setInvoiceActualAmount(Math.round(actualAmount * 100) / 100);
    }
  }, [id, transactions]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePasswordVerified = () => {
    setIsPasswordVerified(true);
  };

  const markAsPaid = () => {
    if (transaction && transaction.status !== "PAID") {
      updateTransaction(transaction.id, { status: "PAID" });
      setTransaction({ ...transaction, status: "PAID" });
      toast({
        title: "Transação atualizada",
        description: "Transação marcada como paga com sucesso.",
      });
    }
  };

  const handleDeleteTransaction = () => {
    if (transaction) {
      deleteTransaction(transaction.id);
      toast({
        title: "Fatura excluída",
        description: "A fatura foi excluída com sucesso.",
      });
      navigate("/transactions");
    }
  };

  if (!transaction) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-xl text-muted-foreground">Fatura não encontrada</p>
          <Button onClick={handleGoBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <InvoiceDetailsHeader 
        title="Detalhes da Fatura"
        description={transaction.description}
        onGoBack={handleGoBack}
      />

      {isPasswordProtected && !isPasswordVerified ? (
        <PasswordProtection onPasswordVerified={handlePasswordVerified} />
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <InvoiceViewer 
            attachment={transaction.attachment}
            transactionId={transaction.id}
            invoiceActualAmount={invoiceActualAmount}
            transactionAmount={transaction.amount}
            transactionType={transaction.type}
            formatCurrency={formatCurrency}
          />
          
          <InvoiceDetailsCard 
            transaction={transaction}
            formatCurrency={formatCurrency}
          />
          
          <InvoiceActions 
            transaction={transaction}
            onMarkAsPaid={markAsPaid}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      )}
    </AppLayout>
  );
};

export default InvoiceDetails;
