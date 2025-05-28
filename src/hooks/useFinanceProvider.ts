
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Transaction, FinanceContextType, TransactionStatus } from "@/types/finance";
import { calculateCurrentBalance, calculateMonthlyIncome, calculateMonthlyExpenses } from "@/utils/financeCalculations";

export const useFinanceProvider = (): FinanceContextType => {
  const { user, tablesReady } = useAuth();
  const userId = user?.id;

  // Get settings from the user settings hook
  const {
    initialBalance,
    setInitialBalance,
    overdraftLimit,
    setOverdraftLimit,
    notificationsEnabled,
    setNotificationsEnabled
  } = useUserSettings(userId, tablesReady);

  // Get transactions using the transactions hook
  const {
    transactions,
    isLoading,
    fetchTransactions,
    addTransaction: addTransactionToDb,
    updateTransaction: updateTransactionInDb,
    deleteTransaction: deleteTransactionFromDb,
    clearAllTransactions: clearAllTransactionsFromDb,
  } = useTransactions(userId);

  // Calculate derived financial data
  const currentBalance = calculateCurrentBalance(initialBalance, transactions);
  const inOverdraft = currentBalance < 0;
  const monthlyIncome = calculateMonthlyIncome(transactions);
  const monthlyExpenses = calculateMonthlyExpenses(transactions);

  // Function to add a transaction
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    return addTransactionToDb(transaction);
  };

  // Function to update a transaction
  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    return updateTransactionInDb(id, transaction);
  };

  // Function to delete a transaction
  const deleteTransaction = async (id: string) => {
    return deleteTransactionFromDb(id);
  };

  // Function to clear all transactions
  const clearAllTransactions = async () => {
    return clearAllTransactionsFromDb();
  };

  // Function to refresh transactions
  const refreshTransactions = async () => {
    return fetchTransactions();
  };

  return {
    initialBalance,
    setInitialBalance,
    overdraftLimit,
    setOverdraftLimit,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    currentBalance,
    inOverdraft,
    monthlyIncome,
    monthlyExpenses,
    notificationsEnabled, 
    setNotificationsEnabled,
    isLoading,
    refreshTransactions
  };
};
