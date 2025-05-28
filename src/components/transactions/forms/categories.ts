
// Income and expense categories

export const incomeCategories = [
  "Salário", 
  "Freelance", 
  "Investimentos", 
  "Reembolso", 
  "Outros"
];

export const expenseCategories = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Vestuário",
  "Utilidades",
  "Assinaturas",
  "Cartão de Crédito",
  "Outros"
];

export const getTranslatedStatus = (status: string): string => {
  switch (status) {
    case "PAID":
      return "Pago";
    case "PENDING":
      return "A Vencer";
    case "DUE":
      return "Pagar";
    default:
      return status;
  }
};
