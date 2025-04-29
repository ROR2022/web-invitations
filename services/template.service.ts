import { getSupabase } from "./supabaseClient";

export const listTemplates = async () => {
  const supabase = await getSupabase();
  return supabase.from('templates').select('*');
};

export const getTemplate = async (id: string) => {
  const supabase = await getSupabase();
  return supabase.from('templates').select('*').eq('id', id).single();
};