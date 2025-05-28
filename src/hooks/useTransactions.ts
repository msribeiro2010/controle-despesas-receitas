
import { useEffect } from "react";
import { Transaction } from "@/types/finance";
import { useDbInitialization } from "./transactions/useDbInitialization";
import { useTransactionData } from "./transactions/useTransactionData";
import { useTransactionOperations } from "./transactions/useTransactionOperations";

export const useTransactions = (userId: string | undefined) => {
  const { dbInitialized, initAttempts } = useDbInitialization();
  const { transactions, setTransactions, isLoading, fetchTransactions } = useTransactionData(userId);
  const { 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    clearAllTransactions 
  } = useTransactionOperations(userId, setTransactions, fetchTransactions);

  // Carregamento inicial de transações
  useEffect(() => {
    if ((dbInitialized || initAttempts >= 3) && userId) {
      fetchTransactions();
    }
  }, [fetchTransactions, dbInitialized, initAttempts, userId]);

  return {
    transactions,
    isLoading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    setTransactions
  };
};
