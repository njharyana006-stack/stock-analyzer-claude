
# Change Log: SmartStock AI Pro Terminal

All notable changes to this project will be documented in this file for future engineering reference.

## [Rev 06] - Smart Caching & Persistence (Current)
### Optimized
- **Dashboard Caching**: Implemented `localStorage` persistence for dashboard and news data. Data now remains stable on cards across reloads.
- **3 AM Daily Reset**: Added logic to invalidate cache only after 3:00 AM daily (post-market close processing time), reducing API calls while keeping data daily-fresh.
- **Persistent Widgets**: Widget layout configuration is now saved to local storage.

---

## [Rev 05] - AI Output Resilience & Payload Optimization
### Fixed
- **Unterminated JSON Strings**: Resolved "Unterminated string" parsing errors caused by truncated AI responses.
- **Robust JSON Extraction**: Updated `utils.ts` with a recursive JSON repair engine.
- **Payload Bloat**: Optimized schemas and prompts to strictly limit large data arrays.

---

## [Rev 04] - Portfolio Intelligence & Reliability Update
### Fixed
- **Strategy & Portfolio Failure**: Fixed a critical issue where `analyzeUserPortfolio` was returning unstructured text.
- **Generator UI Robustness**: Added defensive null-checks in `ProfileGeneratorPage.tsx`.

---

## [Rev 03] - Multi-Source Data & Performance Optimization
### Optimized
- **Parallel Data Pipeline**: Implemented `Promise.all` in `getDashboardPageData`.
- **Commodity Sourcing**: Shifted primary metals data from GoldAPI to AlphaVantage.

---

## [Rev 02] - Core AI Enhancements & Institutional Branding
### Added
- **Institutional Persona**: Re-branded as "Quad-Factor Chief Investment Strategist."
- **Deep Analysis Schema**: Implemented `ANALYSIS_SCHEMA` with Gemini 3 Pro.

---

## [Rev 01] - Initial Architectural Implementation
### Core Features
- **Bento Grid Dashboard**: Real-time index tracking and market snapshots.
- **Deep Analysis Engine**: Integration with Gemini 1.5/3 Flash.
