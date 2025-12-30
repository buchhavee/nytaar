"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Category, Player, Question } from "@/types/game";
import GameBoard from "@/components/GameBoard";
import PlayerList from "@/components/PlayerList";
import QuestionModal from "@/components/QuestionModal";
import CategoryModal from "@/components/CategoryModal";
import QuizManager from "@/components/QuizManager";
import { Plus } from "lucide-react";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Eksempel Kategori",
      questions: Array(5)
        .fill(null)
        .map((_, i) => ({
          id: `q-1-${i}`,
          text: "Eksempel spørgsmål",
          answer: "Eksempel svar",
          answered: false,
        })),
    },
  ]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: Question;
    pointValue: number;
    categoryId: string;
    questionIndex: number;
  } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  // Player Management
  const handleAddPlayer = () => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: `Spiller ${players.length + 1}`,
      score: 0,
    };
    setPlayers([...players, newPlayer]);
  };

  const handleRemovePlayer = (playerId: string) => {
    setPlayers(players.filter((p) => p.id !== playerId));
  };

  const handleUpdatePlayerName = (playerId: string, name: string) => {
    setPlayers(players.map((p) => (p.id === playerId ? { ...p, name } : p)));
  };

  const handleAwardPoints = (playerId: string, points: number) => {
    setPlayers(players.map((p) => (p.id === playerId ? { ...p, score: p.score + points } : p)));

    if (currentQuestion) {
      setCategories(
        categories.map((cat) =>
          cat.id === currentQuestion.categoryId
            ? {
                ...cat,
                questions: cat.questions.map((q, i) => (i === currentQuestion.questionIndex ? { ...q, answered: true } : q)),
              }
            : cat
        )
      );
    }
  };

  // Question Management
  const handleQuestionClick = (categoryId: string, questionIndex: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const question = category.questions[questionIndex];
    const pointValue = (questionIndex + 1) * 100;

    setCurrentQuestion({ question, pointValue, categoryId, questionIndex });
  };

  // Category Management
  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Er du sikker på at du vil slette denne kategori?")) {
      setCategories(categories.filter((c) => c.id !== categoryId));
    }
  };

  const handleSaveCategory = (categoryData: Omit<Category, "id">) => {
    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...categoryData, id: c.id } : c)));
    } else {
      const newCategory: Category = {
        ...categoryData,
        id: Date.now().toString(),
      };
      setCategories([...categories, newCategory]);
    }
  };

  const handleLoadQuiz = (loadedCategories: Category[]) => {
    setCategories(loadedCategories);
    setPlayers([]);
  };

  return (
    <div className="h-screen animated-gradient-bg overflow-hidden flex flex-col relative">
      {/* Animated blob background */}
      <div className="container pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="text-center py-3 shrink-0">
          <h1 className="text-4xl md:text-5xl font-bold jeopardy-logo mb-2">🎆🎉NYTÅRS JEOPARDY🍾🎊</h1>
          <div className="flex items-center justify-center gap-3">
            <button onClick={handleAddCategory} className="bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 backdrop-blur-xl rounded-xl px-6 py-2.5 border border-purple-500/50 text-white text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] inline-flex items-center gap-2 shadow-lg">
              <Plus size={16} />
              Tilføj kategori
            </button>
            <QuizManager categories={categories} onLoadQuiz={handleLoadQuiz} />
          </div>
        </div>

        {/* Game Board */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <GameBoard categories={categories} onQuestionClick={handleQuestionClick} onEditCategory={handleEditCategory} onDeleteCategory={handleDeleteCategory} />
        </div>

        {/* Player List */}
        <div className="flex-shrink-0 pb-3">
          <PlayerList players={players} onAddPlayer={handleAddPlayer} onRemovePlayer={handleRemovePlayer} onUpdateScore={handleAwardPoints} onUpdateName={handleUpdatePlayerName} />
        </div>
      </div>

      {/* Question Modal */}
      <AnimatePresence>{currentQuestion && <QuestionModal key={currentQuestion.question.id} question={currentQuestion.question} pointValue={currentQuestion.pointValue} players={players} onClose={() => setCurrentQuestion(null)} onAwardPoints={handleAwardPoints} />}</AnimatePresence>

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(undefined);
          }}
        />
      )}
    </div>
  );
}
