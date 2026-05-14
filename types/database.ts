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
          trajectory: string
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
          trajectory?: string
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
          trajectory?: string
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
      activity_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          created_at: string
          type: 'workout' | 'learning' | 'build' | 'discipline' | 'journal'
          value: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          created_at?: string
          type: 'workout' | 'learning' | 'build' | 'discipline' | 'journal'
          value?: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          created_at?: string
          type?: 'workout' | 'learning' | 'build' | 'discipline' | 'journal'
          value?: number
          metadata?: Json | null
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          created_at: string
          type: 'daily' | 'weekly_review'
          content: Json
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          created_at?: string
          type: 'daily' | 'weekly_review'
          content: Json
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          created_at?: string
          type?: 'daily' | 'weekly_review'
          content?: Json
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          timeframe: '5_year' | '1_year' | 'quarterly' | 'monthly' | 'weekly'
          status: 'not_started' | 'in_progress' | 'completed' | 'dropped'
          parent_goal_id: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          timeframe: '5_year' | '1_year' | 'quarterly' | 'monthly' | 'weekly'
          status?: 'not_started' | 'in_progress' | 'completed' | 'dropped'
          parent_goal_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          timeframe?: '5_year' | '1_year' | 'quarterly' | 'monthly' | 'weekly'
          status?: 'not_started' | 'in_progress' | 'completed' | 'dropped'
          parent_goal_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: string
          repository_url: string | null
          launch_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: string
          repository_url?: string | null
          launch_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: string
          repository_url?: string | null
          launch_date?: string | null
          created_at?: string
        }
      }
      learning_topics: {
        Row: {
          id: string
          user_id: string
          title: string
          type: 'book' | 'course' | 'dsa' | 'concept'
          status: string
          progress: number
          target: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: 'book' | 'course' | 'dsa' | 'concept'
          status?: string
          progress?: number
          target?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: 'book' | 'course' | 'dsa' | 'concept'
          status?: string
          progress?: number
          target?: number
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          muscle_group: string
          equipment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          muscle_group: string
          equipment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          muscle_group?: string
          equipment?: string | null
          created_at?: string
        }
      }
      routines: {
        Row: {
          id: string
          user_id: string
          name: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          notes?: string | null
          created_at?: string
        }
      }
      workout_sessions: {
        Row: {
          id: string
          user_id: string
          routine_id: string | null
          name: string
          start_time: string
          end_time: string | null
          volume: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          routine_id?: string | null
          name: string
          start_time?: string
          end_time?: string | null
          volume?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          routine_id?: string | null
          name?: string
          start_time?: string
          end_time?: string | null
          volume?: number | null
          created_at?: string
        }
      }
      workout_sets: {
        Row: {
          id: string
          session_id: string
          exercise_id: string
          set_number: number
          reps: number | null
          weight: number | null
          rpe: number | null
          is_warmup: boolean | null
          completed: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          exercise_id: string
          set_number: number
          reps?: number | null
          weight?: number | null
          rpe?: number | null
          is_warmup?: boolean | null
          completed?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          exercise_id?: string
          set_number?: number
          reps?: number | null
          weight?: number | null
          rpe?: number | null
          is_warmup?: boolean | null
          completed?: boolean | null
          created_at?: string
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
