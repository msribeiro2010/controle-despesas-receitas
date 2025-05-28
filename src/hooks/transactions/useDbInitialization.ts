
import { useState, useEffect } from "react";
import { ensureDbInitialized } from "@/services/transactionService";

export const useDbInitialization = () => {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);

  // Inicialização do banco de dados
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log("Inicializando banco de dados no hook...");
        const result = await ensureDbInitialized();
        setDbInitialized(result);
        console.log("Banco de dados inicializado com sucesso");
      } catch (error) {
        console.error("Erro ao inicializar banco de dados:", error);
        // Tente novamente após um curto intervalo (máximo 3 tentativas)
        if (initAttempts < 3) {
          setTimeout(() => {
            setInitAttempts(prev => prev + 1);
          }, 1000);
        }
      }
    };
    
    initDb();
  }, [initAttempts]);

  return { dbInitialized, initAttempts };
};
