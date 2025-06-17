import { getSupabase } from "./supabaseClient";

export const uploadMedia = async (path: string, file: File) => {
  const supabase = await getSupabase();
  return supabase.storage.from('invitations-media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: (file as any).type,
  });
};

export const getMediaUrl = async (path: string) => {
  const supabase = await getSupabase();
  const { data } = supabase.storage.from('invitation-media').getPublicUrl(path);
  return data.publicUrl;
};

export const deleteMedia = async (path: string) => {
  const supabase = await getSupabase();
  return supabase.storage.from('invitation-media').remove([path]);
};