# AGENT.md

# Sticker Trading Platform — AI Agent Context

## Project Overview

This project is a modern social platform focused initially on the FIFA World Cup 2026 sticker album ecosystem.

The platform allows users to:
- upload sticker/card posts,
- find nearby collectors,
- search for specific players/cards,
- explore a visual marketplace-style feed,
- interact with collectors nearby,
- coordinate trades.

The application should feel:
- social,
- visual,
- alive,
- community-driven,
- mobile-first,
- modern.

This is NOT a corporate dashboard application.

The experience should resemble a mix of:
- Facebook Marketplace,
- Etsy,
- social feeds,
- collector communities,
- map-based discovery apps.

---

# Core Product Philosophy

The emotional aspect of collecting is important.

Users should feel:
- excitement,
- discovery,
- nostalgia,
- community,
- local interaction.

The platform must prioritize:
1. UX
2. Simplicity
3. Visual appeal
4. Fast interactions
5. Mobile experience
6. Community feeling

Avoid overengineering.

This is a startup-style MVP.

---

# Tech Stack

## Core Stack

- Next.js (App Router)
- TypeScript
- Supabase
- PostgreSQL
- TailwindCSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod

---

# Backend Philosophy

There is NO separate backend.

The entire application must live inside the Next.js project.

Use:
- Server Components when possible
- Server Actions when appropriate
- Route Handlers only if needed

Avoid unnecessary API layers.

---

# Database

Use Supabase PostgreSQL.

Features used:
- Auth
- Database
- Storage
- Realtime
- RLS

---

# Authentication

Use Supabase Auth.

Supported methods:
- Google
- Email/password
- Magic links (optional later)

---

# Architecture Rules

## Feature-Based Architecture

The project MUST follow a feature-based architecture.

DO NOT organize code by:
- pages
- random global folders
- large shared logic dumps

Each feature owns:
- components
- hooks
- actions
- services
- types
- schemas
- utilities

---

# Official Folder Structure

```txt
app/

components/
├── ui/
└── shared/

features/
├── auth/
├── cards/
├── search/
├── map/
├── profile/
├── chat/
├── collection/
└── home/

hooks/
providers/
store/
lib/
types/
styles/
```

---

# Feature Structure Standard

The internal structure of a feature is **evolutive**. DO NOT create all folders at once. Create them only as the feature grows and requires them.

Guidelines for when to create subfolders:
- `components/`: When you have 1 or more UI elements specific to this feature.
- `hooks/`: When business logic can be extracted for reuse.
- `actions/`: When you need to interact with the database via Server Actions.
- `services/`: For complex logic that doesn't belong in an action (e.g., third-party APIs).
- `schemas/`: When defining Zod validation for forms or data.
- `types/`: For TypeScript definitions specific to the feature.
- `utils/`: For helper functions used only within this feature.
- `constants/`: For feature-specific configuration or static data.

A simple feature might just look like:
```txt
feature-name/
  my-component.tsx
  use-my-logic.ts
```

---

# Component Rules

## Components must stay small

Avoid giant components.

Split UI into:
- reusable UI primitives,
- business components,
- layout components.

---

## UI Separation

Generic reusable UI belongs in:

```txt
components/ui/
```

Business/domain-specific components belong inside their feature.

Example:

```txt
features/cards/components/card-item.tsx
```

---

# Hooks Rules

Business logic should live in hooks.

Examples:
- useCards
- useNearbyCards
- useSearchCards
- useUploadCard
- useUserProfile

Avoid placing logic directly inside UI components.

---

# State Management Rules

## Use TanStack Query for:
- server state,
- caching,
- fetching,
- infinite scroll,
- mutations.

## Use Zustand for:
- lightweight client state,
- filters,
- UI state,
- modal state,
- temporary app state.

DO NOT use Zustand for server state.

---

# Forms

Use:
- React Hook Form
- Zod

All forms MUST have validation schemas.

---

# UI/UX Guidelines

The application must feel:
- modern,
- premium,
- visual,
- clean,
- dynamic,
- social.

Avoid:
- enterprise dashboard aesthetics,
- boring layouts,
- excessive whitespace,
- overly technical interfaces.

---

# Design Style

Preferred:
- soft shadows,
- rounded corners,
- modern cards,
- smooth transitions,
- subtle glassmorphism,
- responsive layouts,
- clean typography,
- visual hierarchy.

---

# Mobile First

The application is primarily mobile-first.

Design for phones before desktop.

Prioritize:
- touch interactions,
- bottom navigation,
- fast uploads,
- responsive cards,
- smooth scrolling.

---

# Main Product Features

## Public Exploration (No Login Required)

Users can:
- browse cards,
- search cards,
- explore the map,
- view profiles,
- explore nearby trades.

Without authentication.

---

# Authenticated Features

