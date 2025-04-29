import { getSupabase } from "./supabaseClient";

export const getProfile = async (userId: string) => {
  const supabase = await getSupabase();
  return supabase.from('profiles').select('*').eq('id', userId).single();
};

export const updateProfile = async (userId: string, data: Record<string, any>) => {
  const supabase = await getSupabase();
  return supabase.from('profiles').update(data).eq('id', userId);
};