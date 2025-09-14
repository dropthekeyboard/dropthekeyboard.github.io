# AI Coding Agent Instructions

## Project Overview

This is a modern React + TypeScript + Vite application with **shadcn/ui** integration and TailwindCSS v4. The project uses Bun as the package manager and follows a component-driven architecture.

## Tech Stack & Architecture

- **Frontend**: React 19 + TypeScript 5.8 + Vite 7
- **UI Framework**: shadcn/ui (New York style) + TailwindCSS v4 + Lucide React icons
- **Styling**: Custom CSS variables with light/dark theme support using OKLCH color space
- **Build Tools**: Vite with React plugin, ESLint with TypeScript rules
- **Package Manager**: Bun (note: shadcn CLI requires npx, not bunx)

## Key Project Patterns

### Path Aliases & Import Structure

```typescript
// Use @ alias for all src imports (configured in tsconfig.json + vite.config.ts)
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
```

### Component Organization (shadcn/ui conventions)

- `@/components/ui/` - shadcn/ui components (auto-generated)
- `@/components/` - Custom application components
- `@/lib/` - Utility functions (e.g., `cn()` for className merging)
- `@/hooks/` - Custom React hooks (when created)

### Styling Conventions

- **CSS Variables**: Extensive use of custom properties in `src/index.css` for theme consistency
- **Color System**: OKLCH color space with semantic naming (`--background`, `--foreground`, `--primary`, etc.)
- **Dark Mode**: Handled via `.dark` class with complete variable overrides
- **Utility Function**: Always use `cn()` from `@/lib/utils` for conditional className merging

### TailwindCSS v4 Specifics

- Uses `@import "tailwindcss"` instead of separate utilities/components imports
- Custom variants: `@custom-variant dark (&:is(.dark *))`
- Inline theme configuration with CSS variables mapping

## Development Workflows

### Essential Commands

```bash
bun dev          # Start development server
bun build        # Build for production (TypeScript check + Vite build)
bun lint         # Run ESLint
bun preview      # Preview production build

# shadcn/ui component management (use npx, not bunx)
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### Adding New Components

1. Use `npx shadcn@latest add <component>` for UI components
2. Custom components go in `src/components/`
3. Always import utilities: `import { cn } from "@/lib/utils"`
4. Follow TypeScript strict mode (enabled in tsconfig.app.json)

### Styling Guidelines

- Use semantic color variables instead of hardcoded colors
- Leverage the `cn()` utility for conditional classes
- Follow shadcn/ui conventions for component variants using `class-variance-authority`

## Configuration Notes

- **TypeScript**: Project references setup with separate app/node configs
- **ESLint**: Modern flat config with React hooks and refresh plugins
- **Vite**: Configured with path resolution and TailwindCSS v4 plugin
- **shadcn/ui**: New York style with cssVariables enabled, neutral base color

## Critical Integration Points

- **Theme System**: All colors must use CSS variables from `src/index.css`
- **Component Registry**: shadcn/ui components auto-install to configured paths in `components.json`
- **Icon System**: Use Lucide React icons (configured as default in shadcn setup)

## Common Gotchas

- Use `npx` for shadcn CLI, not `bunx` (compatibility issues)
- Import paths use `@/` prefix - never relative imports from src/
- Always check both light and dark theme variables when adding new colors
- TypeScript strict mode is enabled - handle nullability explicitly
