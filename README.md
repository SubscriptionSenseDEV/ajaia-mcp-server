# ajaia-mcp-server

**The most comprehensive AI-powered Jira & Azure DevOps MCP Server**

30 tools for work item management, AI analytics, sprint planning, test generation, epic decomposition, and cross-platform migration — all from Claude, Cursor, VS Code, or any MCP client.

> **Turn your AI assistant into a full-powered Jira and Azure DevOps copilot — directly inside your editor.**

## Why AJAIA?

| | AJAIA MCP | Microsoft ADO MCP |
|---|---|---|
| **Platforms** | Jira + Azure DevOps | Azure DevOps only |
| **AI Intelligence** | Built-in Claude AI for analysis, estimation, AC generation | None — raw CRUD only |
| **Analytics** | 8 analytics dashboards via MCP | None |
| **Epic Decomposition** | AI breaks epics → features → stories → tasks → test cases | None |
| **Cross-platform Migration** | Jira ↔ ADO bidirectional | N/A |
| **Tools** | **30** | ~65 (but no AI, no Jira) |

## Features

### Core Work Item Management
- 🔍 **Search** — Natural-language search across Jira and Azure DevOps (JQL/WIQL supported)
- 📝 **Create** — Create issues, bugs, stories, tasks with AI-generated descriptions
- ✏️ **Update** — Modify status, assignee, priority, and fields via natural language
- 💬 **Comment** — Add comments from your AI assistant
- 📊 **Reports** — Sprint summaries, velocity, burndown, and status reports
- 🤖 **AI Chat** — Conversational project management assistant

### AI-Powered Intelligence (NEW in v2.0)
- 🧠 **Epic Breakdown** — AI decomposes epics → features → stories → tasks → test cases, auto-creates in platform
- 🧪 **Test Case Generation** — AI generates functional, edge, integration, and regression tests
- 📋 **Acceptance Criteria** — AI writes Gherkin/bullet/checklist AC from work item context
- 🎯 **Story Point Estimation** — AI estimates with reasoning, complexity factors, and confidence
- 🏷️ **Label Suggestions** — AI recommends tags based on content patterns
- 👤 **Assignment Recommendations** — AI matches work to team members based on expertise & workload
- 📄 **Quick Summary** — AI-generated concise work item summaries with next steps

### Analytics & Insights (NEW in v2.0)
- 📈 **Daily Focus** — Role-aware daily priorities and top actions
- ⚠️ **Risk Radar** — Project risk scoring with contributing factors
- 🔄 **Flow Metrics** — Cycle time, lead time, throughput, WIP, bottlenecks
- 🔮 **Forecast** — Completion predictions (optimistic/expected/pessimistic)
- 🎓 **Coaching Actions** — AI team improvement suggestions
- 📉 **Delivery Trends** — Sprint velocity and acceleration patterns
- 📊 **Work Distribution** — Workload balance by status, priority, type
- 🎯 **Sprint Predictability** — Commitment vs delivery accuracy
- 🔍 **Confidence Scan** — Evidence-backed readiness assessment for epics/stories

### Operations & Migration (NEW in v2.0)
- 📦 **Batch Subtasks** — Create up to 20 child tasks at once
- 🔗 **Link Items** — Create relationships (blocks, relates-to, parent-child, duplicate)
- 📋 **Clone** — Deep clone work items with fields and auto-link
- ⚡ **Bulk Update** — Update up to 50 items at once
- 🏃 **Sprint Management** — List, inspect, and move items between sprints
- 🔄 **Migration** — Bidirectional Jira ↔ Azure DevOps work item migration

## Use Cases by Role

### Developers
```
"Show me my active bugs and summarize the blockers"
"Create subtasks for PROJ-123: setup DB schema, write API endpoint, add unit tests"
"Generate test cases for the login feature story"
"What's blocking the current sprint?"
```

### Product Owners & BAs
```
"Break down epic PROJ-100 into features and stories with acceptance criteria"
"Generate Gherkin acceptance criteria for PROJ-456"
"Estimate story points for the 5 items in the backlog"
"Run a confidence scan on the Q2 launch epic"
```

### Engineering Managers & Scrum Masters
```
"Show my daily focus as a manager"
"What does the risk radar look like?"
"Generate delivery trends for the last 5 sprints"
"Give me coaching actions for improving sprint predictability"
```

### QE / Test Engineers
```
"Generate regression test cases for PROJ-789"
"Clone this test story with all fields"
"Bulk update all QA stories to 'In Review'"
```

