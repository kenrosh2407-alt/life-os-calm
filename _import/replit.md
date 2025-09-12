# LifeOS - PWA Super App

## Overview
LifeOS is a sleek Progressive Web App (PWA) with an Apple-style glass UI design. This is a React-based super-app prototype that includes health tracking, finance overview, and user profile features.

## Project Architecture
- **Frontend**: React 19 + Vite
- **Styling**: Custom CSS with glass UI effects
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **PWA Features**: Service Worker with Vite PWA plugin
- **UI Effects**: Framer Motion for animations

## Setup Status
- ✅ Dependencies installed with legacy peer deps (canvas compatibility)
- ✅ Project structure reorganized to follow Vite conventions
- ✅ Vite config updated for Replit proxy compatibility (allowedHosts: true)
- ✅ Development server configured on port 5000
- ✅ Deployment configured for autoscale

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests with Vitest
- `npm run lint` - Run ESLint

## Key Features
- Time-of-day background effects
- Health tracking with progress rings
- Finance overview
- User profile management
- PWA capabilities (can be installed on devices)
- Responsive design optimized for mobile

## Recent Changes (2025-09-12)
- Migrated from GitHub import to Replit environment
- Reorganized file structure (moved components to src/components, pages to src/pages)
- Updated Vite configuration for Replit compatibility
- Resolved dependency conflicts with canvas package
- Configured workflow for continuous development
- Set up deployment configuration

## User Preferences
No specific user preferences documented yet.

## Technical Notes
- Uses legacy peer deps due to canvas/jsdom version conflicts
- Configured for Replit's proxy system with allowedHosts: true
- PWA features include manifest and service worker
- Glass UI effects use CSS backdrop filters