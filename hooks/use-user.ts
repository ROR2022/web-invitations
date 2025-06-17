'use client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

/**
 * Hook to get the current authenticated user
 * With fallback to handle cookie parsing issues
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Usar un estado para el cliente de Supabase para evitar múltiples instancias
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function getUser() {
      try {
        // Intentar obtener la sesión actual como primera opción
        // (esto usa localStorage si está disponible)
        setLoading(true);
        try {
          const {
            data: { user: userData },
            error: userError,
          } = await supabase.auth.getUser();

          if (userData) {
            setUser(userData);
            setLoading(false);
            return;
          }

          if (userError) {
            console.warn('Warning getting user (not critical):', userError);
          }
        } catch (userError) {
          console.error('Exception when getting user:', userError);
        }

        setLoading(false);

        // Suscribirse a cambios de autenticación
        /* const {
          data: { subscription },
        } = await supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event);
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        }; */
      } catch (e) {
        console.error('Unexpected error in useUser hook:', e);
        setLoading(false);
      }
    }

    getUser();
  }, [supabase]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
