import { supabase } from "@/lib/supabase";
import { Category } from "@/types/game";

export interface SavedQuiz {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export async function saveQuiz(title: string, categories: Category[]) {
  const client = supabase as any;
  if (!client) {
    return { success: false, error: "Supabase ikke konfigureret" };
  }

  try {
    // Create quiz
    const { data: quiz, error: quizError } = await client.from("quizzes").insert({ title }).select().single();

    if (quizError) throw quizError;

    // Save categories and questions
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];

      const { data: dbCategory, error: categoryError } = await client
        .from("categories")
        .insert({
          quiz_id: quiz.id,
          name: category.name,
          order: i,
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      // Save questions
      const questionsToInsert = category.questions.map((q, idx) => ({
        category_id: dbCategory.id,
        text: q.text,
        answer: q.answer,
        points: (idx + 1) * 100,
        media_type: q.mediaType || null,
        media_url: q.mediaUrl || null,
        order: idx,
      }));

      const { error: questionsError } = await client.from("questions").insert(questionsToInsert);

      if (questionsError) throw questionsError;
    }

    return { success: true, quizId: quiz.id };
  } catch (error) {
    console.error("Error saving quiz:", error);
    const message = (error as any)?.message || JSON.stringify(error) || "Ukendt fejl";
    return { success: false, error: message };
  }
}

export async function loadQuiz(quizId: string): Promise<{ success: boolean; categories?: Category[]; error?: any }> {
  const client = supabase as any;
  if (!client) {
    return { success: false, error: "Supabase ikke konfigureret" };
  }

  try {
    // Load categories
    const { data: categories, error: categoriesError } = await client.from("categories").select("*").eq("quiz_id", quizId).order("order");

    if (categoriesError) throw categoriesError;

    // Load questions for each category
    const cats: any[] = categories as any[];
    const loadedCategories: Category[] = await Promise.all(
      cats.map(async (cat) => {
        const { data: questions, error: questionsError } = await client.from("questions").select("*").eq("category_id", cat.id).order("order");

        if (questionsError) throw questionsError;

        const qs: any[] = questions as any[];

        return {
          id: cat.id,
          name: cat.name,
          questions: qs.map((q) => ({
            id: q.id,
            text: q.text,
            answer: q.answer,
            mediaType: q.media_type as "image" | "video" | "gif" | undefined,
            mediaUrl: q.media_url || undefined,
            answered: false,
          })),
        };
      })
    );

    return { success: true, categories: loadedCategories };
  } catch (error) {
    console.error("Error loading quiz:", error);
    return { success: false, error };
  }
}

export async function getQuizzes(): Promise<SavedQuiz[]> {
  const client = supabase as any;
  if (!client) {
    console.warn("Supabase ikke konfigureret");
    return [];
  }

  try {
    const { data, error } = await client.from("quizzes").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}

export async function deleteQuiz(quizId: string) {
  const client = supabase as any;
  if (!client) {
    return { success: false, error: "Supabase ikke konfigureret" };
  }

  try {
    // Delete will cascade to categories and questions if set up properly
    const { error } = await client.from("quizzes").delete().eq("id", quizId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return { success: false, error };
  }
}
