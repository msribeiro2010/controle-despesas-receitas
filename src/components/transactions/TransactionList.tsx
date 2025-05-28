
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFinance, Transaction } from "@/contexts/FinanceContext";

// Import our new components
import TransactionFilters from "./filters/TransactionFilters";
import TransactionRow from "./TransactionRow";
import EmptyTransactionState from "./EmptyTransactionState";
import Spinner from "@/components/ui/Spinner";

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
}

const TransactionList = ({ onEdit }: TransactionListProps) => {
  const { transactions, deleteTransaction, isLoading, refreshTransactions } = useFinance();
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  
  // Atualizar transações locais quando as do contexto mudarem
  useEffect(() => {
    setLocalTransactions(transactions);
    console.log("TransactionList - Transações atualizadas:", transactions.length);
  }, [transactions]);

  // Aplicar filtros às transações
  const filteredTransactions = localTransactions.filter(transaction => {
    if (filter === "all") return true;
    return filter === "income" 
      ? transaction.type === "INCOME" 
      : transaction.type === "EXPENSE";
  });

  // Função para lidar com exclusão de transação
  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      // Atualizar lista local imediatamente para melhor UX
      setLocalTransactions(prev => prev.filter(t => t.id !== id));
      // Também atualizar do backend para garantir consistência
      await refreshTransactions();
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner size="md" />
        <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TransactionFilters filter={filter} setFilter={setFilter} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionRow 
                  key={transaction.id} 
                  transaction={transaction} 
                  onEdit={onEdit} 
                  onDelete={handleDelete} 
                />
              ))
            ) : (
              <EmptyTransactionState />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionList;
