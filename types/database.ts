/**
 * Tipos de la base de datos en Supabase
 */
export interface Database {
  public: {
    Tables: {
      invitations: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          package_type: string;
          config: any;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          public_url: string | null;
          payment_info: any | null;
        };
        Insert: {
          id: string;
          user_id: string;
          status: string;
          package_type: string;
          config: any;
          created_at: string;
          updated_at: string;
          published_at?: string | null;
          public_url?: string | null;
          payment_info?: any | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
          package_type?: string;
          config?: any;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          public_url?: string | null;
          payment_info?: any | null;
        };
      };
      
      guest_rsvps: {
        Row: {
          id: string;
          invitation_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          attending: boolean;
          number_of_guests: number;
          message: string | null;
          dietary_restrictions: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          invitation_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          attending: boolean;
          number_of_guests: number;
          message?: string | null;
          dietary_restrictions?: string | null;
          created_at: string;
        };
        Update: {
          id?: string;
          invitation_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          attending?: boolean;
          number_of_guests?: number;
          message?: string | null;
          dietary_restrictions?: string | null;
          created_at?: string;
        };
      };
      
      invitation_views: {
        Row: {
          id: string;
          invitation_id: string;
          visitor_id: string;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          visitor_id: string;
          viewed_at: string;
        };
        Update: {
          id?: string;
          invitation_id?: string;
          visitor_id?: string;
          viewed_at?: string;
        };
      };
      
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
        };
      };
    };
    
    Views: {
      [_ in never]: never;
    };
    
    Functions: {
      [_ in never]: never;
    };
  };
} 