Authenticated users can:
- upload cards,
- chat,
- save collections,
- add contact methods,
- manage profile.

---

# Card Posts

Each post may contain:
- sticker image,
- player name,
- card number,
- country/team,
- album,
- description,
- desired trade,
- user info,
- approximate location.

---

# Map System

The application includes a nearby discovery map.

IMPORTANT:
Never expose exact user coordinates.

Only show:
- approximate area,
- city,
- approximate distance.

---

# Search

Search should support:
- player name,
- sticker number,
- country,
- team,
- album.

Search experience should feel fast and modern.

---

# Chat

Initial chat can be simple.

External contact methods are allowed:
- WhatsApp
- Instagram
- Telegram
- Email

---

# Design System

## Color Palette
- Use a modern, vibrant color palette that reflects the excitement of football and collecting.
- Primary color: A energetic green or blue that stands out.
- Neutral colors: Zinc/Slate for a clean, premium look.
- Success/Error/Warning: Semantic colors with good contrast.

## Typography
- Use clean, sans-serif fonts (e.g., Geist, Inter).
- Establish a clear type hierarchy with varying weights and sizes.
- Use larger headlines for emotional impact.

## Iconography
- Use `lucide-react` for a consistent, modern icon set.
- Icons should be used to provide visual cues and reduce cognitive load.

# Interactive Feedback

## Hover & Active States
- Every interactive element must have a hover and active state.
- Use subtle scale transforms (`hover:scale-[1.02]`) and color shifts.

## Transitions
- Use smooth transitions for all state changes (e.g., `transition-all duration-200`).
- Implement layout animations with Framer Motion if needed for a "living" feel.

## Feedback Mechanisms
- Use Toast notifications for success/error feedback.
- Use skeleton loaders during data fetching to keep the UI stable.
- Implement pull-to-refresh and infinite scroll for a mobile-native feel.

# Performance Rules

Prioritize:
- infinite scrolling,
- lazy loading,
- optimized images,
- skeleton loaders,
- streaming when useful,
- server rendering where appropriate.

Avoid unnecessary client-side rendering.

---

# Image Handling

Use:
- Supabase Storage

Images should be:
- optimized,
- responsive,
- lazy loaded.

---

# Naming Conventions

## Components
PascalCase

Examples:
- CardItem
- NearbyCardsFeed
- UploadCardModal

---

## Hooks
camelCase starting with use

Examples:
- useCards
- useSearchCards
- useNearbyCards

---

## Server Actions
verb + entity

Examples:
- createCardPost
- searchCards
- getNearbyCards

---

## Files
Use kebab-case for files.

Examples:
- card-item.tsx
- upload-card-form.tsx

---

# Coding Standards

## Type Safety
- Always use Zod for runtime validation (Server Actions, API routes, and forms).
- Define shared types in `src/types` or within their respective feature folder.
- Use `type` for simple data structures and `interface` for objects that might be extended.

## Error Handling
- Use a consistent error handling pattern in Server Actions.
- Return an object with `{ data, error }` from services and actions.
- Use Toast notifications for user-facing errors.

## Performance
- Use `next/image` for all images.
- Implement skeleton loaders for all async components.
- Use dynamic imports for large components not needed on initial load.

# Database Schema Guidelines

## Table Naming
- Use snake_case and plural for table names (e.g., `card_posts`, `profiles`).

## Columns
- Use snake_case for column names.
- Always include `id` (uuid), `created_at`, and `updated_at`.

## Relationships
- Use foreign keys with appropriate `ON DELETE` actions.
- Document relationships clearly in the database migrations/scripts.

# Security Rules

Implement:
- Zod validation,
- input sanitization,
- Supabase RLS,
- upload validation,
- auth checks,
- protected mutations.

Never trust client input.

---

# SEO Rules

SEO is important.

Use:
- metadata,
- Open Graph,
- semantic HTML,
- clean URLs,
- SSR where beneficial.

Examples:
- /cards/messi-145
- /users/albin

---

# Future Scalability

The architecture should support future features:
- automatic trade matching,
- notifications,
- advanced realtime,
- reputation systems,
- collection tracking,
- AI features later.

But DO NOT overengineer for them now.

---

# What To Avoid

DO NOT:
- create giant files,
- mix business logic with UI,
- duplicate logic,
- create unnecessary abstractions,
- build premature microservices,
- overuse global state,
- create deeply nested prop chains,
- overcomplicate architecture.

---

# Development Philosophy

Always prioritize:
1. User experience
2. Simplicity
3. Speed of iteration
4. Maintainability
5. Scalability when reasonable

---

# Final Goal

Build the best modern sticker trading community platform for World Cup collectors.

The platform should feel:
- alive,
- social,
- local,
- collectible,
- visual,
- fun,
- community-driven.