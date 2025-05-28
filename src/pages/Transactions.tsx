import { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionForm from "@/components/transactions/TransactionForm";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, DollarSign, RefreshCw, AlertTriangle } from "lucide-react";
import { Transaction, useFinance, TransactionStatus } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Transactions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const { 
    currentBalance, 
    overdraftLimit, 
    clearAllTransactions, 
    isLoading, 
    refreshTransactions, 
    transactions 
  } = useFinance();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calcula se está no cheque especial e quanto está disponível
  const isUsingOverdraft = currentBalance < 0;
  const overdraftUsed = isUsingOverdraft ? Math.abs(currentBalance) : 0;
  const overdraftAvailable = overdraftLimit - overdraftUsed;
  const isOverLimit = overdraftUsed > overdraftLimit;

  // Atualizar transações ao montar o componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await refreshTransactions();
        console.log("Transações carregadas com sucesso na inicialização:", transactions.length);
      } catch (error) {
        console.error("Erro ao carregar transações iniciais:", error);
      }
    };
    
    loadInitialData();
  }, []);

  // Adicionar um log sempre que as transações mudarem
  useEffect(() => {
    console.log("Transactions page - Lista de transações atualizada:", transactions.length);
  }, [transactions]);

  const handleAddClick = () => {
    // Verificar se pode adicionar transações
    if (isOverLimit) {
      toast({
        title: "Limite ultrapassado",
        description: "Não é possível lançar novas transações quando o limite do cheque especial foi ultrapassado.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = async (transactionAdded: boolean = false, status: TransactionStatus = "PENDING") => {
    setIsFormOpen(false);
    setEditingTransaction(null);
    
    if (transactionAdded) {
      toast({
        title: "Transação processada",
        description: "Sua transação foi processada e o saldo foi atualizado.",
      });
      
      // Atualizar a lista de transações após adicionar ou editar
      try {
        await refreshTransactions();
        console.log("Lista de transações atualizada após adicionar/editar");
      } catch (error) {
        console.error("Erro ao atualizar lista após transação:", error);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log("Atualizando lista manualmente...");
      await refreshTransactions();
      console.log("Lista de transações atualizada manualmente:", transactions.length);
      toast({
        title: "Lista atualizada",
        description: "A lista de transações foi atualizada.",
      });
    } catch (error) {
      console.error("Erro ao atualizar lista manualmente:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a lista de transações.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearAllTransactions = async () => {
    try {
      await clearAllTransactions();
      toast({
        title: "Transações removidas",
        description: "Todas as transações foram removidas com sucesso.",
      });
      // Forçar atualização da lista após limpar
      await refreshTransactions();
    } catch (error) {
      console.error("Erro ao limpar transações:", error);
      toast({
        title: "Erro ao limpar transações",
        description: "Ocorreu um erro ao tentar remover as transações.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Carregando transações...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Transações</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
              Atualizar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" /> Limpar Tudo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação removerá todas as transações existentes. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllTransactions} className="bg-red-500 hover:bg-red-600">
                    Sim, Limpar Tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={handleAddClick}
              disabled={isOverLimit}
              className={isOverLimit ? "opacity-50 cursor-not-allowed" : ""}
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Transação
            </Button>
          </div>
        </div>
        
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Saldo Atual */}
          <Card className={`${currentBalance < 0 ? 'bg-finance-expense/10' : 'bg-finance-income/10'} border-0`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className={`mr-2 h-5 w-5 ${currentBalance < 0 ? 'text-finance-expense' : 'text-finance-income'}`} />
                  <span className="text-sm font-medium">Saldo Atual</span>
                </div>
                <div className={`text-xl font-bold ${currentBalance < 0 ? 'text-finance-expense' : 'text-finance-income'}`}>
                  {formatCurrency(currentBalance)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cheque Especial */}
          <Card className="bg-blue-50 border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Cheque Especial</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Limite: {formatCurrency(overdraftLimit)}
                  </div>
                  <div className={`text-lg font-bold ${isUsingOverdraft ? 'text-finance-expense' : 'text-blue-600'}`}>
                    Disponível: {formatCurrency(overdraftAvailable)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas do Cheque Especial */}
        {isUsingOverdraft && !isOverLimit && (
          <Alert className="border-finance-warning bg-finance-warning/10">
            <AlertTriangle className="h-4 w-4 text-finance-warning" />
            <AlertDescription className="text-finance-warning">
              <strong>Atenção:</strong> Você está utilizando o cheque especial. 
              Valor utilizado: {formatCurrency(overdraftUsed)} de {formatCurrency(overdraftLimit)}
            </AlertDescription>
          </Alert>
        )}

        {isOverLimit && (
          <Alert className="border-finance-expense bg-finance-expense/10">
            <AlertTriangle className="h-4 w-4 text-finance-expense" />
            <AlertDescription className="text-finance-expense">
              <strong>Limite Excedido:</strong> Você ultrapassou o limite do cheque especial em {formatCurrency(overdraftUsed - overdraftLimit)}. 
              O lançamento de novas transações está bloqueado até regularizar o saldo.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <TransactionList onEdit={handleEditTransaction} />

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editTransaction={editingTransaction}
        isOverLimit={isOverLimit}
      />
    </AppLayout>
  );
};

export default Transactions;
