# Agent Guidelines for personal-portfolio-lms

This document provides instructions and guidelines for AI agents operating within this codebase.

## 1. Project Overview

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Radix UI, Shadcn/ui-like patterns
- **Animation**: Framer Motion
- **Formatting/Linting**: Biome

## 2. Operational Commands

### Build & Run
- **Install Dependencies**: `bun install`
- **Development Server**: `bun --bun next dev`
- **Production Build**: `bun --bun next build`
- **Start Production**: `bun --bun next start`

### Linting & Formatting
- **Lint Check**: `bun run lint` (runs `biome check`)
- **Format Fix**: `bun run format` (runs `biome format --write`)

### Testing
- **Current Status**: No automated testing framework is currently configured in `package.json`.
- **Note**: Do not attempt to run `npm test` or `bun test` unless you have explicitly set up a test runner.

## 3. Code Style & Conventions

### Imports
- **Aliases**: Always use the `@/` alias for internal imports (e.g., `import { Button } from "@/components/ui/button"`).
- **Grouping**:
  1. "use client" directive (if applicable)
  2. External libraries (React, Next.js, Framer Motion, etc.)
  3. Internal components (`@/components/...`)
  4. Utilities/Hooks/Types (`@/lib/...`, `@/hooks/...`)
  5. Assets/Styles
- **Type**: Prefer named imports for components and hooks.

### Components
- **Structure**: Functional components.
- **Exports**:
  - Use **Named Exports** for reusable components (e.g., `export function Navigation() { ... }`).
  - Use **Default Exports** for Next.js Pages (e.g., `export default function Home() { ... }`).
- **Client Components**: explicit `"use client";` directive at the top of the file when using hooks or interactivity.
- **Props**: Use `interface` or `type` for props definition. For UI components wrapping HTML elements, extend `React.ComponentProps<"element">`.

### Styling (Tailwind CSS)
- **Method**: Utility classes via `className` prop.
- **Conditional Classes**: Use the `cn()` utility (from `@/lib/utils`) for conditional styling and merging classes.
- **Variants**: Use `class-variance-authority` (cva) for components with multiple visual variants (e.g., buttons, badges).
- **Icons**: Use `lucide-react` for icons.

### TypeScript
- **Strictness**: strict mode is enabled in `tsconfig.json`.
- **Types**: Avoid `any`. Define explicit interfaces for data structures.
- **DOM**: Use proper React types (e.g., `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>`).

### State & Logic
- **Hooks**: Use standard React hooks (`useState`, `useEffect`).
- **Animations**: Use `framer-motion` for complex animations (e.g., `motion.div`, `AnimatePresence`).

## 4. File Structure
- `src/app/`: Next.js App Router pages and layouts.
- `src/components/ui/`: Reusable UI primitives (buttons, inputs, etc.).
- `src/components/layout/`: Global layout components (Header, Footer).
- `src/components/sections/`: Page-specific sections (Hero, About, etc.).
- `src/lib/`: Utility functions (e.g., `utils.ts`).

## 5. Error Handling
- Use standard `try/catch` blocks for async operations.
- Ensure UI handles loading and error states gracefully (though specific error boundaries may not be ubiquitous yet).

## 6. Git/Version Control
- Follow semantic commit messages if asked to commit.
- Do not commit secrets or `.env` files.
