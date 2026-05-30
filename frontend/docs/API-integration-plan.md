# Plan integracji API i kroki do dodania w projekcie

Poniżej znajdziesz zwięzły i czytelny plan (po polsku) z konkretnymi plikami, poleceniami i rekomendowanymi bibliotekami. Ten dokument opisuje resztę prac które warto wykonać po dodaniu centralnego klienta `src/api/client.ts`.

## Cel
- Utrzymać typowany, bezpieczny i wygodny dostęp do API (zgodnego z `api-docs.json`) z frontendu.
- Automatycznie generować typy, centralizować logikę HTTP, dodać hooki z cache (React Query), walidację runtime i mocki do rozwoju/testów.

## Główne artefakty do dodania

- `src/generated/api-types.ts`
  - Wygenerowane typy OpenAPI (openapi-typescript).
  - Skrypt: `npm run generate:api` (już dodany w `package.json`).

- `src/api/deputies.ts`, `src/api/comments.ts`, `src/api/iam.ts`
  - Typowane funkcje serwisowe korzystające z `api` (z `src/api/client.ts`) i z `src/generated/api-types.ts`.
  - Przykład API: `getDeputies(params): Promise<PageDeputyListItemDto>`.

- `src/hooks/useDeputies.ts`, `src/hooks/useComments.ts`
  - Hooki React Query (`@tanstack/react-query`) eksponujące fetch/refresh, statusy i operacje mutacji (optimistic updates dla like/comment).

- `src/utils/pagination.ts`
  - Helper do serializacji `Pageable` (page, size, sort) do querystring.

- `src/mocks/` (MSW)
  - `src/mocks/handlers.ts`
  - `src/mocks/browser.ts`
  - Integracja w `src/main.tsx` dla trybu development.

- Testy
  - `vitest` + `@testing-library/react` + `msw` dla testów hooków i komponentów.

## Rekomendowane biblioteki

- openapi-typescript (dev) — generowanie TS typów
- @tanstack/react-query — fetching + cache + mutations
- zod (opcjonalnie) — runtime validation schem
- msw (dev) — mocki API do developmentu i testów
- vitest + @testing-library/react (dev) — testy

## Przykładowe polecenia (zsh)

Instalacja (jeśli nie zainstalowano jeszcze):

```bash
npm install --save-dev openapi-typescript msw vitest @testing-library/react @testing-library/jest-dom
npm install @tanstack/react-query zod
```

Generowanie typów z OpenAPI:

```bash
npx openapi-typescript api-docs.json --output src/generated/api-types.ts
```

Uruchamianie testów (przykład):

```bash
npm run test
```

## Wzorzec implementacji serwisu (szybkie wskazówki)

- Każdy serwis eksportuje czyste funkcje: `getDeputies`, `getDeputyVotings`, `getComments`, `addComment`, `toggleLike`.
- Funkcje używają `api.get/post/...` z `src/api/client.ts` i typów z `src/generated/api-types.ts`.
- Hooki React Query tworzą klucze typu `['deputies', params]`, `['comments', deputyId, term, proceedingNo, votingNo]`.

## Walidacja i bezpieczeństwo typów

- Zaimplementuj Zod dla kluczowych odpowiedzi (CommentDto, VotingDto). Można mieć funkcję `validateResponse(schema, data)` która rzuca błąd jeśli schemat nie pasuje.
- Walidacja powinna być opt-in dla krytycznych miejsc; nie ma potrzeby walidować absolutnie każdego endpointu od razu.

## Mocki i testy

- Użyj MSW do mockowania endpointów podczas developmentu i w testach. Przygotuj przykładowy handler dla `GET /deputies` i `GET /deputies/{id}/votings`.
- Napisz testy dla hooków: sprawdź że hook poprawnie parsuje dane, obsługuje loading/error, i że mutacje wykonują `invalidateQueries` po sukcesie.

## CI / pre-commit

- W CI dodaj krok: `npm run generate:api && git diff --quiet -- src/generated/api-types.ts` żeby upewnić się, że wygenerowane typy są commited.
- Opcjonalnie dodaj husky hook pre-commit, który uruchomi `npm run generate:api` (może być ciężkie w CI; lepiej mieć check w CI niż generować w hooku jeśli to wolne).

## Priorytety (co zrobić najpierw)

1. Wygenerować `src/generated/api-types.ts` — pozwala pisać typowane serwisy.
2. Dodać typowane serwisy `comments` i `deputies` (po jednym pliku każdego rodzaju).
3. Dodać React Query i napisać hooki dla powyższych serwisów.
4. Dodać proste MSW handlers dla rozwoju; napisać 2–3 testy dla hooków.
5. Dodać optional `zod` walidację gdzie krytyczne.

## Przykładowe pliki które mogę teraz utworzyć (jeśli chcesz że zadziałam dalej)

- `src/generated/api-types.ts` (uruchomić generator)
- `src/api/comments.ts` (funkcje: `getComments`, `addComment`, `addReply`, `toggleLike`, `deleteComment`)
- `src/hooks/useComments.ts` (React Query hook z mutacjami)
- `src/mocks/handlers.ts` (prosty handler GET/POST comments)

## Uwagi końcowe

- Wszystkie polecenia i pliki są zgodne z dotychczasową strukturą projektu.
- Jeśli chcesz mogę teraz: A) uruchomić generator typów, B) dodać `src/api/comments.ts` + hooki, C) skonfigurować MSW i przykładowy test — wybierz opcję.