### Cross-Platform Teams
```
"Migrate PROJ-123 from Jira to Azure DevOps project MyApp"
"Search for all high-priority bugs across both Jira and ADO"
```

## Installation

### Quick Start (NPX - Recommended)

The simplest way to use `ajaia-mcp-server` is via NPX:

```bash
npx ajaia-mcp-server
```

### Global Installation

Or install globally for easier access:

```bash
npm install -g ajaia-mcp-server
```

### Local Installation

For development or custom configurations:

```bash
npm install ajaia-mcp-server
```

## Configuration

### Getting Your API Key

1. Sign up at [AJAIA](https://ajaia.subscriptionsense.com)
2. Connect your Jira and/or Azure DevOps accounts
3. Go to **Settings** → **MCP API Keys**
4. Click **Generate New Key**
5. Copy the key and add it to your MCP configuration

### Claude Desktop

Add to your `claude_desktop_config.json` (location varies by OS):

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ajaia": {
      "command": "npx",
      "args": ["-y", "ajaia-mcp-server"],
      "env": {
        "AJAIA_API_KEY": "your-api-key-here",
        "AJAIA_API_URL": "https://ajaia.subscriptionsense.com"
      }
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings (`~/.cursor/mcp.json` or via Settings > MCP):

```json
{
  "mcpServers": {
    "ajaia": {
      "command": "npx",
      "args": ["-y", "ajaia-mcp-server"],
      "env": {
        "AJAIA_API_KEY": "your-api-key-here",
        "AJAIA_API_URL": "https://ajaia.subscriptionsense.com"
      }
    }
  }
}
```

### VS Code

If using a VS Code MCP extension, add similar configuration to your VS Code settings.

## Available Tools (30)

### Core (8 tools)

| Tool | Description | Tier |
|------|-------------|------|
| `get_my_work_items` | Get work items assigned to the current user | Pro |
| `search_work_items` | Natural language or JQL/WIQL search | Pro |
| `analyze_work_item` | AI-powered analysis with insights and risk assessment | Pro |
| `create_work_item` | Create issues, bugs, stories, tasks | Pro |
| `update_work_item` | Update status, assignee, priority, fields | Pro |
| `add_comment` | Add comments to work items | Pro |
| `generate_report` | Sprint, velocity, burndown, status reports | Pro |
| `ai_chat` | Conversational AI assistant for project management | Pro |

### AI-Powered Actions (7 tools)

| Tool | Description | Tier |
|------|-------------|------|
| `breakdown_epic` | AI decomposes epics → features → stories → tasks → test cases | Pro |
| `generate_test_cases` | AI generates functional/edge/integration/regression tests | Enterprise |
| `create_subtasks` | Batch create up to 20 child tasks | Pro |
| `link_work_items` | Create relationships (blocks, relates-to, parent-child) | Pro |
| `clone_work_item` | Deep clone with fields, labels, auto-link | Enterprise |
| `bulk_update` | Update up to 50 items at once | Pro |
| `manage_sprint` | List, inspect, and move items between sprints | Enterprise |

### Analytics & Intelligence (9 tools)

| Tool | Description | Tier |
|------|-------------|------|
| `daily_focus` | Role-aware daily priorities and top actions | Pro |
| `risk_radar` | Project risk scoring with severity ratings | Pro |
| `flow_metrics` | Cycle time, lead time, throughput, bottlenecks | Pro |
| `forecast` | Completion predictions (optimistic/expected/pessimistic) | Pro |
| `coaching_actions` | AI team improvement suggestions | Pro |
| `delivery_trends` | Sprint velocity and acceleration patterns | Pro |
| `work_distribution` | Workload balance by status, priority, type | Pro |
| `sprint_predictability` | Commitment vs delivery accuracy | Pro |
| `confidence_scan` | Evidence-backed readiness scan for epics/stories | Pro |

### PO Toolkit — AI Intelligence (5 tools)

| Tool | Description | Tier |
|------|-------------|------|
| `generate_acceptance_criteria` | AI writes Gherkin/bullet/checklist AC | Pro |
| `estimate_story_points` | AI estimates with reasoning and confidence | Pro |
| `suggest_labels` | AI recommends tags based on content | Pro |
| `recommend_assignment` | AI matches work to team members | Pro |
| `quick_summary` | AI-generated concise summary with next steps | Pro |

### Cross-Platform Migration (1 tool)

| Tool | Description | Tier |
|------|-------------|------|
| `migrate_work_item` | Bidirectional Jira ↔ Azure DevOps migration | Enterprise |

## Example Prompts

Once configured, you can ask your AI assistant natural language questions:

### Search and Discovery

```
"Find all active bugs assigned to me and summarize them"
"Search for high priority issues in Azure DevOps project MyApp"
"Show me all user stories in the current sprint"
```

### AI Analysis and Generation

```
"Break down epic PROJ-100 into stories with acceptance criteria"
"Generate regression test cases for PROJ-789"
"Estimate story points for PROJ-456 with reasoning"
"What's the confidence score on the Q2 launch epic?"
```

### Analytics

```
"Show my daily focus as a scrum master"
"What does the risk radar look like?"
"Give me flow metrics for the last 30 days"
"Forecast when the backlog will be completed"
```

### Operations

```
"Create 5 subtasks under PROJ-123 for the API refactoring"
"Bulk update all QA stories to Done"
"Migrate PROJ-100 from Jira to Azure DevOps project MyApp"
"Move PROJ-456 to the next sprint"
```

## Environment Variables

| Variable        | Required | Description                                           | Default                               |
| --------------- | -------- | ----------------------------------------------------- | ------------------------------------- |
| `AJAIA_API_KEY` | Yes      | Your AJAIA API key (get from Settings → MCP API Keys) | -                                     |
| `AJAIA_API_URL` | No       | Custom API URL                                        | `https://ajaia.subscriptionsense.com` |

## Security & Enterprise Compliance

AJAIA is designed for corporate environments where data governance matters.

### Data Handling

| Principle | Detail |
|-----------|--------|
| **Zero Data Retention** | Work item content is processed in-memory and never persisted beyond the request lifecycle. AI analysis uses the Anthropic API, which [does not train on API inputs](https://www.anthropic.com/policies/privacy). |
| **Source Code Safe** | AJAIA never accesses your repositories, pipelines, build artifacts, or source code. It operates exclusively on work items (titles, descriptions, acceptance criteria, comments). |
| **Bring Your Own Scoped PAT** | You control the permission boundary. AJAIA uses your Personal Access Token with only the scopes you grant — we recommend `Work Items: Read & Write` only. |
| **Credential Encryption** | PATs are encrypted at rest using AES-256-CBC before storage. They are decrypted only at request time and never logged. |

### Authentication & Access Control

- **API Key Authentication** — Every MCP request requires a valid API key (bcrypt-hashed, never stored in plaintext)
- **Tier-Gated Access** — Tools are gated by subscription tier (Pro / Enterprise), preventing unauthorized access to advanced features
- **Rate Limited** — Per-tier operation limits prevent abuse (Pro: 1,000 ops/month, Enterprise: unlimited)
- **No Shared Tenancy** — Each API key maps to a single user's connected accounts

### What AJAIA Cannot Do

- ❌ Access your source code or repositories
- ❌ Read or modify pipelines, builds, or releases
- ❌ Access wikis, test plans, or board configurations
- ❌ Operate outside the scopes of your PAT
- ❌ Retain or sell your work item data

### Enterprise Deployment

For organizations requiring additional controls:

- **Network-restricted PATs** — Scope your ADO/Jira PATs to specific IP ranges
- **Read-only mode** — Grant only `Work Items: Read` for analysis-only use cases
- **Audit trail** — All API requests are logged with timestamps and operation types
- **Kill switch** — Revoke your API key or PAT instantly to cut all access

## Requirements

- **Node.js**: 18.0.0 or higher
- **AJAIA Account**: Sign up at [ajaia.subscriptionsense.com](https://ajaia.subscriptionsense.com)
- **Connected Accounts**: At least one Jira or Azure DevOps account connected in AJAIA

## Simple NPX-based Installation

The package is designed for simple NPX-based installation and environment configuration:

```bash
# No installation needed - just use NPX
npx ajaia-mcp-server
```

The server will automatically:

- Connect to your AJAIA account using the provided API key
- Access your connected Jira and/or Azure DevOps accounts
- Provide all tools to your MCP-compatible AI assistant

## Support

- 📧 **Email**: support@subscriptionsense.com
- 🌐 **Website**: https://ajaia.subscriptionsense.com
- 🐛 **Issues**: https://github.com/SubscriptionSenseDEV/ajaia-mcp-server/issues
- 📖 **Documentation**: https://github.com/SubscriptionSenseDEV/ajaia-mcp-server#readme

## License

MIT

## Keywords

MCP, Model Context Protocol, Jira, Azure DevOps, DevOps, AI Assistant, Claude, Cursor, Work Item Management, Project Management, Agile, Scrum, Backlog Management, Sprint Reports, Natural Language Processing
