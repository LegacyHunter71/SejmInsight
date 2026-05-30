# SejmInsight

Aplikacja do analizy głosowań i aktywności posłów Sejmu RP.

## Stack

| Warstwa | Technologia |
|---------|-------------|
| Backend | Spring Boot 3, Java 21, Maven (multi-moduł) |
| Frontend | React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS 4 |
| Baza danych | PostgreSQL 15 + Flyway |
| Autentykacja | Keycloak 22 (OAuth2 / JWT) |
| Infrastruktura | Docker Compose, nginx-proxy-manager |

---

## Wymagania

- Java 21
- Maven 3.9+
- Node.js 22+ i npm
- Docker Desktop (lub Docker Engine + Compose plugin)

---

## Uruchomienie lokalne

### 1. Infrastruktura (Docker)

```bash
docker compose up -d postgres keycloak
```

> Uruchamia tylko PostgreSQL i Keycloak — bez nginx-proxy-manager i innych serwisów produkcyjnych.

Keycloak będzie dostępny pod `http://localhost:8080`. Wymaga to tymczasowego dodania mapowania portu do `docker-compose.yml`:

```yaml
keycloak:
  ports:
    - "8180:8080"   # dodaj lokalnie, nie commituj
```

Po tej zmianie Keycloak dostępny jest pod `http://localhost:8180/auth`.

Panel admina Keycloak: `http://localhost:8180/auth/admin`

### 2. Konfiguracja Keycloak (pierwsze uruchomienie)

1. Zaloguj się do panelu admina (`KC_ADMIN_USER` / `KC_ADMIN_PASS` z `.env`)
2. Utwórz realm: `parliament-realm`
3. Utwórz klienta publicznego: `parliament-client`
   - Client authentication: **Off**
   - Valid redirect URIs: `http://localhost:5173/*`
   - Web origins: `http://localhost:5173`
4. Utwórz klienta poufnego: `parliament-admin-client`
   - Client authentication: **On**
   - Service accounts enabled: **On**
   - Rola serwisowa: `realm-admin`
5. Skopiuj `Client Secret` z `parliament-admin-client` → potrzebny w konfiguracji backendu

### 3. Backend

```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run -pl app
```

Zmienne środowiskowe wymagane lokalnie (można ustawić przez `application-local.yml` lub zmienne systemowe):

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=parliament_db
DB_USER=sejm_user
DB_PASS=<hasło z docker-compose>
KC_SERVER_URL=http://localhost:8180/auth
KC_ISSUER_URL=http://localhost:8180/auth/realms/parliament-realm
KC_REALM=parliament-realm
KC_ADMIN_CLIENT_ID=parliament-admin-client
KC_ADMIN_CLIENT_SECRET=<secret z Keycloak>
```

Backend startuje na `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`

> **Uwaga:** lokalnie backend działa bez prefiksu `/api` — dodawany jest tylko w produkcji przez zmienną `SERVER_SERVLET_CONTEXT_PATH=/api`.

### 4. Frontend

```bash
cd frontend
npm install
```

Utwórz plik `frontend/.env.local` (nadpisuje `.env`):

```env
VITE_KEYCLOAK_URL=http://localhost:8180/auth
VITE_KEYCLOAK_REALM=parliament-realm
VITE_KEYCLOAK_CLIENT_ID=parliament-client
VITE_API_BASE_URL=http://localhost:8080
```

Uruchom serwer deweloperski:

```bash
npm run dev
```

Frontend dostępny pod `http://localhost:5173`.

#### Tylko frontend (bez lokalnego backendu)

Jeśli chcesz rozwijać sam frontend korzystając z deploymentu produkcyjnego, użyj `.env` bez zmian — wskazuje na `https://sejm-insight.duckdns.org`.

---

## Generowanie typów API

Po zmianie kontraktu API (np. po dodaniu endpointu) zaktualizuj `api-docs.json` i wygeneruj typy TypeScript:

```bash
# Pobierz świeży api-docs.json z działającego backendu
curl http://localhost:8080/v3/api-docs -o frontend/api-docs.json

# Wygeneruj typy
cd frontend
npm run generate:api
```

---

## Struktura projektu

```
sejm-insight/
├── backend/
│   ├── app/        # Entry point, kontrolery REST, konfiguracja security
│   ├── core/       # Logika domenowa, fasady, encje, repozytoria
│   └── sync/       # Synchronizacja danych z api.sejm.gov.pl
├── frontend/
│   ├── src/
│   │   ├── api/        # Klient HTTP + endpointy
│   │   ├── auth/       # Integracja z Keycloak
│   │   ├── components/ # Komponenty UI
│   │   ├── hooks/      # React Query hooks
│   │   └── routes/     # Strony (TanStack Router)
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── SejmInsight_theme.jar   # Motyw Keycloak
```

---

## Komendy Maven (z katalogu `backend/`)

```bash
# Budowanie bez testów
mvn clean package -DskipTests

# Budowanie z testami
mvn clean verify

# Uruchomienie konkretnego testu
mvn test -pl <moduł> -Dtest=NazwaKlasy

# Uruchomienie aplikacji
mvn spring-boot:run -pl app
```

---

## Deployment

Deployment odbywa się automatycznie przez GitHub Actions przy pushu na branch `test`.

Pipeline:
1. Buduje backend (Maven) i pushuje obraz do GHCR
2. Buduje frontend (Node + nginx) i pushuje obraz do GHCR
3. Kopiuje `docker-compose.yml` i `SejmInsight_theme.jar` na VPS
4. Uruchamia `docker compose up -d --force-recreate` na VPS

Wymagane GitHub Secrets i Variables — patrz `.github/workflows/deploy.yml`.
