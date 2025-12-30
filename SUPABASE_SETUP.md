# Supabase Opsætning

## Trin 1: Opret Supabase Projekt

1. Gå til [supabase.com](https://supabase.com)
2. Log ind eller opret en bruger
3. Klik "New Project"
4. Vælg et navn til projektet (f.eks. "jeopardy-quiz")
5. Vælg en database password
6. Vælg en region (Copenhagen hvis tilgængelig)
7. Klik "Create new project"
   JeopardiMf25

## Trin 2: Opret Database Tabeller

1. Når projektet er oprettet, gå til "SQL Editor" i sidebaren
2. Klik "New Query"
3. Kopier og indsæt denne SQL:

```sql
-- Opret quizzes tabel
CREATE TABLE quizzes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Opret categories tabel
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  name text NOT NULL,
  "order" int NOT NULL
);

-- Opret questions tabel
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  text text NOT NULL,
  answer text NOT NULL,
  points int NOT NULL,
  media_type text,
  media_url text,
  "order" int NOT NULL
);

-- Tilføj indexes for bedre performance
CREATE INDEX idx_categories_quiz_id ON categories(quiz_id);
CREATE INDEX idx_questions_category_id ON questions(category_id);
```

4. Klik "Run" for at oprette tabellerne

## Trin 3: Hent API Nøgler

1. Gå til "Settings" → "API" i sidebaren
2. Find "Project URL" - dette er din `NEXT_PUBLIC_SUPABASE_URL`
3. Find "anon public" API key - dette er din `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Trin 4: Opret Environment Variables

1. Kopier `.env.local.example` til `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Åbn `.env.local` og erstat placeholder værdierne med dine egne:
   ```
   NEXT_PUBLIC_SUPABASE_URL=din-projekt-url-her
   NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key-her
   ```

## Trin 5: Genstart Development Server

Hvis din dev server kører, genstart den for at indlæse de nye environment variables:

```bash
# Stop serveren (Ctrl+C)
# Start den igen
npm run dev
```

## Test Funktionaliteten

1. Opret nogle kategorier og spørgsmål i din quiz
2. Klik "Gem Quiz" og indtast en titel
3. Gå til Supabase dashboard → "Table Editor" for at se din gemte data
4. Klik "Indlæs Quiz" for at hente din gemte quiz

## Troubleshooting

**Problem:** "Failed to save quiz" eller connection errors

- **Løsning:** Check at dine environment variables er korrekte
- Genstart development serveren efter at have ændret `.env.local`

**Problem:** "RLS Policy Error"

- **Løsning:** Hvis du får RLS (Row Level Security) fejl, kør denne SQL i Supabase SQL Editor:

```sql
-- Deaktiver RLS for development (IKKE anbefalet til produktion)
ALTER TABLE quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
```

For produktion brug, bør du sætte op ordentlige RLS policies baseret på authentication.
