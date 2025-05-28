import { useCallback } from "react";
import { Transaction } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { 
  addTransactionToDB, 
  updateTransactionInDB, 
  deleteTransactionFromDB, 
  clearAllTransactionsFromDB,
  ensureDbInitialized
} from "@/services/transactionService";

export const useTransactionOperations = (
  userId: string | undefined,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  fetchTransactions: () => Promise<void>
) => {
  const { toast } = useToast();

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    console.log("=== HOOK: INICIANDO ADIÇÃO ===");
    console.log("UserId:", userId);
    console.log("Transação recebida:", transaction);
    
    if (!userId) {
      console.error("UserId não encontrado!");
      toast({
        title: "Erro ao adicionar transação",
        description: "Você precisa estar autenticado para adicionar transações.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Garantir que o banco de dados esteja inicializado
      console.log("Garantindo inicialização do banco...");
      await ensureDbInitialized();
      
      // Criar um ID único para a transação
      const newTransaction = {
        ...transaction,
        id: crypto.randomUUID(),
        user_id: userId
      };
      
      console.log("Transação com ID e user_id:", newTransaction);
      
      // Verificar attachment antes de enviar
      if (newTransaction.attachment && 
          (newTransaction.attachment.name === undefined || 
          newTransaction.attachment.url === undefined)) {
        delete newTransaction.attachment;
      }
      
      console.log("=== HOOK: ADICIONANDO LOCALMENTE ===");
      // Adicionar localmente primeiro
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      
      console.log("=== HOOK: ENVIANDO PARA BANCO ===");
      // Adicionar ao banco de dados
      const { data, error } = await addTransactionToDB(newTransaction);
      
      if (error) {
        console.error("=== HOOK: ERRO NO BANCO ===");
        console.error("Erro:", error);
        throw error;
      }
      
      console.log("=== HOOK: SUCESSO NO BANCO ===");
      console.log("Dados retornados:", data);
      
      toast({
        title: "Transação adicionada",
        description: "Sua transação foi salva com sucesso.",
      });
      
      // Buscar dados novamente para garantir consistência
      console.log("=== HOOK: ATUALIZANDO LISTA ===");
      await fetchTransactions();
      
    } catch (error) {
      console.error('=== HOOK: ERRO GERAL ===');
      console.error('Erro:', error);
      toast({
        title: "Erro ao salvar transação",
        description: "Houve um problema ao salvar sua transação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updateTransaction = async (id: string, updatedFields: Partial<Transaction>) => {
    if (!userId) return;

    try {
      await ensureDbInitialized();
      
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === id
            ? { ...transaction, ...updatedFields }
            : transaction
        )
      );
      
      const { error } = await updateTransactionInDB(id, userId, updatedFields);
      
      if (error) throw error;
      
      toast({
        title: "Transação atualizada",
        description: "Sua transação foi atualizada com sucesso.",
      });
      
      fetchTransactions();
      
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast({
        title: "Erro ao atualizar transação",
        description: "A transação foi atualizada localmente, mas houve um erro ao salvá-la no servidor.",
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!userId) return;

    try {
      await ensureDbInitialized();
      
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction.id !== id)
      );
      
      const { error } = await deleteTransactionFromDB(id, userId);
        
      if (error) throw error;
      
      toast({
        title: "Transação excluída",
        description: "Sua transação foi excluída com sucesso.",
      });
      
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({
        title: "Erro ao excluir transação",
        description: "Houve um problema ao excluir sua transação no servidor.",
        variant: "destructive",
      });
      
      fetchTransactions();
    }
  };
  
  const clearAllTransactions = async () => {
    if (!userId) return;

    try {
      await ensureDbInitialized();
      
      setTransactions([]);
      
      const { error } = await clearAllTransactionsFromDB(userId);
        
      if (error) throw error;
      
      toast({
        title: "Transações removidas",
        description: "Todas as transações foram removidas com sucesso.",
      });
      
    } catch (error) {
      console.error('Erro ao limpar transações:', error);
      toast({
        title: "Erro ao limpar transações",
        description: "Houve um problema ao remover suas transações no servidor.",
        variant: "destructive",
      });
      
      fetchTransactions();
    }
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions
  };
};
