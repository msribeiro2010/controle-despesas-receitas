
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/finance";
import { ensureDbInitialized } from "./dbInitService";

// Preparar transação para salvar (remover campos inválidos)
const prepareTransactionForSave = (transaction: Transaction) => {
  const preparedTransaction = { ...transaction } as any;
  
  // Se o attachment for undefined ou tiver propriedades undefined, remova-o
  if (preparedTransaction.attachment && 
      (preparedTransaction.attachment.name === undefined || 
       preparedTransaction.attachment.url === undefined)) {
    delete preparedTransaction.attachment;
  }
  
  // Renomear actualAmount para actual_amount se existir
  if (preparedTransaction.actualAmount !== undefined) {
    preparedTransaction.actual_amount = preparedTransaction.actualAmount;
    delete preparedTransaction.actualAmount;
  }
  
  // Garantir que user_id exista e seja uma string
  if (!preparedTransaction.user_id || typeof preparedTransaction.user_id !== 'string') {
    console.error("ERRO: user_id ausente ou inválido na transação:", preparedTransaction);
    throw new Error("user_id é obrigatório para salvar transações");
  }
  
  // Garantir que campos obrigatórios existam
  if (!preparedTransaction.id) {
    preparedTransaction.id = crypto.randomUUID();
  }
  
  if (!preparedTransaction.created_at) {
    preparedTransaction.created_at = new Date().toISOString();
  }
  
  console.log("Transação preparada para salvar:", preparedTransaction);
  return preparedTransaction;
};

// Função para mapear campos de retorno para formato esperado
const mapTransactionFromDb = (transaction: any): Transaction => {
  if (transaction.actual_amount !== undefined) {
    transaction.actualAmount = transaction.actual_amount;
    delete transaction.actual_amount;
  }
  
  return transaction as Transaction;
};

// Buscar transações do banco de dados
export const fetchTransactionsFromDB = async (userId: string) => {
  if (!userId) {
    console.log("Tentativa de buscar transações sem userId");
    return { data: [], error: null };
  }

  console.log("Buscando transações do usuário:", userId);
  
  await ensureDbInitialized();
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro na busca de transações:", error);
      throw error;
    }
    
    console.log("Transações encontradas:", data?.length || 0);
    const mappedData = data ? data.map(mapTransactionFromDb) : [];
    return { data: mappedData, error: null };
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return { data: [], error };
  }
};

// Adicionar uma transação ao banco de dados 
export const addTransactionToDB = async (transaction: Transaction) => {
  console.log("=== INICIANDO ADIÇÃO DE TRANSAÇÃO ===");
  console.log("Transação recebida:", transaction);
  
  await ensureDbInitialized();
  
  try {
    const preparedTransaction = prepareTransactionForSave(transaction);
    
    console.log("=== ENVIANDO PARA SUPABASE ===");
    console.log("Dados preparados:", preparedTransaction);
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([preparedTransaction])
      .select();
    
    if (error) {
      console.error("=== ERRO AO INSERIR ===");
      console.error("Erro detalhado:", error);
      console.error("Código do erro:", error.code);
      console.error("Mensagem:", error.message);
      throw error;
    }
    
    console.log("=== SUCESSO NA INSERÇÃO ===");
    console.log("Dados retornados:", data);
    
    const mappedData = data ? data.map(mapTransactionFromDb) : null;
    return { data: mappedData, error: null };
  } catch (error) {
    console.error('=== ERRO GERAL AO ADICIONAR TRANSAÇÃO ===');
    console.error('Erro:', error);
    return { data: null, error };
  }
};

// Atualizar uma transação no banco de dados
export const updateTransactionInDB = async (id: string, userId: string, updatedFields: Partial<Transaction>) => {
  await ensureDbInitialized();
  
  const fieldsToUpdate = { ...updatedFields } as any;
  
  if (fieldsToUpdate.actualAmount !== undefined) {
    fieldsToUpdate.actual_amount = fieldsToUpdate.actualAmount;
    delete fieldsToUpdate.actualAmount;
  }
  
  try {
    const { error } = await supabase
      .from('transactions')
      .update(fieldsToUpdate)
      .eq('id', id)
      .eq('user_id', userId);
      
    if (error) {
      console.error("Erro ao atualizar transação:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return { error };
  }
};

// Excluir uma transação do banco de dados
export const deleteTransactionFromDB = async (id: string, userId: string) => {
  await ensureDbInitialized();
  
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
      
    if (error) {
      console.error("Erro ao excluir transação:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return { error };
  }
};

// Limpar todas as transações de um usuário
export const clearAllTransactionsFromDB = async (userId: string) => {
  await ensureDbInitialized();
  
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      console.error("Erro ao limpar transações:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Erro ao limpar transações:', error);
    return { error };
  }
};
