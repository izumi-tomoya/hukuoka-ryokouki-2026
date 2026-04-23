# Fukuoka Trip 2026 - AI Guide

## Build & Development

- **Dev Server**: `bun dev`
- **Build**: `bun run build`
- **Lint**: `bun run lint`
- **Package Management**: `bun install`, `bun add <pkg>`

## Architecture & Principles

- **Next.js 16 (App Router)**: Use Server Components by default. Keep Client Components isolated in `client/` directories or specifically for interactivity.
- **Server-Side First**: Prefer `cookies()` and Server Actions over `localStorage` and `useEffect` for state management to avoid hydration mismatches and improve performance.
- **Secret Mode**: Managed via `secret_mode` cookie. Read this in Server Components to conditionally render content.
- **No Hard-coding**: All shared constants (cookie names, nav items, day configs, stats) MUST be placed in `src/config/constants.ts`.
- planモードで設計を出してから実装書いてね

## UI & Design Standards (Premium Aesthetic)

- **Visual Goal**: "Premium & State of the Art". Avoid generic designs.
- **Gradients**: Use mesh gradients and sophisticated color transitions.
- **Glassmorphism**: Use `backdrop-blur-xl`, translucent backgrounds (`bg-white/70`), and subtle white borders.
- **Shadows**: Use large, soft shadows (`shadow-2xl shadow-slate-200/50`).
- **Icons**: Use `lucide-react` for UI elements.
- **Typography**: Combine `Playfair Display` (Italic for accent) and `Noto Sans JP`.
- **Mobile First**: Optimized for a max-width of `max-w-md` (centered mobile view).

## Common Patterns

- **Conditional Rendering**: Handle server/client state differences using cookies to ensure consistent HTML.
- **Icons Mapping**: Use an `iconMap` for dynamic icon rendering in navigation or lists.
- **Safety**: Use `suppressHydrationWarning` on elements that might be modified by browser extensions (like links with targets).
