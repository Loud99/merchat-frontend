# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Merchat.io — Frontend

## Project
Merchat.io is an AI-powered WhatsApp commerce platform for Nigerian SMEs. This repo is the frontend only.

## Specs
All UI requirements are fully specified in two documents:
- Website (landing page + storefront): specs/merchat_website_spec.md
- Merchant dashboard (onboarding + full dashboard): specs/merchat_dashboard_spec.md

Always read the relevant spec section before building any page or component.

## Tech Stack
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Icons: Lucide React
- Charts: Recharts (analytics page only)
- Language: TypeScript

## Brand Colours
- Primary navy: #182E47
- Accent orange: #D5652B
- Mid navy: #1E3D5C
- Gray text: #6B7280
- Warm tint: #F4EDE8
- Border: #E5E7EB
- Success: #16A34A
- Warning: #D97706
- Danger: #EF4444

## Build Order
1. Project setup (Next.js, Tailwind, TypeScript, folder structure)
2. Design system (base components — Button, Input, Card, Badge)
3. Global layout (Navbar, Footer, Dashboard shell)
4. Landing page
5. Merchant storefront page (/[slug])
6. Login + forgot password pages
7. Onboarding wizard (7 steps)
8. Dashboard — Conversations page
9. Dashboard — Orders page
10. Dashboard — Inventory page
11. Dashboard — Analytics page
12. Dashboard — Settings page

## Key Rules
- Mobile-first. Every page must work on a 375px screen.
- Never invent UI patterns — always follow the spec exactly.
- Show skeleton loaders (not spinners) on all data-fetching pages.
- All destructive actions require a confirmation step.
- Use optimistic UI updates for saves and status changes.
