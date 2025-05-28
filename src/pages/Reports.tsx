
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart2, FileText, Download } from "lucide-react";

const Reports = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Relatórios</h2>
        <p className="text-muted-foreground mt-2">
          Gere e exporte relatórios personalizados.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <CardTitle>Relatório Mensal</CardTitle>
            </div>
            <CardDescription>
              Visualize um resumo detalhado das suas finanças mensais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Mês</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Ano</Label>
                <Select defaultValue="2025">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline">Visualizar</Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Relatório por Categoria</CardTitle>
            </div>
            <CardDescription>
              Analise seus gastos e receitas por categoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Categoria</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="moradia">Moradia</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="lazer">Lazer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Período</Label>
                <Select defaultValue="month">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Mês atual</SelectItem>
                    <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                    <SelectItem value="year">Ano atual</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline">Visualizar</Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

// Componente Label adicional
const Label = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-sm font-medium mb-1.5">{children}</div>;
};

export default Reports;
