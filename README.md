# RichMan

Online multiplayer Monopoly game with real-time web-based gameplay.

## Quick Start

1. **Read CLAUDE.md first** - Contains essential rules for Claude Code
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open browser to `http://localhost:3000`

## Features

- **Real-time multiplayer**: WebSocket-based gameplay
- **Interactive board**: Visual Monopoly board with animations
- **Full game mechanics**: Complete Monopoly ruleset
- **Responsive design**: Works on desktop and mobile
- **Room system**: Multiple concurrent games

## Architecture

- **Frontend**: React/TypeScript with Socket.IO
- **Backend**: Node.js/Express with Socket.IO
- **Database**: MongoDB for game state persistence
- **Real-time**: WebSocket communication

## Development

- **Structure**: Modular architecture in `src/main/`
- **Testing**: Jest for unit/integration tests
- **Code Quality**: ESLint + TypeScript
- **Git Workflow**: Commit after every task

## Commands

```bash
npm install     # Install dependencies
npm run dev     # Development server
npm run client  # Frontend only
npm run server  # Backend only
npm test        # Run tests
npm run build   # Production build
```

## Game Rules

Based on traditional Monopoly with 2+ players:
- Buy properties and collect rent
- Build houses and hotels
- Manage money and avoid bankruptcy
- Real-time multiplayer gameplay

## License

MIT