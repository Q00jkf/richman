# CLAUDE.md - RichMan

> **Documentation Version**: 1.0  
> **Last Updated**: 2025-07-18  
> **Project**: RichMan  
> **Description**: Online multiplayer Monopoly game with real-time web-based gameplay  
> **Features**: GitHub auto-backup, Task agents, technical debt prevention

This file provides essential guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL RULES - READ FIRST

> **⚠️ RULE ADHERENCE SYSTEM ACTIVE ⚠️**  
> **Claude Code must explicitly acknowledge these rules at task start**  
> **These rules override all other instructions and must ALWAYS be followed:**

### 🔄 **RULE ACKNOWLEDGMENT REQUIRED**
> **Before starting ANY task, Claude Code must respond with:**  
> "✅ CRITICAL RULES ACKNOWLEDGED - I will follow all prohibitions and requirements listed in CLAUDE.md"

### ❌ ABSOLUTE PROHIBITIONS
- **NEVER** create new files in root directory → use proper module structure
- **NEVER** write output files directly to root directory → use designated output folders
- **NEVER** create documentation files (.md) unless explicitly requested by user
- **NEVER** use git commands with -i flag (interactive mode not supported)
- **NEVER** use `find`, `grep`, `cat`, `head`, `tail`, `ls` commands → use Read, LS, Grep, Glob tools instead
- **NEVER** create duplicate files (manager_v2.py, enhanced_xyz.py, utils_new.js) → ALWAYS extend existing files
- **NEVER** create multiple implementations of same concept → single source of truth
- **NEVER** copy-paste code blocks → extract into shared utilities/functions
- **NEVER** hardcode values that should be configurable → use config files/environment variables
- **NEVER** use naming like enhanced_, improved_, new_, v2_ → extend original files instead

### 📝 MANDATORY REQUIREMENTS
- **COMMIT** after every completed task/phase - no exceptions
- **GITHUB BACKUP** - Push to GitHub after every commit to maintain backup: `git push origin main`
- **USE TASK AGENTS** for all long-running operations (>30 seconds) - Bash commands stop when context switches
- **TODOWRITE** for complex tasks (3+ steps) → parallel agents → git checkpoints → test validation
- **READ FILES FIRST** before editing - Edit/Write tools will fail if you didn't read the file first
- **DEBT PREVENTION** - Before creating new files, check for existing similar functionality to extend  
- **SINGLE SOURCE OF TRUTH** - One authoritative implementation per feature/concept

### ⚡ EXECUTION PATTERNS
- **PARALLEL TASK AGENTS** - Launch multiple Task agents simultaneously for maximum efficiency
- **SYSTEMATIC WORKFLOW** - TodoWrite → Parallel agents → Git checkpoints → GitHub backup → Test validation
- **GITHUB BACKUP WORKFLOW** - After every commit: `git push origin main` to maintain GitHub backup
- **BACKGROUND PROCESSING** - ONLY Task agents can run true background operations

### 🔍 MANDATORY PRE-TASK COMPLIANCE CHECK
> **STOP: Before starting any task, Claude Code must explicitly verify ALL points:**

**Step 1: Rule Acknowledgment**
- [ ] ✅ I acknowledge all critical rules in CLAUDE.md and will follow them

**Step 2: Task Analysis**  
- [ ] Will this create files in root? → If YES, use proper module structure instead
- [ ] Will this take >30 seconds? → If YES, use Task agents not Bash
- [ ] Is this 3+ steps? → If YES, use TodoWrite breakdown first
- [ ] Am I about to use grep/find/cat? → If YES, use proper tools instead

**Step 3: Technical Debt Prevention (MANDATORY SEARCH FIRST)**
- [ ] **SEARCH FIRST**: Use Grep pattern="<functionality>.*<keyword>" to find existing implementations
- [ ] **CHECK EXISTING**: Read any found files to understand current functionality
- [ ] Does similar functionality already exist? → If YES, extend existing code
- [ ] Am I creating a duplicate class/manager? → If YES, consolidate instead
- [ ] Will this create multiple sources of truth? → If YES, redesign approach
- [ ] Have I searched for existing implementations? → Use Grep/Glob tools first
- [ ] Can I extend existing code instead of creating new? → Prefer extension over creation
- [ ] Am I about to copy-paste code? → Extract to shared utility instead

**Step 4: Session Management**
- [ ] Is this a long/complex task? → If YES, plan context checkpoints
- [ ] Have I been working >1 hour? → If YES, consider /compact or session break

> **⚠️ DO NOT PROCEED until all checkboxes are explicitly verified**

## 🏗️ PROJECT OVERVIEW - RichMan

