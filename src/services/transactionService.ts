
// Este arquivo agora funciona como um ponto central para exportar todas as funcionalidades
// relacionadas às transações e ao banco de dados

// Exportações do serviço de inicialização do banco de dados
export { ensureDbInitialized } from './db/dbInitService';

// Exportações do serviço de tabelas
export { createTransactionsTable } from './db/tableService';

// Exportações do serviço de transações
export {
  fetchTransactionsFromDB,
  addTransactionToDB,
  updateTransactionInDB,
  deleteTransactionFromDB,
  clearAllTransactionsFromDB
} from './db/transactionDataService';
