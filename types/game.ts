export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  answer: string;
  mediaType?: "image" | "video" | "gif";
  mediaUrl?: string;
  answered: boolean;
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
}

export interface GameState {
  categories: Category[];
  players: Player[];
  currentQuestion: Question | null;
}
