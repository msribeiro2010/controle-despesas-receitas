
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TransactionFiltersProps {
  filter: "all" | "income" | "expense";
  setFilter: (filter: "all" | "income" | "expense") => void;
}

const TransactionFilters = ({ filter, setFilter }: TransactionFiltersProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("all")}
      >
        Todos
      </Button>
      <Button
        variant={filter === "income" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("income")}
        className={filter === "income" ? "bg-finance-income hover:bg-finance-income/90" : ""}
      >
        Receitas
      </Button>
      <Button
        variant={filter === "expense" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("expense")}
        className={filter === "expense" ? "bg-finance-expense hover:bg-finance-expense/90" : ""}
      >
        Despesas
      </Button>
    </div>
  );
};

export default TransactionFilters;
