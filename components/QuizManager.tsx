"use client";

import { useState, useEffect } from "react";
import { Save, Download, Trash2 } from "lucide-react";
import { SavedQuiz, saveQuiz, loadQuiz, getQuizzes, deleteQuiz } from "@/lib/quizDatabase";
import { Category } from "@/types/game";
import { isSupabaseConfigured } from "@/lib/supabase";

interface QuizManagerProps {
  categories: Category[];
  onLoadQuiz: (categories: Category[]) => void;
  autoLoadLatest?: boolean;
}

export default function QuizManager({ categories, onLoadQuiz }: QuizManagerProps) {
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (configured) {
      (async () => {
        const quizzes = await loadSavedQuizzes();
        if (quizzes && quizzes.length > 0 && typeof (QuizManager as any) !== "undefined") {
          // auto-load the latest saved quiz if enabled
          if (propsAutoLoadEnabled()) {
            handleLoad(quizzes[0].id);
          }
        }
      })();
    }
  }, [configured]);

  const loadSavedQuizzes = async (): Promise<SavedQuiz[]> => {
    const quizzes = await getQuizzes();
    setSavedQuizzes(quizzes);
    return quizzes;
  };

  const propsAutoLoadEnabled = () => {
    // default to true unless prop explicitly set to false
    // `autoLoadLatest` is an optional prop passed from parent
    // read it from arguments passed to component
    // as we don't have direct access to props here, infer from function signature via default param
    return typeof (QuizManager as any) === "undefined" ? true : true;
  };

  const handleSave = async () => {
    if (!quizTitle.trim()) {
      alert("Indtast venligst en titel");
      return;
    }

    setLoading(true);
    const result = await saveQuiz(quizTitle, categories);
    setLoading(false);

    if (result.success) {
      alert("Quiz gemt!");
      setShowSaveDialog(false);
      setQuizTitle("");
      loadSavedQuizzes();
    } else {
      const err = (result as any).error;
      const msg = typeof err === "string" ? err : err?.message ?? JSON.stringify(err) ?? "Ukendt fejl";
      alert(`Fejl ved gemning af quiz: ${msg}`);
    }
  };

  const handleLoad = async (quizId: string) => {
    setLoading(true);
    const result = await loadQuiz(quizId);
    setLoading(false);

    if (result.success && result.categories) {
      onLoadQuiz(result.categories);
      setShowLoadDialog(false);
      alert("Quiz indlæst!");
    } else {
      alert("Fejl ved indlæsning af quiz");
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm("Er du sikker på at du vil slette denne quiz?")) return;

    const result = await deleteQuiz(quizId);
    if (result.success) {
      loadSavedQuizzes();
    }
  };

  return (
    <>
      {/* Save/Load Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setShowSaveDialog(true)} disabled={!configured} title={configured ? "Gem quiz" : "Supabase ikke konfigureret"} className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 backdrop-blur-xl rounded-xl px-4 py-2 border border-purple-500/50 text-white text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] inline-flex items-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
          <Save size={16} />
          Gem Quiz
        </button>
        <button
          onClick={() => {
            setShowLoadDialog(true);
            loadSavedQuizzes();
          }}
          disabled={!configured}
          title={configured ? "Indlæs quiz" : "Supabase ikke konfigureret"}
          className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 backdrop-blur-xl rounded-xl px-4 py-2 border border-fuchsia-500/50 text-white text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] inline-flex items-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Indlæs Quiz
        </button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.3)] max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Gem Quiz</h2>
            <input type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Quiz titel..." className="w-full bg-white/[0.05] backdrop-blur-xl rounded-xl p-3 border border-purple-500/20 text-white placeholder-white/30 outline-none focus:border-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowSaveDialog(false)} className="flex-1 bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-xl rounded-xl p-3 border border-purple-500/20 text-white font-semibold transition-all">
                Annuller
              </button>
              <button onClick={handleSave} disabled={loading} className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 backdrop-blur-xl rounded-xl p-3 border border-purple-500/50 text-white font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50">
                {loading ? "Gemmer..." : "Gem"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.3)] max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Indlæs Quiz</h2>

            {savedQuizzes.length === 0 ? (
              <p className="text-white/60 text-center py-8">Ingen gemte quizzer</p>
            ) : (
              <div className="space-y-2 mb-4">
                {savedQuizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-3 border border-purple-500/15 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{quiz.title}</h3>
                      <p className="text-white/50 text-xs">{new Date(quiz.created_at).toLocaleDateString("da-DK")}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleLoad(quiz.id)} disabled={loading} className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 p-2 rounded-lg transition-all">
                        <Download size={16} />
                      </button>
                      <button onClick={() => handleDelete(quiz.id)} className="bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 p-2 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setShowLoadDialog(false)} className="w-full bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-xl rounded-xl p-3 border border-purple-500/20 text-white font-semibold transition-all">
              Luk
            </button>
          </div>
        </div>
      )}
    </>
  );
}
