import { createClient } from "@/utils/supabase/server";

export const getSupabase = async () => {
  return await createClient();
};

//crearemos una funcion que nos permita determinar 
//si el usuario esta autenticado y si es admin 

export const isAuthenticated = async () => {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user !== null;
};

export const isAdmin = async () => {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
        return false;
    }

    return data?.role === 'admin';
  }
  return false;
}