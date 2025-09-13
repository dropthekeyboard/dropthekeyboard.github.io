# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Vite with HMR)
- **Build**: `npm run build` (TypeScript compilation followed by Vite build)
- **Lint**: `npm run lint` (ESLint with TypeScript support)
- **Preview**: `npm run preview` (preview production build)

## Project Architecture

This is a React + TypeScript + Vite project for creating an animated Single Page Application (SPA) demo that illustrates Agent-to-Agent (A2A) communication scenarios.

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with custom CSS variables
- **UI Library**: Shadcn/ui (configured with "new-york" style)
- **Icons**: Lucide React
- **Path Resolution**: `@/` alias points to `src/`

### Key Project Purpose
The application demonstrates A2A (Agent-to-Agent) communication through three phases:
1. **A2H (Agent to Human)**: AI Agents interact with humans via phone/SMS
2. **Lite Agent**: Semi-automated interactions with app-based assistance
3. **Full A2A**: Direct Agent-to-Agent communication

The demo features:
- **DemoView**: 16:9 display area with three horizontal sections (user phone, AI agent, service provider phone)
- **ControlHeader**: Scenario editing and screen recording controls
- Phone UI mockups with iPhone-like design
- Message bubbles with typing animations
- AI Agent progress indicators

### File Structure
- `src/lib/utils.ts`: Contains utility functions including `cn()` for Tailwind class merging
- `components.json`: Shadcn/ui configuration with path aliases
- Project uses Korean documentation in `scenario.md` and related files

### Development Notes
- Uses Bun as package manager (bun.lockb present)
- Configured with path alias `@/` pointing to `src/`
- Tailwind CSS variables enabled for theming
- ESLint configured with TypeScript and React plugins