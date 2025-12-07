export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          duration_minutes: number
          mode: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          duration_minutes: number
          mode: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          duration_minutes?: number
          mode?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          completed?: boolean
          completed_at?: string | null
        }
        Relationships: []
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
