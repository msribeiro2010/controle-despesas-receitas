
// Serviço simulado de OCR para extração de dados de faturas
export interface InvoiceOcrResult {
  amount: number;
  description: string;
  date: string;
  category: string;
  confidence: number;
}

export const extractInvoiceData = async (file: File): Promise<InvoiceOcrResult> => {
  console.log("Iniciando extração OCR para arquivo:", file.name);
  
  // Simular processamento OCR
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Gerar um hash simples baseado no nome do arquivo para consistência
  const fileHash = file.name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Usar o hash para gerar valores consistentes mas variados
  const baseAmount = Math.abs(fileHash % 2000) + 50; // Valores entre 50 e 2050
  const amount = Math.round(baseAmount * 100) / 100; // Arredondar para 2 casas decimais
  
  let extractedData: InvoiceOcrResult;
  
  if (file.name.toLowerCase().includes('bradesco') || file.name.toLowerCase().includes('cartao')) {
    extractedData = {
      amount: amount,
      description: "Fatura Cartão Bradesco - Diversos estabelecimentos",
      date: new Date().toISOString().split('T')[0],
      category: "Cartão de Crédito",
      confidence: 0.95
    };
  } else if (file.name.toLowerCase().includes('energia') || file.name.toLowerCase().includes('luz')) {
    // Para energia, usar valores menores (50-300)
    const energyAmount = Math.round((Math.abs(fileHash % 250) + 50) * 100) / 100;
    extractedData = {
      amount: energyAmount,
      description: "Conta de Energia Elétrica",
      date: new Date().toISOString().split('T')[0],
      category: "Utilidades",
      confidence: 0.92
    };
  } else if (file.name.toLowerCase().includes('agua')) {
    // Para água, valores ainda menores (30-150)
    const waterAmount = Math.round((Math.abs(fileHash % 120) + 30) * 100) / 100;
    extractedData = {
      amount: waterAmount,
      description: "Conta de Água e Esgoto",
      date: new Date().toISOString().split('T')[0],
      category: "Utilidades",
      confidence: 0.88
    };
  } else if (file.name.toLowerCase().includes('internet') || file.name.toLowerCase().includes('telefone')) {
    // Para telecomunicações (80-200)
    const telecomAmount = Math.round((Math.abs(fileHash % 120) + 80) * 100) / 100;
    extractedData = {
      amount: telecomAmount,
      description: "Fatura Internet/Telefone",
      date: new Date().toISOString().split('T')[0],
      category: "Telecomunicações",
      confidence: 0.90
    };
  } else if (file.name.toLowerCase().includes('boleto') || file.name.toLowerCase().includes('fatura')) {
    // Para boletos gerais, usar o valor baseado no hash do arquivo
    extractedData = {
      amount: amount,
      description: `Fatura extraída de ${file.name.split('.')[0]}`,
      date: new Date().toISOString().split('T')[0],
      category: "Cartão de Crédito",
      confidence: 0.88
    };
  } else {
    // Valor variado para outros tipos de arquivo
    extractedData = {
      amount: amount,
      description: `Fatura extraída de ${file.name}`,
      date: new Date().toISOString().split('T')[0],
      category: "Outros",
      confidence: 0.75
    };
  }
  
  console.log("Dados extraídos com OCR:", extractedData);
  return extractedData;
};

export const validateExtractedAmount = (amount: number): boolean => {
  return amount > 0 && amount < 100000; // Validação básica
};

// Função auxiliar para simular extração de valores monetários de texto
export const extractMoneyFromText = (text: string): number | null => {
  // Regex para capturar valores monetários brasileiros
  const moneyRegex = /(?:R\$?\s*)?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g;
  const matches = text.match(moneyRegex);
  
  if (matches && matches.length > 0) {
    // Pegar o primeiro valor encontrado e converter para número
    const cleanValue = matches[0]
      .replace(/R\$?\s*/, '')
      .replace(/\./g, '') // Remove separadores de milhares
      .replace(',', '.'); // Troca vírgula por ponto decimal
    
    return parseFloat(cleanValue);
  }
  
  return null;
};
