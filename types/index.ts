export type Participant = {
    id: string;
    name: string;
    discord_username: string;
    chesscom_username: string;
    status: string;
    created_at: string;
  };
  
  export type Tournament = {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    status: string;
    total_rounds: number;
    time_control: string;
    created_at: string;
    updated_at: string;
  };
  
  export type TournamentParticipant = {
    id: string;
    tournament_id: string;
    participant_id: string;
    seed: number | null;
    score: number;
    tiebreak_1: number;
    tiebreak_2: number;
    status: string;
    created_at: string;
  };
  
  export type Round = {
    id: string;
    tournament_id: string;
    round_number: number;
    start_time: string;
    end_time: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
  
  export type Pairing = {
    id: string;
    round_id: string;
    white_id: string;
    black_id: string;
    result: string | null;
    board_number: number;
    created_at: string;
    updated_at: string;
  };
  
  export type AdminUser = {
    id: string;
    email: string;
    created_at: string;
  };
  
  // Type definitions for Supabase
  export type Database = {
    public: {
      Tables: {
        participants: {
          Row: Participant;
          Insert: Omit<Participant, 'id' | 'created_at'> & {
            id?: string;
            created_at?: string;
          };
          Update: Partial<Omit<Participant, 'id' | 'created_at'>>;
        };
        tournaments: {
          Row: Tournament;
          Insert: Omit<Tournament, 'id' | 'created_at' | 'updated_at'> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: Partial<Omit<Tournament, 'id' | 'created_at' | 'updated_at'>>;
        };
        tournament_participants: {
          Row: TournamentParticipant;
          Insert: Omit<TournamentParticipant, 'id' | 'created_at'> & {
            id?: string;
            created_at?: string;
          };
          Update: Partial<Omit<TournamentParticipant, 'id' | 'created_at'>>;
        };
        rounds: {
          Row: Round;
          Insert: Omit<Round, 'id' | 'created_at' | 'updated_at'> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: Partial<Omit<Round, 'id' | 'created_at' | 'updated_at'>>;
        };
        pairings: {
          Row: Pairing;
          Insert: Omit<Pairing, 'id' | 'created_at' | 'updated_at'> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: Partial<Omit<Pairing, 'id' | 'created_at' | 'updated_at'>>;
        };
        admin_users: {
          Row: AdminUser;
          Insert: Omit<AdminUser, 'id' | 'created_at'> & {
            id?: string;
            created_at?: string;
          };
          Update: Partial<Omit<AdminUser, 'id' | 'created_at'>>;
        };
      };
      Views: {
        tournament_standings: {
          Row: {
            tournament_id: string;
            tournament_name: string;
            tournament_participant_id: string;
            participant_id: string;
            participant_name: string;
            chesscom_username: string;
            score: number;
            buchholz: number;
            sonneborn_berger: number;
            games_played: number;
            wins: number;
            draws: number;
            losses: number;
          };
        };
      };
      Functions: {
        [key: string]: unknown;
      };
    };
  };