### Learn Testing Framework For a Standard Node &amp; Pg Projects

### How To Get Started

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

Spin up development database

```bash
docker compose up -d
```

Install the dependencies

```bash
npm install
```

Run the migrations

```bash
DATABASE_URL=$DATABASE_URL npm run migrate up
```

Start the development server

```bash
npm run dev
```

Create the test database

```bash
docker exec -it <container-name> psql -U <postgres-user>

CREATE DATABASE <test-database-name>

\q
```

Run unit test

```bash
npm run test
```