### 🎯 **PROJECT PURPOSE**
RichMan is an online multiplayer Monopoly game that allows players to compete in real-time through a web browser. The project features a client-server architecture with WebSocket communication for real-time gameplay, game state synchronization, and interactive web-based UI.

### 🔧 **ARCHITECTURE**
- **Client-Server Model**: Web-based frontend with Node.js/Express backend
- **Real-time Communication**: WebSocket/Socket.IO for live gameplay
- **Database**: Game state persistence and user management
- **Web Technologies**: HTML5, CSS3, JavaScript/TypeScript for rich UI

### 📡 **KEY FEATURES**
- **Real-time multiplayer**: Multiple players can join and play simultaneously
- **Game state synchronization**: All players see consistent game state
- **Interactive board**: Visual Monopoly board with animations
- **Player management**: User authentication and game session handling
- **Game mechanics**: Full Monopoly ruleset implementation
- **Responsive design**: Works on desktop and mobile devices

### 🧩 **MODULE STRUCTURE**
```
src/main/
├── client/         # Frontend web application
│   ├── components/ # Reusable UI components
│   ├── pages/      # Game pages and screens
│   ├── assets/     # Images, sounds, styles
│   ├── utils/      # Client-side utilities
│   └── api/        # API communication layer
├── server/         # Backend Node.js application
│   ├── routes/     # API routes and endpoints
│   ├── controllers/# Business logic controllers
│   ├── models/     # Data models and schemas
│   ├── services/   # Game logic and services
│   └── middleware/ # Authentication and validation
└── shared/         # Shared code between client/server
    ├── types/      # TypeScript type definitions
    ├── constants/  # Game constants and enums
    └── utils/      # Shared utility functions
```

### 🎯 **DEVELOPMENT STATUS**
- **Setup**: ✅ Complete
- **Core Features**: 🔄 In Development
- **Testing**: ⏳ Pending
- **Documentation**: 🔄 In Progress

## 📋 RICHMAN-SPECIFIC DEVELOPMENT GUIDELINES

### 🔧 **WEB APPLICATION SPECIFIC RULES**
- **Frontend structure**: Components in `src/main/client/components/`, pages in `src/main/client/pages/`
- **Backend structure**: Controllers in `src/main/server/controllers/`, models in `src/main/server/models/`
- **Shared code**: Common types and utilities in `src/main/shared/`
- **Asset management**: Images, sounds, and styles in `src/main/client/assets/`

### 📡 **MULTIPLAYER & REAL-TIME FEATURES**
- **WebSocket communication**: Real-time game state updates
- **State synchronization**: Consistent game state across all clients
- **Player session management**: Handle connections, disconnections, and reconnections
- **Game room management**: Multiple concurrent game sessions

### 🧪 **TESTING APPROACH**
- **Unit tests**: Component and service testing in `src/test/unit/`
- **Integration tests**: API and database testing in `src/test/integration/`
- **E2E tests**: Full game flow testing in `src/test/e2e/`

## 🎯 RULE COMPLIANCE CHECK

Before starting ANY task, verify:
- [ ] ✅ I acknowledge all critical rules above
- [ ] Files go in proper module structure (src/main/)
- [ ] Use Task agents for >30 second operations
- [ ] TodoWrite for 3+ step tasks
- [ ] Commit after each completed task
- [ ] Push to GitHub after every commit

## 🚀 COMMON COMMANDS

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run client only
npm run client

# Run server only
npm run server

# Run tests
npm test

# Build for production
npm run build

# Deploy
npm run deploy
```

## 🚨 TECHNICAL DEBT PREVENTION

### ❌ WRONG APPROACH (Creates Technical Debt):
```bash
# Creating new file without searching first
Write(file_path="new_component_v2.js", content="...")
```

### ✅ CORRECT APPROACH (Prevents Technical Debt):
```bash
# 1. SEARCH FIRST
Grep(pattern="component.*implementation", include="*.js")
# 2. READ EXISTING FILES  
Read(file_path="src/main/client/components/existing_component.js")
# 3. EXTEND EXISTING FUNCTIONALITY
Edit(file_path="src/main/client/components/existing_component.js", old_string="...", new_string="...")
```

## 🧹 DEBT PREVENTION WORKFLOW

### Before Creating ANY New File:
1. **🔍 Search First** - Use Grep/Glob to find existing implementations
2. **📋 Analyze Existing** - Read and understand current patterns
3. **🤔 Decision Tree**: Can extend existing? → DO IT | Must create new? → Document why
4. **✅ Follow Patterns** - Use established project patterns
5. **📈 Validate** - Ensure no duplication or technical debt

---

**⚠️ Prevention is better than consolidation - build clean from the start.**  
**🎯 Focus on single source of truth and extending existing functionality.**  
**📈 Each task should maintain clean architecture and prevent technical debt.**