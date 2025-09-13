# A2A Demo Studio

A modern React + TypeScript SPA for demonstrating Agent-to-Agent (A2A) communication workflows with interactive animations and screen recording capabilities.

## 🎯 Overview

This application showcases the evolution of AI agent communication through three distinct phases:

- **A2H (Agent-to-Human)**: Traditional AI agents that communicate with human service providers
- **Lite Agent**: AI agents that integrate with business APIs for streamlined operations  
- **A2A (Agent-to-Agent)**: Full agent-to-agent communication with intelligent negotiation

## ✨ Features

### 🎬 Interactive Demo Experience
- **3-Section Layout**: User Phone | AI Agent | Service Provider visualization
- **Real-time Animation**: Framer Motion powered message flows and state transitions
- **8 Demo Scenarios**: Pre-built scenarios covering restaurant reservations, medical appointments, travel booking, and more
- **16:9 Aspect Ratio**: Optimized for professional presentation and recording

### 🎮 Control Interface
- **Scenario Selector**: Browse and select from categorized demo scenarios
- **Play Controls**: Play, pause, reset, and step through scenarios
- **Recording Studio**: High-quality MP4 recording with MediaRecorder API
- **Scenario Editor**: JSON-based scenario editing with real-time validation
- **Theme Toggle**: Light/Dark mode with system preference detection

### 🏗️ Technical Architecture
- **React 19** + **TypeScript 5.8** + **Vite 7**
- **shadcn/ui** components with **TailwindCSS v4**
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **Lucide React** icons
- **Bun** package manager

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun 1.0+
- Modern browser with MediaRecorder API support

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd a2a-demov

# Install dependencies
bun install

# Start development server
bun dev
```

### Building for Production
```bash
# Build the application
bun run build

# Preview the build
bun run preview
```

## 📱 Demo Scenarios

### Phase 1: A2H (Agent-to-Human)
- **Restaurant Reservation**: AI calls restaurant directly
- **Doctor Appointment**: Traditional appointment booking via phone
- **Customer Support**: AI handles billing issues with human agents

### Phase 2: Lite Agent  
- **Restaurant with API**: Integration with OpenTable/booking platforms
- **Medical with Portal**: Clinic management system integration
- **Travel Booking**: Flight booking via travel APIs
- **Grocery Shopping**: Automated grocery ordering through Instacart
- **Car Service**: Vehicle maintenance scheduling

### Phase 3: A2A (Full Agent Communication)
- **Personalized Dining**: Restaurant and customer agents negotiate custom experiences  
- **Multi-Service Travel**: Coordinated booking across airlines, hotels, cars, and dining
- **Healthcare Coordination**: Medical agents coordinate specialist referrals and care
- **Smart Home Services**: Home service agents coordinate maintenance and upgrades
- **Financial Advisory**: Investment agents coordinate portfolio optimization

## 🎨 Component Architecture

```
src/
├── components/
│   ├── DemoView/           # Main 3-section demo area
│   │   ├── LeftSection/    # User phone simulation
│   │   ├── CenterSection/  # AI Agent visualization  
│   │   └── RightSection/   # Service provider phone
│   ├── ControlHeader/      # Demo controls and settings
│   └── shared/            # Reusable UI components
├── hooks/                 # Custom React hooks
│   ├── useScenarioPlayer  # Scenario playback logic
│   ├── useRecorder        # MediaRecorder integration
│   └── useTheme          # Theme management
├── stores/               # Zustand state management
├── types/               # TypeScript definitions
└── data/scenarios/      # Demo scenario data
```

## 🎬 Recording Features

### Supported Formats
- **Video**: MP4 with H.264 codec
- **Quality**: 1080p 30fps  
- **Audio**: 128kbps AAC
- **Aspect Ratio**: Fixed 16:9

### Browser Compatibility
- ✅ Chrome 100+
- ✅ Firefox 100+ 
- ✅ Safari 15+
- ✅ Edge 100+

## 🛠️ Development

### Key Technologies
- **Framer Motion**: Advanced animations with layout transitions
- **shadcn/ui**: High-quality, accessible UI components
- **TailwindCSS v4**: Utility-first styling with custom design tokens
- **Zustand**: Lightweight state management
- **MediaRecorder API**: Native browser screen recording

### Development Commands
```bash
# Start development server
bun dev

# Type checking
bun run build

# Linting
bun run lint

# Add shadcn/ui components
npx shadcn@latest add <component-name>
```

### Performance Optimizations
- **Lazy Loading**: Code splitting for scenario data
- **Animation Optimization**: GPU-accelerated transforms
- **Memory Management**: Automatic cleanup for long recordings
- **Frame Rate Control**: Optimized 60fps → 30fps recording

## 📋 Usage Guide

1. **Select Scenario**: Use the scenario selector to browse available demos
2. **Customize**: Edit scenarios using the built-in JSON editor
3. **Play Demo**: Use playback controls to run the demonstration
4. **Record**: Start recording to capture the demo as MP4
5. **Download**: Save the recorded demo for presentations

## 🎯 Roadmap

### Version 2.0 Features
- [ ] PlantUML integration for scenario visualization
- [ ] Multi-language scenario support
- [ ] Advanced animation timeline editor
- [ ] Cloud scenario sharing
- [ ] Analytics and performance metrics

### Integration Capabilities  
- [ ] Webhook support for live scenario data
- [ ] API integration for real service providers
- [ ] Custom branding and themes
- [ ] Presentation mode with speaker notes

## 🤝 Contributing

This project follows modern React development practices:
- TypeScript strict mode enabled
- ESLint with React-specific rules  
- Conventional commit messages
- Component-driven development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - State management

---

**Built with ❤️ for the future of AI agent communication**