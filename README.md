# Nytårsjeopardy

**Nytårsjeopardy** er et webbaseret quizspil inspireret af klassisk Jeopardy, hvor brugere kan oprette, gemme og afspille deres egne Jeopardy-quizzer – perfekt til f.eks. nytårsaften eller andre festlige lejligheder!

> Live-demo: [https://nytaarsjeopardy.vercel.app](https://nytaarsjeopardy.vercel.app)

---

## Features

- Opret og administrér dine egne Jeopardy-quizzer
- Understøttelse af flere kategorier og spørgsmål med point
- Gem, hent og redigér quizzer via Supabase (gratis open source backend)
- Kan håndtere spørgsmål med tekst, billeder eller andre medier
- Moderne Next.js/TypeScript stack

---

## Kom hurtigt i gang

1. **Klon repoet**  
   ```bash
   git clone https://github.com/buchhavee/nytaar.git
   cd nytaar
   npm install
   ```

2. **Konfigurer Supabase**
   - Opret en [Supabase](https://supabase.com) konto og et nyt projekt
   - Opret de nødvendige tabeller (se nedenfor)
   - Find din `NEXT_PUBLIC_SUPABASE_URL` og `NEXT_PUBLIC_SUPABASE_ANON_KEY` under "Settings" → "API"
   - Kopiér `.env.local.example` til `.env.local` og indsæt dine Supabase oplysninger

3. **Start udviklingsserver**
   ```bash
   npm run dev
   ```

---

## Supabase Setup

Projektet bruger Supabase som backend til lagring af quizzes, kategorier og spørgsmål.

### Database struktur

Opret følgende tabeller i Supabase via SQL Editor:

```sql
-- quizzes
CREATE TABLE quizzes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- categories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  name text NOT NULL,
  "order" int NOT NULL
);

-- questions
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
```
**Indsæt derefter dine Supabase API credentials i `.env.local`.**

Se evt. detaljer og troubleshooting i [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md).

---

## Projektstruktur

- `app/` & `components/` – Next.js applikation og UI-komponenter
- `lib/` – Diverse hjælpefunktioner og API-klienter, herunder Supabase-integration
- `types/` – TypeScript typer til quiz-data
- `public/` – Statisk indhold (fx billeder)
- `SUPABASE_SETUP.md` – Komplet trin-for-trin guide til Supabase opsætning

---

## Teknologier

- [Next.js](https://nextjs.org/) & [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/) (deploy-platform)

---

## Licens

Dette projekt har ingen eksplicit licens. Kontakt forfatteren for detaljer.

---

## Tak

Tak for at bruge Nytårsjeopardy! For spørgsmål, fejl eller ønsker, lav gerne en issue eller PR.
