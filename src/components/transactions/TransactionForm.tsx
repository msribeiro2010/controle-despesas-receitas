
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Transaction, useFinance, TransactionStatus, TransactionType } from "@/contexts/FinanceContext";
import { transactionSchema, TransactionFormData } from "./forms/transactionSchema";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Import form components
import TransactionTypeField from "./forms/TransactionTypeField";
import AmountField from "./forms/AmountField";
import DateField from "./forms/DateField";
import CategoryField from "./forms/CategoryField";
import DescriptionField from "./forms/DescriptionField";
import StatusField from "./forms/StatusField";
import AttachmentField from "./forms/AttachmentField";
import TransactionFormActions from "./forms/TransactionFormActions";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: (transactionAdded?: boolean, status?: TransactionStatus) => void;
  editTransaction?: Transaction | null;
  isOverLimit?: boolean;
}

const TransactionForm = ({ isOpen, onClose, editTransaction, isOverLimit = false }: TransactionFormProps) => {
  const { addTransaction, updateTransaction } = useFinance();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; url: string } | null>(null);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE" as TransactionType,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: "",
      description: "",
      status: "PENDING" as TransactionStatus,
    },
  });

  const watchedType = form.watch("type");

  // Bloquear qualquer transação se estiver acima do limite (não apenas despesas)
  const isTransactionBlocked = isOverLimit;

  useEffect(() => {
    if (editTransaction) {
      form.reset({
        type: editTransaction.type,
        amount: editTransaction.amount,
        date: editTransaction.date,
        category: editTransaction.category,
        description: editTransaction.description,
        status: editTransaction.status,
      });
      
      if (editTransaction.attachment) {
        setAttachment(editTransaction.attachment);
      }
    } else {
      form.reset({
        type: "EXPENSE" as TransactionType,
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: "",
        description: "",
        status: "PENDING" as TransactionStatus,
      });
      setAttachment(null);
    }
  }, [editTransaction, form]);

  const onSubmit = async (data: TransactionFormData) => {
    // Bloquear qualquer transação se estiver acima do limite
    if (isTransactionBlocked) {
      toast({
        title: "Limite ultrapassado",
        description: "Não é possível lançar transações quando o limite do cheque especial foi ultrapassado. Regularize seu saldo primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Submetendo transação com data:", data.date);
      
      const transactionData: Omit<Transaction, "id"> = {
        type: data.type,
        amount: data.amount,
        date: data.date,
        category: data.category,
        description: data.description,
        status: data.status,
        ...(attachment && { attachment })
      };

      if (editTransaction) {
        await updateTransaction(editTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      onClose(true, data.status);
    } catch (error) {
      console.error("Erro ao processar transação:", error);
      toast({
        title: "Erro ao processar transação",
        description: "Houve um problema ao processar sua transação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setAttachment(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editTransaction ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
        </DialogHeader>

        {/* Alerta quando transações estão bloqueadas */}
        {isTransactionBlocked && (
          <Alert className="border-finance-expense bg-finance-expense/10">
            <AlertTriangle className="h-4 w-4 text-finance-expense" />
            <AlertDescription className="text-finance-expense">
              <strong>Limite Ultrapassado:</strong> Não é possível lançar transações quando o limite do cheque especial foi ultrapassado. 
              Regularize seu saldo primeiro para continuar utilizando o sistema.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TransactionTypeField 
                form={form} 
                disabled={isTransactionBlocked}
              />
              <AmountField form={form} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField form={form} />
              <CategoryField form={form} transactionType={watchedType} />
            </div>

            <DescriptionField form={form} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatusField form={form} />
              <AttachmentField 
                attachment={attachment} 
                setAttachment={setAttachment} 
              />
            </div>

            <TransactionFormActions 
              isSubmitting={isSubmitting} 
              onCancel={handleClose}
              isEditMode={!!editTransaction}
              isBlocked={isTransactionBlocked}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
