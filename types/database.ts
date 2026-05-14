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
      profiles: {
        Row: {
          id: string
          momentum_score: number
          current_season: string | null
          timezone: string | null
          // Legacy fields we are keeping for now to avoid breaking existing code
          streak: number
          neetcode_progress: number
          last_completed_date: string | null
          last_reset_date: string | null
          greeting_name: string | null
          tracker_name: string | null
          tracker_target: number
        }
        Insert: {
          id: string
          momentum_score?: number
          current_season?: string | null
          timezone?: string | null
          streak?: number
          neetcode_progress?: number
          last_completed_date?: string | null
          last_reset_date?: string | null
          greeting_name?: string | null
          tracker_name?: string | null
          tracker_target?: number
        }
        Update: {
          id?: string
          momentum_score?: number
          current_season?: string | null
          timezone?: string | null
          streak?: number
          neetcode_progress?: number
          last_completed_date?: string | null
          last_reset_date?: string | null
          greeting_name?: string | null
          tracker_name?: string | null
          tracker_target?: number
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          text: string
          completed: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed?: boolean
          order_index?: number
          created_at?: string
        }
      }
      daily_activity: {
        Row: {
          id: string
          user_id: string
          date: string
          activity_level: number
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          activity_level?: number
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          activity_level?: number
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
  }
}
