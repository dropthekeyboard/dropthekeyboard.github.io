# Project Overview

This is a web application built with React, TypeScript, and Vite. It uses Tailwind CSS for styling and ESLint for linting. The project is a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Building and Running

### Development

To start the development server, run:

```bash
npm run dev
```

### Build

To build the application for production, run:

```bash
npm run build
```

### Lint

To lint the codebase, run:

```bash
npm run lint
```

### Preview

To serve the production build locally, run:

```bash
npm run preview
```

## Development Conventions

### Path Aliases

The project uses a path alias `@/*` that maps to the `src` directory. This should be used when importing modules from the `src` directory.

### Styling

The project uses Tailwind CSS for styling. Utility classes should be used whenever possible.

### Linting

The project uses ESLint to enforce code quality. Before committing any changes, make sure to run `npm run lint` to check for any linting errors.
