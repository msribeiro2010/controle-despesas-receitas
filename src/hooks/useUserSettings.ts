
import { useState, useEffect } from "react";
import { saveUserSettings } from "@/utils/databaseUtils";
import { loadSavedSettings, saveSettingsToLocalStorage } from "@/utils/financeUtils";

export const useUserSettings = (userId: string | undefined, tablesReady: boolean) => {
  const settings = loadSavedSettings();
  
  const [initialBalance, setInitialBalance] = useState<number>(settings.initialBalance);
  const [overdraftLimit, setOverdraftLimit] = useState<number>(settings.overdraftLimit);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(settings.notificationsEnabled);

  // Save settings to localStorage and Supabase when they change
  useEffect(() => {
    saveSettingsToLocalStorage(initialBalance, overdraftLimit, notificationsEnabled);
    
    // Se o usuário estiver autenticado e as tabelas estiverem prontas, salve também no Supabase
    if (userId && tablesReady) {
      saveUserSettings(userId, initialBalance, overdraftLimit, notificationsEnabled);
    }
  }, [initialBalance, overdraftLimit, notificationsEnabled, userId, tablesReady]);

  return {
    initialBalance, 
    setInitialBalance,
    overdraftLimit, 
    setOverdraftLimit,
    notificationsEnabled, 
    setNotificationsEnabled
  };
};
