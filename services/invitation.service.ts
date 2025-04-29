import { getSupabase } from "./supabaseClient";

export const listInvitations = async (profileId?: string) => {
  const supabase = await getSupabase();
  let query = supabase.from('invitations').select('*');
  
  if (profileId) {
    query = query.eq('profile_id', profileId);
  }
  
  return query;
};

export const getInvitation = async (id: string) => {
  const supabase = await getSupabase();
  return supabase.from('invitations').select('*').eq('id', id).single();
};

export const createInvitation = async (data: Record<string, any>) => {
  const supabase = await getSupabase();
  
  // Asegurarse de que siempre usamos profile_id
  if (data.user_id && !data.profile_id) {
    data.profile_id = data.user_id;
    // Opcionalmente podríamos eliminar user_id para ir migrando completamente
    // delete data.user_id;
  }
  
  return supabase.from('invitations').insert([data]);
};

export const updateInvitation = async (id: string, data: Record<string, any>) => {
  const supabase = await getSupabase();
  return supabase.from('invitations').update(data).eq('id', id);
};

export const deleteInvitation = async (id: string) => {
  const supabase = await getSupabase();
  return supabase.from('invitations').delete().eq('id', id);
};

export const generatePasses = async (invitationId: string, count: number) => {
  const supabase = await getSupabase();
  const passes = Array.from({ length: count }).map(() => ({ invitation_id: invitationId }));
  return supabase.from('invitation_passes').insert(passes);
};