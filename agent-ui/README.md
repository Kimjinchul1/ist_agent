# Agent UI

A beautiful, open-source interface for interacting with AI agents, teams, and workflows.

## Features

- **Agents**: Chat with individual AI agents
- **Teams**: Interact with multi-agent teams for collaborative tasks
- **Workflows**: Execute structured workflows for complex processes
- **Beautiful UI**: Modern, responsive interface built with Next.js and TypeScript
- **Real-time Streaming**: Live streaming of agent responses
- **Session Management**: Persistent chat history and session management
- **Local Storage**: All data stored locally, no external dependencies

## Quick Start

```bash
# Create a new Agent UI project
npx create-agent-ui@latest

# Or clone and run manually
git clone https://github.com/agno-agi/agent-ui.git
cd agent-ui && pnpm install && pnpm dev
```

The UI will connect to `localhost:7777` by default, matching the Agno Playground setup.

## Team and Workflow Support

This Agent UI now supports the full Agno ecosystem:

### Agents
- Individual AI agents with specific capabilities
- Direct chat interface
- Tool calling and reasoning support

### Teams
- Multi-agent collaboration
- Coordinated responses from multiple agents
- Team-based memory and context sharing

### Workflows
- Structured, step-by-step processes
- Automated task execution
- Complex multi-step operations

## Configuration

The UI automatically detects and displays available agents, teams, and workflows from your connected Agno endpoint. Simply:

1. Start your Agno playground server
2. Launch the Agent UI
3. Select your endpoint
4. Choose between agents, teams, or workflows

## Requirements

- Node.js 18+
- An Agno playground server running (typically on port 7777)

For more information, visit the [Agno documentation](https://docs.agno.com).
