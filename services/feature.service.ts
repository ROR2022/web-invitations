import { getSupabase } from "./supabaseClient";

export const listFeatures = async () => {
  const supabase = await getSupabase();
  return supabase.from('features').select('*');
};

export const isFeatureEnabled = async (key: string) => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('features')
    .select('enabled')
    .eq('key', key)
    .single();
  return { enabled: data?.enabled ?? false, error };
};