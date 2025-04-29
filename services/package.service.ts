import { getSupabase } from "./supabaseClient";

export const listPackages = async () => {
  const supabase = await getSupabase();
  return supabase.from('packages').select('*');
};

export const getPackage = async (id: string) => {
  const supabase = await getSupabase();
  return supabase.from('packages').select('*').eq('id', id).single();
};