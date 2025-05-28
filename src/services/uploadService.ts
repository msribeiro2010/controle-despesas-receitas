import { supabase } from "@/integrations/supabase/client";

/**
 * Faz upload de um arquivo para o bucket 'invoices' no Supabase Storage e retorna a URL pública.
 * @param file Arquivo a ser enviado
 * @param userId ID do usuário para organizar os arquivos
 * @returns URL pública do arquivo ou erro
 */
export async function uploadInvoiceToStorage(file: File, userId: string): Promise<{ url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}-${file.name}`;

    // Faz upload para o bucket 'invoices'
    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    // Gera a URL pública
    const { data } = supabase.storage.from('invoices').getPublicUrl(filePath);
    if (!data.publicUrl) {
      return { error: 'Não foi possível obter a URL pública do arquivo.' };
    }

    return { url: data.publicUrl };
  } catch (err: any) {
    return { error: err.message || 'Erro desconhecido ao fazer upload.' };
  }
} 