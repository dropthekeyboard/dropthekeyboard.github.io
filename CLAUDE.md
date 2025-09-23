# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `bun dev` (uses Vite with HMR)
- **Build**: `bun build` (TypeScript compilation followed by Vite build)
- **Lint**: `bun lint` (ESLint with TypeScript support)
- **Format**: `bun format` (auto-fix with ESLint)
- **Prettier**: `bun prettier` (format with Prettier)
- **Preview**: `bun preview` (preview production build)

## Project Architecture

This is a React + TypeScript + Vite project for creating an animated Single Page Application (SPA) demo that illustrates Agent-to-Agent (A2A) communication scenarios.

### Tech Stack

- **Frontend**: React 19.1.1 with TypeScript 5.8
- **Build Tool**: Vite 7.1.2 with HMR
- **Package Manager**: Bun (bun.lockb present)
- **Styling**: TailwindCSS 4.1.13 with custom CSS variables and OKLCH color space
- **UI Framework**: shadcn/ui (New York style) with Radix UI primitives
- **Icons**: Lucide React
- **Animation**: GSAP 3.13.0 with @gsap/react 2.1.2 + Framer Motion 12.23.18
- **State Management**: Zustand 5.0.8
- **Internationalization**: i18next 25.5.2 with react-i18next 15.7.3 + i18next-browser-languagedetector
- **Charts**: Recharts 3.2.1
- **Markdown**: react-markdown 9.0.1 with remark-gfm + @tailwindcss/typography
- **Utilities**: clsx, tailwind-merge, @paralleldrive/cuid2 for ID generation
- **Path Resolution**: `@/` alias points to `src/`

### Key Project Purpose

The application demonstrates A2A (Agent-to-Agent) communication through three phases:

1. **A2H (Agent to Human)**: AI Agents interact with humans via phone/SMS
2. **Lite Agent**: Semi-automated interactions with app-based assistance
3. **Full A2A**: Direct Agent-to-Agent communication

The demo features:

- **DemoView**: 16:9 display area with three horizontal sections (user phone, AI agent, service provider phone)
- **ControlHeader**: Scenario editing and screen recording controls
- **GSAPSlidesPage**: GSAP-powered presentation slides with ScrollTrigger pinning
- **Slide Components**: Individual presentation slides (Slide001-Slide017) with animations
- Phone UI mockups with iPhone-like design
- Message bubbles with typing animations and realistic delays
- AI Agent progress indicators and reasoning display
- Dark/light theme support with OKLCH color variables
- Multi-language support (Korean/English) via i18next
- Interactive scenario editing and playback controls
- Screen recording capabilities for demo capture

### File Structure

- `src/lib/utils.ts`: Contains utility functions including `cn()` for Tailwind class merging
- `src/components/`: Main UI components organized by feature
  - `ui/`: shadcn/ui auto-generated components
  - `Slide/`: Presentation slides with GSAP animations
  - `DemoView/`: A2A scenario demonstration interface
  - `ControlHeader/`: Scenario editing and controls
  - `shared/`: Reusable components
- `src/contexts/`: React contexts for global state
  - `scenario.tsx`: Scenario data management
  - `pinning.tsx`: GSAP ScrollTrigger pinning state
  - `theme.tsx`: Dark/light theme support
  - `agentDisplayVariant.tsx`: Agent UI variants
- `src/hooks/`: Custom React hooks
- `src/types/`: TypeScript type definitions
- `src/data/`: JSON scenario data files
- `src/locales/`: i18next translation files
- `components.json`: shadcn/ui configuration with path aliases
- Project documentation in Korean (`scenario.md`, `docs/` folder)

### Development Notes

- Uses Bun as package manager (bun.lockb present)
- Configured with path alias `@/` pointing to `src/`
- TailwindCSS v4 with CSS variables enabled for theming and OKLCH color space
- ESLint 9.33.0 configured with TypeScript and React plugins
- Prettier 3.6.2 for code formatting
- GSAP ScrollTrigger for advanced scroll-based animations
- TypeScript strict mode enabled with project references
- React 19 with new JSX transform (no React import needed)
- Support for both demo mode and storytelling presentation mode
