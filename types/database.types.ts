export interface Database {
  public: {
    Tables: {
      quizzes: {
        Row: {
          id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          quiz_id: string;
          name: string;
          order: number;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          name: string;
          order: number;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          name?: string;
          order?: number;
        };
      };
      questions: {
        Row: {
          id: string;
          category_id: string;
          text: string;
          answer: string;
          points: number;
          media_type: string | null;
          media_url: string | null;
          order: number;
        };
        Insert: {
          id?: string;
          category_id: string;
          text: string;
          answer: string;
          points: number;
          media_type?: string | null;
          media_url?: string | null;
          order: number;
        };
        Update: {
          id?: string;
          category_id?: string;
          text?: string;
          answer?: string;
          points?: number;
          media_type?: string | null;
          media_url?: string | null;
          order?: number;
        };
      };
    };
  };
}
