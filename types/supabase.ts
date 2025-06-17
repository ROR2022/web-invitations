export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          html: string
          css: string | null
          js: string | null
          config: Json | null
          created_at: string
          updated_at: string
          user_id: string | null
          is_public: boolean | null
          event_type: string | null
          thumbnail: string | null
          category: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          html: string
          css?: string | null
          js?: string | null
          config?: Json | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
          is_public?: boolean | null
          event_type?: string | null
          thumbnail?: string | null
          category?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          html?: string
          css?: string | null
          js?: string | null
          config?: Json | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
          is_public?: boolean | null
          event_type?: string | null
          thumbnail?: string | null
          category?: string | null
        }
      }
      invitations: {
        Row: {
          id: string
          user_id: string
          template_id: string
          name: string
          slug: string
          config: Json | null
          html: string | null
          css: string | null
          js: string | null
          status: string
          created_at: string
          updated_at: string
          package_type: string | null
          payment_status: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          name: string
          slug: string
          config?: Json | null
          html?: string | null
          css?: string | null
          js?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          package_type?: string | null
          payment_status?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          name?: string
          slug?: string
          config?: Json | null
          html?: string | null
          css?: string | null
          js?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          package_type?: string | null
          payment_status?: string | null
          expires_at?: string | null
        }
      }
      packages: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          features: Json | null
          stripe_price_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          features?: Json | null
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          features?: Json | null
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
