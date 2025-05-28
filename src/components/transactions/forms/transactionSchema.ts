
import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    required_error: "Tipo de transação é obrigatório",
  }),
  amount: z.coerce
    .number()
    .positive({ message: "O valor deve ser maior que zero" })
    .min(0.01, { message: "O valor mínimo é R$ 0,01" }),
  date: z.string().min(1, { message: "A data é obrigatória" }),
  category: z.string().min(1, { message: "A categoria é obrigatória" }),
  description: z.string().min(1, { message: "A descrição é obrigatória" }),
  status: z.enum(["PENDING", "DUE", "PAID"], {
    required_error: "Status é obrigatório",
  }),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
