# Victory_project
A transaction reconciliation engine that matches records across two independent sources and flags discrepancies — built to explore payments/ops-style infrastructure problems in fintech.

# Reconciliation Engine

A transaction reconciliation system that matches records between two independent sources (e.g., an internal ledger and a bank statement) and flags discrepancies — the kind of "boring but critical" infrastructure problem that underlies payments and operations systems at most financial institutions.

## Why This Project

Reconciliation is a core, unglamorous problem in banking: two systems record the same transactions independently, and someone (or something) has to verify they agree. Mismatches — missing entries, duplicate postings, amount discrepancies, timing lags — have to be caught, classified, and resolved with a clear audit trail. This project builds a simplified version of that matching engine.

## Status

🚧 In progress — currently building out the front end using react

## Planned Features

- CSV/JSON ingestion for two independent transaction sources
- Exact-match reconciliation (reference number, amount, date)
- Fuzzy matching for near-matches (settlement date lag, minor description differences)
- Discrepancy classification (missing record, amount mismatch, duplicate)
- Audit trail for every match (match type, confidence score, timestamp)
- Manual override/match endpoint for human-in-the-loop resolution
- Dashboard for reviewing reconciliation results and discrepancies

## Tech Stack

- **Backend:** Node.js, Express, Sequelize
- **Database:** SQLite (dev) — designed to be swappable to PostgreSQL
- **Frontend:** React, Redux (planned)

## Design Notes

- Monetary values are stored as integers (cents), never floats, to avoid rounding errors
- Match results are stored in a separate `matches` table rather than a boolean flag on each transaction, so every match carries its own type, confidence score, and audit metadata
- Internal and bank transactions are kept in separate tables to reflect how real systems typically receive differently-shaped data from each source

## Getting Started

```bash
cd server
npm install
npm run dev
```

## Project Structure
server/
src/
models/ # Sequelize models
migrations/ # DB schema migrations
routes/ # Express API routes
services/ # Matching/reconciliation logic


## Roadmap

- [x] Schema + Sequelize models
- [x] CSV ingestion endpoint
- [x] Exact-match engine
- [x] Fuzzy-match engine
- [x] Discrepancy classification
- [ ] React dashboard
- [ ] Tests
- [ ] Deployment


## Known Limitations / Future Improvements

- Manual match overrides are trusted completely — there's no validation that the two transactions actually correspond, and no record of who performed the override or why. A production version would log the reviewer's identity and require a reason/note for the audit trail.
- Resolving one side of a discrepancy (e.g., manually matching a `missing_bank` record) doesn't clean up a related discrepancy record on the other side if one exists for the same transaction, which can leave a stale discrepancy row behind.