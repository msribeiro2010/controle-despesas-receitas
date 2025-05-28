
import { supabase } from "@/integrations/supabase/client";

// Função para criar a tabela transactions com a estrutura correta
export const createTransactionsTable = async () => {
  console.log("Verificando tabela de transações...");
  
  try {
    // Verificar se a tabela existe fazendo uma consulta simples
    const { data: existingData, error: checkError } = await supabase
      .from('transactions')
      .select('*')
      .limit(1);
    
    console.log("Tabela transactions verificada:", { hasData: !!existingData, error: checkError });
    
    if (checkError) {
      console.error("Erro ao verificar tabela:", checkError);
      return false;
    }
    
    console.log("Tabela transactions está pronta para uso!");
    return true;
    
  } catch (error) {
    console.error("Erro ao verificar tabela de transações:", error);
    return false;
  }
};
