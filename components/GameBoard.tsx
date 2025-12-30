"use client";

import { useState } from "react";
import { Category } from "@/types/game";
import { motion } from "framer-motion";
const MotionButton: any = motion.button;

interface GameBoardProps {
  categories: Category[];
  onQuestionClick: (categoryId: string, questionIndex: number) => void;
  onEditCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function GameBoard({ categories, onQuestionClick, onEditCategory, onDeleteCategory }: GameBoardProps) {
  const pointValues = [100, 200, 300, 400, 500];
  const maxCategories = 6;
  const displayCategories = categories.slice(0, maxCategories);
  const [animatingCard, setAnimatingCard] = useState<{ categoryId: string; index: number } | null>(null);

  const handleCardClick = (categoryId: string, questionIndex: number) => {
    if (animatingCard) return;
    setAnimatingCard({ categoryId, index: questionIndex });
    // wait for the short animation to play, then call parent handler
    setTimeout(() => {
      setAnimatingCard(null);
      onQuestionClick(categoryId, questionIndex);
    }, 180);
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-4">
      <div className="grid gap-2 max-w-[85vw] max-h-[calc(100vh-300px)]" style={{ gridTemplateColumns: `repeat(${displayCategories.length || 1}, minmax(0, 1fr))` }}>
        {displayCategories.map((category) => (
          <div key={category.id} className="flex flex-col gap-1.5 h-full">
            {/* Category Header */}
            <div className="group relative bg-white/5 backdrop-blur-2xl rounded-xl p-2 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] h-11.25 flex items-center justify-center shrink-0">
              <h3 className="text-white font-semibold text-center text-sm tracking-tight truncate px-1">{category.name}</h3>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                <button onClick={() => onEditCategory(category.id)} className="bg-purple-600/80 hover:bg-purple-500 text-white p-1 rounded text-[10px] backdrop-blur-sm transition-colors shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  ✏️
                </button>
                <button onClick={() => onDeleteCategory(category.id)} className="bg-pink-600/80 hover:bg-pink-500 text-white p-1 rounded text-[10px] backdrop-blur-sm transition-colors shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                  🗑️
                </button>
              </div>
            </div>

            {/* Question Cards */}
            {category.questions.map((question, index) => {
              const isAnimating = animatingCard?.categoryId === category.id && animatingCard?.index === index;
              const otherAnimating = animatingCard && !(animatingCard?.categoryId === category.id && animatingCard?.index === index);
              return (
                <MotionButton
                  key={question.id}
                  onClick={() => handleCardClick(category.id, index)}
                  disabled={question.answered}
                  whileTap={{ scale: 0.97 }}
                  whileHover={question.answered ? {} : { scale: 1.02 }}
                  animate={isAnimating ? { scale: 1.06, opacity: 0.95 } : otherAnimating ? { opacity: 0.45, scale: 0.98 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`
                    w-full aspect-square bg-white/5 backdrop-blur-2xl rounded-xl 
                    border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 max-h-[calc((100vh-300px-45px-12px)/5)]
                    ${question.answered ? "opacity-20 cursor-not-allowed" : "hover:bg-purple-500/10 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:border-purple-400/40 cursor-pointer active:scale-95"}
                  `}
                >
                  <div className="h-full flex items-center justify-center">
                    <span className="font-mono text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-linear-to-br from-purple-400 to-fuchsia-400 tracking-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">{question.answered ? "✓" : pointValues[index]}</span>
                  </div>
                </MotionButton>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
