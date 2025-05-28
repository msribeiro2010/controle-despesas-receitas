
import { supabase } from "@/integrations/supabase/client";
import { createTransactionsTable } from "./tableService";

// Variável global para controlar se o banco de dados foi inicializado
let dbInitialized = false;

// Função para inicializar o banco de dados
export const ensureDbInitialized = async () => {
  if (!dbInitialized) {
    try {
      console.log("Inicializando banco de dados...");
      
      // Verificar a tabela transactions
      const result = await createTransactionsTable();
      
      if (result) {
        // Marcar como inicializado
        dbInitialized = true;
        console.log("Banco de dados inicializado com sucesso");
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao inicializar o banco de dados:", error);
      return false;
    }
  }
  return true;
};
