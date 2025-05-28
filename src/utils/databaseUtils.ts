
import { supabase } from "@/lib/supabase";

// Função para verificar se uma tabela existe
export const tableExists = async (tableName: 'transactions' | 'user_settings'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error(`Erro ao verificar tabela ${tableName}:`, error);
    return false;
  }
};

// Função para buscar configurações do usuário
export const fetchUserSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = Nenhum resultado encontrado
      throw error;
    }

    return { data, error };
  } catch (error) {
    console.error('Erro ao buscar configurações do usuário:', error);
    return { data: null, error };
  }
};

// Função para salvar configurações do usuário
export const saveUserSettings = async (
  userId: string, 
  initialBalance: number, 
  overdraftLimit: number, 
  notificationsEnabled: boolean
) => {
  try {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        initial_balance: initialBalance,
        overdraft_limit: overdraftLimit,
        notifications_enabled: notificationsEnabled
      })
      .select();

    return { error };
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return { error };
  }
};

// Função para buscar transações do usuário
export const fetchUserTransactions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return { data: null, error };
  }
};
