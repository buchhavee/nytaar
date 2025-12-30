"use client";

import { Question, Player } from "@/types/game";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
const MotionDiv: any = motion.div;
const MotionButton: any = motion.button;

interface QuestionModalProps {
  question: Question | null;
  pointValue: number;
  players: Player[];
  onClose: () => void;
  onAwardPoints: (playerId: string, points: number) => void;
}

export default function QuestionModal({ question, pointValue, players, onClose, onAwardPoints }: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
  }, [question]);

  if (!question) return null;

  return (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <MotionDiv initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl border border-purple-500/20 shadow-[0_0_60px_rgba(168,85,247,0.35)] max-w-5xl w-full max-h-[92vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <h2 className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">{pointValue} point</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={32} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Media */}
          {question.mediaUrl && <div className="mb-6 rounded-2xl overflow-hidden bg-black/30">{question.mediaType === "image" || question.mediaType === "gif" ? <img src={question.mediaUrl} alt="Question media" className="w-full max-h-96 object-contain" /> : question.mediaType === "video" ? <video src={question.mediaUrl} controls className="w-full max-h-96" /> : null}</div>}

          {/* Question Text */}
          <div className="text-white text-3xl md:text-4xl font-semibold text-center mb-8">{question.text}</div>

          {/* Show Answer Button */}
          {!showAnswer && (
            <MotionButton whileTap={{ scale: 0.99 }} onClick={() => setShowAnswer(true)} className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/50 text-white font-semibold text-xl transition-all hover:scale-[1.01] shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              Vis svar
            </MotionButton>
          )}

          {/* Answer */}
          {showAnswer && (
            <div className="space-y-6">
              <div className="bg-purple-600/15 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <div className="text-purple-400 text-sm font-semibold mb-2 tracking-wide">SVAR:</div>
                <div className="text-white text-xl md:text-2xl font-semibold">{question.answer}</div>
              </div>

              {/* Award Points to Players */}
              <div className="space-y-3">
                <div className="text-white text-lg font-semibold mb-3">Giv point til:</div>
                <div className="grid grid-cols-2 gap-3">
                  {players.map((player) => (
                    <MotionButton
                      key={player.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onAwardPoints(player.id, pointValue);
                        onClose();
                      }}
                      className="bg-fuchsia-600/15 hover:bg-fuchsia-600/25 backdrop-blur-xl rounded-xl p-4 border border-fuchsia-500/30 text-white font-semibold transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                    >
                      {player.name} (+{pointValue})
                    </MotionButton>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </MotionDiv>
    </MotionDiv>
  );
}
