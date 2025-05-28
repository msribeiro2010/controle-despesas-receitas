
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const settingsSchema = z.object({
  initialBalance: z.coerce.number(),
  overdraftLimit: z.coerce.number().nonnegative(),
  notificationsEnabled: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SettingsForm = () => {
  const { initialBalance, setInitialBalance, overdraftLimit, setOverdraftLimit, notificationsEnabled, setNotificationsEnabled } = useFinance();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      initialBalance,
      overdraftLimit,
      notificationsEnabled,
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    setInitialBalance(data.initialBalance);
    setOverdraftLimit(data.overdraftLimit);
    setNotificationsEnabled(data.notificationsEnabled);
    
    toast({
      title: "Configurações atualizadas",
      description: "Suas configurações financeiras foram salvas com sucesso.",
    });

    // Navigate to the dashboard to see the changes
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Financeiras</CardTitle>
        <CardDescription>
          Ajuste as configurações da sua conta e preferências de notificação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="initialBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Inicial</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    O saldo inicial da sua conta. Pode ser positivo ou negativo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overdraftLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Cheque Especial</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    O valor máximo que você pode utilizar do cheque especial.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationsEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notificações</FormLabel>
                    <FormDescription>
                      Ative para receber lembretes de vencimento.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit">Salvar Alterações</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsForm;
