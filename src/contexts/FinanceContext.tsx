
// FinanceContext.tsx - Re-export all types and functionality from refactored files
import { createContext, useContext } from 'react';
import { useFinanceProvider } from '@/hooks/useFinanceProvider';
import { FinanceContextType, Transaction, TransactionType, TransactionStatus } from '@/types/finance';

// Create the context with a default empty value
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Provider component that wraps the application
export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const financeData = useFinanceProvider();

  return (
    <FinanceContext.Provider value={financeData}>
      {children}
    </FinanceContext.Provider>
  );
};

// Hook to use the finance context
export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

// Re-export the types
export type { Transaction, TransactionType, TransactionStatus, FinanceContextType };
