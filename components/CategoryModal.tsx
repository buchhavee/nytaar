"use client";

import { Category } from "@/types/game";
import { X } from "lucide-react";
import { motion } from "framer-motion";
// framer-motion v10 typings can be strict in some TS configs; alias to `any` for JSX usage
const MotionDiv: any = motion.div;
const MotionButton: any = motion.button;
import { useState } from "react";

interface CategoryModalProps {
  category?: Category;
  onSave: (category: Omit<Category, "id">) => void;
  onClose: () => void;
}

export default function CategoryModal({ category, onSave, onClose }: CategoryModalProps) {
  const [name, setName] = useState(category?.name || "");
  const [questions, setQuestions] = useState(
    category?.questions ||
      Array(5)
        .fill(null)
        .map((_, i) => ({
          id: `q-${i}`,
          text: "",
          answer: "",
          answered: false,
          mediaType: undefined,
          mediaUrl: undefined,
        }))
  );

  type QuestionField = "text" | "answer" | "mediaType" | "mediaUrl";

  const handleQuestionChange = (index: number, field: QuestionField, value: string | undefined) => {
    const updated = [...questions];
    const current = updated[index];
    updated[index] = { ...current, [field]: value } as typeof current;
    setQuestions(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Indtast venligst et kategorinavn");
      return;
    }
    onSave({ name, questions });
    onClose();
  };

  const pointValues = [100, 200, 300, 400, 500];

  return (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.16 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <MotionDiv initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.18 }} className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.3)] max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <h2 className="text-2xl font-bold text-white">{category ? "Rediger kategori" : "Ny kategori"}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Category Name */}
          <div>
            <label className="text-white/70 text-sm font-semibold mb-2 block">Kategorinavn</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/[0.05] backdrop-blur-xl rounded-xl p-3 border border-purple-500/20 text-white placeholder-white/30 outline-none focus:border-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all" placeholder="F.eks. Geografi" />
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={index} className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-4 border border-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <div className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 font-bold mb-3">{pointValues[index]} point</div>

                <div className="space-y-3">
                  <div>
                    <label className="text-white/60 text-xs font-semibold mb-1 block">Spørgsmål</label>
                    <input type="text" value={q.text} onChange={(e) => handleQuestionChange(index, "text", e.target.value)} className="w-full bg-white/[0.05] backdrop-blur-xl rounded-lg p-2 border border-purple-500/20 text-white text-sm placeholder-white/25 outline-none focus:border-purple-400 transition-colors" placeholder="Indtast spørgsmål" />
                  </div>

                  <div>
                    <label className="text-white/60 text-xs font-semibold mb-1 block">Svar</label>
                    <input type="text" value={q.answer} onChange={(e) => handleQuestionChange(index, "answer", e.target.value)} className="w-full bg-white/[0.05] backdrop-blur-xl rounded-lg p-2 border border-purple-500/20 text-white text-sm placeholder-white/25 outline-none focus:border-purple-400 transition-colors" placeholder="Indtast svar" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-white/60 text-xs font-semibold mb-1 block">Medietype</label>
                      <select value={q.mediaType || ""} onChange={(e) => handleQuestionChange(index, "mediaType", e.target.value || undefined)} className="w-full bg-white/[0.05] backdrop-blur-xl rounded-lg p-2 border border-purple-500/20 text-white text-sm outline-none focus:border-purple-400 transition-colors">
                        <option value="">Ingen</option>
                        <option value="image">Billede</option>
                        <option value="gif">GIF</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    {q.mediaType && (
                      <div>
                        <label className="text-white/60 text-xs font-semibold mb-1 block">Media URL</label>
                        <input type="text" value={q.mediaUrl || ""} onChange={(e) => handleQuestionChange(index, "mediaUrl", e.target.value)} className="w-full bg-white/[0.05] backdrop-blur-xl rounded-lg p-2 border border-purple-500/20 text-white text-sm placeholder-white/25 outline-none focus:border-purple-400 transition-colors" placeholder="https://..." />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-purple-500/20">
          <MotionButton whileTap={{ scale: 0.98 }} onClick={onClose} className="flex-1 bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-xl rounded-xl p-3 border border-purple-500/20 text-white font-semibold transition-all">
            Annuller
          </MotionButton>
          <MotionButton whileTap={{ scale: 0.98 }} onClick={handleSave} className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 backdrop-blur-xl rounded-xl p-3 border border-purple-500/50 text-white font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            Gem
          </MotionButton>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
}
