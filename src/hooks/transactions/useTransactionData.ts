
import { useState, useCallback } from "react";
import { Transaction } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchTransactionsFromDB, 
  addTransactionToDB, 
  updateTransactionInDB, 
  deleteTransactionFromDB, 
  clearAllTransactionsFromDB,
  ensureDbInitialized
} from "@/services/transactionService";

export const useTransactionData = (userId: string | undefined) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Busca de transações
  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Iniciando busca de transações para userId:", userId);
      
      // Garantir que o banco de dados esteja inicializado antes de buscar
      await ensureDbInitialized();
      
      const { data, error } = await fetchTransactionsFromDB(userId);
      
      if (error) {
        throw error;
      }
      
      console.log("Dados recuperados com sucesso:", data ? data.length : 0);
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Estamos tendo problemas para carregar suas transações. Tente novamente.",
        variant: "destructive",
      });
      
      // Redefinir transações para evitar manter dados obsoletos
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  return {
    transactions,
    setTransactions,
    isLoading,
    fetchTransactions
  };
};
