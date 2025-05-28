import { useFinance } from "@/contexts/FinanceContext";
import StatCard from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank, ArrowUp, ArrowDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const Dashboard = () => {
  const {
    currentBalance,
    initialBalance,
    overdraftLimit,
    inOverdraft,
    transactions,
  } = useFinance();

  // Calculate monthly income and expenses based on current transactions
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get previous 6 months for chart
  const getLast6Months = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      months.push({
        month: monthDate,
        name: monthDate.toLocaleString('default', { month: 'short' }),
        income: 0,
        expenses: 0
      });
    }
    return months;
  };

  const last6MonthsData = getLast6Months();
  
  // Calculate income and expenses for each month for ALL transactions (not just PAID)
  transactions.forEach(transaction => {    
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth();
    const transactionYear = transactionDate.getFullYear();
    
    // Find the month in our data
    const monthIndex = last6MonthsData.findIndex(
      item => item.month.getMonth() === transactionMonth && 
              item.month.getFullYear() === transactionYear
    );
    
    if (monthIndex >= 0) {
      if (transaction.type === "INCOME") {
        last6MonthsData[monthIndex].income += transaction.amount;
      } else {
        last6MonthsData[monthIndex].expenses += transaction.amount;
      }
    }
  });

  // Calculate this month's income and expenses
  const thisMonthData = last6MonthsData.find(
    data => 
      data.month.getMonth() === currentMonth && 
      data.month.getFullYear() === currentYear
  ) || { income: 0, expenses: 0 };
  
  const monthlyIncome = thisMonthData.income;
  const monthlyExpenses = thisMonthData.expenses;
  
  // Dados para o gráfico de barras (últimos 6 meses)
  const barChartData = last6MonthsData;

  // Dados para o gráfico de pizza (categorias de despesas) - incluir TODAS as transações
  const expenseCategories = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, transaction) => {
      const existingCategory = acc.find(
        (item) => item.name === transaction.category
      );
      if (existingCategory) {
        existingCategory.value += transaction.amount;
      } else {
        acc.push({ name: transaction.category, value: transaction.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const pieColors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

  // Calcula o percentual do limite utilizado
  const overdraftUsed = inOverdraft ? Math.abs(currentBalance) : 0;
  const overdraftPercentage = overdraftLimit > 0 ? (overdraftUsed / overdraftLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saldo Atual"
          value={formatCurrency(currentBalance)}
          description={inOverdraft ? "Você está usando o cheque especial" : "Saldo positivo"}
          className={inOverdraft ? "border-finance-expense/30" : "border-finance-income/30"}
          icon={<PiggyBank className={inOverdraft ? "text-finance-expense" : "text-finance-income"} />}
        />
        <StatCard
          title="Receitas do Mês"
          value={formatCurrency(monthlyIncome)}
          icon={<ArrowUp className="text-finance-income" />}
          className="border-finance-income/30"
        />
        <StatCard
          title="Despesas do Mês"
          value={formatCurrency(monthlyExpenses)}
          icon={<ArrowDown className="text-finance-expense" />}
          className="border-finance-expense/30"
        />
        <StatCard
          title="Saldo Mensal"
          value={formatCurrency(monthlyIncome - monthlyExpenses)}
          trend={
            monthlyIncome - monthlyExpenses > 0
              ? { value: 12, positive: true }
              : { value: 8, positive: false }
          }
          className={
            monthlyIncome - monthlyExpenses >= 0
              ? "border-finance-income/30"
              : "border-finance-expense/30"
          }
        />
      </div>

      {inOverdraft && (
        <Card className="border-finance-warning/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Cheque Especial Utilizado</div>
              <div className="text-sm">{formatCurrency(overdraftUsed)} / {formatCurrency(overdraftLimit)}</div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  overdraftPercentage > 80
                    ? "bg-finance-expense"
                    : "bg-finance-warning"
                }`}
                style={{ width: `${Math.min(overdraftPercentage, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    name="Receitas"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Despesas"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#888888"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                          fontSize={12}
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
