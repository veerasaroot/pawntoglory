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
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          chesscom_username: string
          created_at: string
          discord_username: string
          id: string
          name: string
          status: string
        }
        Insert: {
          chesscom_username: string
          created_at?: string
          discord_username: string
          id?: string
          name: string
          status?: string
        }
        Update: {
          chesscom_username?: string
          created_at?: string
          discord_username?: string
          id?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      pairings: {
        Row: {
          black_id: string | null
          board_number: number | null
          created_at: string
          id: string
          result: string | null
          round_id: string
          updated_at: string
          white_id: string | null
        }
        Insert: {
          black_id?: string | null
          board_number?: number | null
          created_at?: string
          id?: string
          result?: string | null
          round_id: string
          updated_at?: string
          white_id?: string | null
        }
        Update: {
          black_id?: string | null
          board_number?: number | null
          created_at?: string
          id?: string
          result?: string | null
          round_id?: string
          updated_at?: string
          white_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pairings_black_id_fkey"
            columns: ["black_id"]
            isOneToOne: false
            referencedRelation: "tournament_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pairings_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pairings_white_id_fkey"
            columns: ["white_id"]
            isOneToOne: false
            referencedRelation: "tournament_participants"
            referencedColumns: ["id"]
          }
        ]
      }
      rounds: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          round_number: number
          start_time: string | null
          status: string
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          round_number: number
          start_time?: string | null
          status?: string
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          round_number?: number
          start_time?: string | null
          status?: string
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rounds_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      tournament_participants: {
        Row: {
          created_at: string
          id: string
          participant_id: string
          score: number | null
          seed: number | null
          status: string
          tiebreak_1: number | null
          tiebreak_2: number | null
          tournament_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_id: string
          score?: number | null
          seed?: number | null
          status?: string
          tiebreak_1?: number | null
          tiebreak_2?: number | null
          tournament_id: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_id?: string
          score?: number | null
          seed?: number | null
          status?: string
          tiebreak_1?: number | null
          tiebreak_2?: number | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          registration_deadline: string | null
          start_date: string | null
          status: string
          time_control: string
          total_rounds: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          registration_deadline?: string | null
          start_date?: string | null
          status?: string
          time_control?: string
          total_rounds?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          registration_deadline?: string | null
          start_date?: string | null
          status?: string
          time_control?: string
          total_rounds?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      tournament_standings: {
        Row: {
          buchholz: number | null
          chesscom_username: string | null
          draws: number | null
          games_played: number | null
          losses: number | null
          participant_id: string | null
          participant_name: string | null
          score: number | null
          sonneborn_berger: number | null
          tournament_id: string | null
          tournament_name: string | null
          tournament_participant_id: string | null
          wins: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never