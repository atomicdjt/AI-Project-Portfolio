# Nexus Play

Nexus Play is a local digital game distribution platform demo built with React, Vite, and Express. It demonstrates product UI thinking, storefront design, catalog interaction, account simulation, checkout flow, wishlist behavior, owned library concepts, and install queue design.

## Project Type

**Runnable MVP**

## Problem

A game platform is a useful portfolio challenge because it requires more than a static landing page. A credible version needs catalog browsing, product detail thinking, user state, commerce simulation, ownership state, and post-purchase library behavior.

## Solution

Nexus Play models a compact digital storefront and player library experience. It focuses on the user journey from discovery to wishlist/cart to simulated checkout to owned library and download queue.

## Key Features

- Storefront with generated hero key art
- Search, genre filters, and sorting
- Product/catalog browsing
- Wishlist
- Cart
- Simulated checkout
- Demo account
- Wallet and rewards concepts
- Owned game library
- Download/install queue
- Production build served by Express

## Tech Stack

- React
- TypeScript
- Vite
- Express
- Zod
- dotenv
- Lucide React
- clsx

## Architecture

```text
apps/nexus-play/
  server/          Express API and demo data serving
  src/             React UI and product flows
  package.json     App scripts and dependencies
```

The project is organized around a storefront-style product flow: browse, evaluate, save, purchase, own, and install. The Express layer provides a local API surface for the demo experience.

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5175/
```

The Express API runs on:

```text
http://127.0.0.1:3003/
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Known Limitations

- Checkout is simulated and does not process real payments.
- Account state is demo-only.
- Catalog data is local/demo-oriented rather than connected to a production database.
- No authentication or real user account system is included.

## Roadmap

1. Add persistent demo accounts.
2. Add admin catalog management.
3. Add richer product-detail pages.
4. Add review/rating flows.
5. Add stronger loading and empty states.
6. Add mock payment success/failure states.
7. Add tests for cart, wishlist, and library logic.

## Portfolio Value

Nexus Play demonstrates product design and frontend implementation across a more complex consumer workflow than a standard CRUD app. It is useful evidence of UI organization, product-state thinking, and platform-style interaction design.
