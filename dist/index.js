#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError, } from '@modelcontextprotocol/sdk/types.js';
import { AjaiaClient } from './client.js';
// Get API key from environment
const API_KEY = process.env.AJAIA_API_KEY;
const API_BASE_URL = process.env.AJAIA_API_URL || 'https://ajaia.subscriptionsense.com';
if (!API_KEY) {
    console.error('Error: AJAIA_API_KEY environment variable is required');
    process.exit(1);
}
// Initialize the AJAIA API client
const client = new AjaiaClient(API_BASE_URL, API_KEY);
// Create the MCP server
const server = new Server({
    name: 'ajaia-mcp-server',
    version: '2.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'analyze_work_item',
                description: 'Analyze a Jira issue or Azure DevOps work item using AI. Provides insights, suggestions, and analysis.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform: "jira" for Jira or "ado" for Azure DevOps',
                        },
                        itemId: {
                            type: 'string',
                            description: 'The work item ID (e.g., "PROJ-123" for Jira or "12345" for ADO)',
                        },
                        analysisType: {
                            type: 'string',
                            enum: ['summary', 'risks', 'suggestions', 'full'],
                            description: 'Type of analysis to perform',
                            default: 'full',
                        },
                    },
                    required: ['platform', 'itemId'],
                },
            },
            {
                name: 'search_work_items',
                description: 'Search for work items in Jira or Azure DevOps using natural language or JQL/WIQL queries.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform to search',
                        },
                        query: {
                            type: 'string',
                            description: 'Natural language search query or JQL/WIQL query',
                        },
                        maxResults: {
                            type: 'number',
                            description: 'Maximum number of results to return',
                            default: 50,
                        },
                    },
                    required: ['platform', 'query'],
                },
            },
            {
                name: 'create_work_item',
                description: 'Create a new work item in Jira or Azure DevOps.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform to create the item in',
                        },
                        project: {
                            type: 'string',
                            description: 'Project key (Jira) or project name (ADO)',
                        },
                        title: {
                            type: 'string',
                            description: 'Title/summary of the work item',
                        },
                        description: {
                            type: 'string',
                            description: 'Detailed description of the work item',
                        },
                        type: {
                            type: 'string',
                            description: 'Work item type (e.g., "Bug", "Story", "Task")',
                        },
                        priority: {
                            type: 'string',
                            description: 'Priority level',
                        },
                        assignee: {
                            type: 'string',
                            description: 'Email or username to assign the item to',
                        },
                    },
                    required: ['platform', 'project', 'title', 'type'],
                },
            },
            {
                name: 'update_work_item',
                description: 'Update an existing work item in Jira or Azure DevOps.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        itemId: {
                            type: 'string',
                            description: 'The work item ID to update',
                        },
                        updates: {
                            type: 'object',
                            description: 'Fields to update (e.g., { "status": "In Progress", "assignee": "user@email.com" })',
                        },
                    },
                    required: ['platform', 'itemId', 'updates'],
                },
            },
            {
                name: 'add_comment',
                description: 'Add a comment to a work item in Jira or Azure DevOps.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        itemId: {
                            type: 'string',
                            description: 'The work item ID',
                        },
                        comment: {
                            type: 'string',
                            description: 'The comment text to add',
                        },
                    },
                    required: ['platform', 'itemId', 'comment'],
                },
            },
            {
                name: 'get_my_work_items',
                description: 'Get work items assigned to the current user.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        status: {
                            type: 'string',
                            description: 'Filter by status (e.g., "open", "in progress", "done")',
                        },
                        maxResults: {
                            type: 'number',
                            description: 'Maximum number of results',
                            default: 20,
                        },
                    },
                    required: ['platform'],
                },
            },
            {
                name: 'generate_report',
                description: 'Generate a report or summary for a project or sprint.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        project: {
                            type: 'string',
                            description: 'Project key or name',
                        },
                        reportType: {
                            type: 'string',
                            enum: ['sprint', 'velocity', 'burndown', 'status', 'summary'],
                            description: 'Type of report to generate',
                        },
                        sprintId: {
                            type: 'string',
                            description: 'Sprint ID (if applicable)',
                        },
                    },
                    required: ['platform', 'project', 'reportType'],
                },
            },
            {
                name: 'ai_chat',
                description: 'Have a conversation with AJAIA AI about your work items, projects, or get help with project management.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Your message or question for the AI assistant',
                        },
                        context: {
                            type: 'object',
                            description: 'Optional context (e.g., current project, work item being discussed)',
                        },
                    },
                    required: ['message'],
                },
            },
            // ====================================================================
            // PHASE 1 — Already-built MCP endpoints (7 tools)
            // ====================================================================
            {
                name: 'breakdown_epic',
                description: 'AI-powered epic decomposition. Breaks an epic into features, stories, tasks, and test cases. Can auto-create them in Jira/ADO.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        epicId: {
                            type: 'string',
                            description: 'The epic ID to break down (e.g., "PROJ-100" or "12345")',
                        },
                        createStories: {
                            type: 'boolean',
                            description: 'Whether to auto-create the decomposed items in the platform',
                            default: true,
                        },
                        phase: {
                            type: 'string',
                            enum: ['full', 'features', 'stories', 'tasks'],
                            description: 'Decomposition depth',
                            default: 'full',
                        },
                    },
                    required: ['platform', 'epicId'],
                },
            },
            {
                name: 'generate_test_cases',
                description: 'AI-generate test cases (functional, edge, integration, regression) from a work item. Optionally creates them in the platform.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        workItemId: {
                            type: 'string',
                            description: 'The work item ID to generate test cases for',
                        },
                        createTestCases: {
                            type: 'boolean',
                            description: 'Whether to auto-create test cases in the platform',
                            default: true,
                        },
                        testType: {
                            type: 'string',
                            enum: ['functional', 'edge', 'integration', 'regression', 'all'],
                            description: 'Type of test cases to generate',
                            default: 'functional',
                        },
                    },
                    required: ['platform', 'workItemId'],
                },
            },
            {
                name: 'create_subtasks',
                description: 'Batch create child tasks/subtasks under a parent work item (up to 20 at once).',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        parentId: {
                            type: 'string',
                            description: 'The parent work item ID',
                        },
                        subtasks: {
                            type: 'array',
                            description: 'Array of subtasks to create (max 20)',
                            items: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string', description: 'Subtask title' },
                                    description: { type: 'string', description: 'Subtask description' },
                                    assignee: { type: 'string', description: 'Assignee email or username' },
                                    estimatedHours: { type: 'number', description: 'Estimated hours' },
                                },
                                required: ['title'],
                            },
                        },
                    },
                    required: ['platform', 'parentId', 'subtasks'],
                },
            },
            {
                name: 'link_work_items',
                description: 'Create a relationship between two work items (blocks, is-blocked-by, relates-to, parent-child, duplicate, etc.).',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        sourceId: {
                            type: 'string',
                            description: 'The source work item ID',
                        },
                        targetId: {
                            type: 'string',
                            description: 'The target work item ID',
                        },
                        linkType: {
                            type: 'string',
                            description: 'Link type. Jira: "blocks", "is blocked by", "relates to", "duplicates", "is duplicated by", "clones", "is cloned by". ADO: "System.LinkTypes.Hierarchy-Forward", "System.LinkTypes.Related", "System.LinkTypes.Dependency-Forward".',
                        },
                        comment: {
                            type: 'string',
                            description: 'Optional comment for the link',
                        },
                    },
                    required: ['platform', 'sourceId', 'targetId', 'linkType'],
                },
            },
            {
                name: 'clone_work_item',
                description: 'Deep clone a work item including fields, labels, and auto-link back to the original.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        workItemId: {
                            type: 'string',
                            description: 'The work item ID to clone',
                        },
                        titlePrefix: {
                            type: 'string',
                            description: 'Prefix for the cloned item title',
                            default: '[Clone]',
                        },
                        includeAttachments: {
                            type: 'boolean',
                            description: 'Whether to copy attachments',
                            default: false,
                        },
                    },
                    required: ['platform', 'workItemId'],
                },
            },
            {
                name: 'bulk_update',
                description: 'Update up to 50 work items at once. Change status, add comments, update fields in batch.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        workItemIds: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Array of work item IDs to update (max 50)',
                        },
                        updates: {
                            type: 'object',
                            description: 'Field updates to apply (e.g., { "status": "Done", "priority": "High" })',
                        },
                        addComment: {
                            type: 'string',
                            description: 'Optional comment to add to all items',
                        },
                    },
                    required: ['platform', 'workItemIds'],
                },
            },
            {
                name: 'manage_sprint',
                description: 'Sprint management: list sprints, get sprint details, view sprint items, or move items between sprints.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        action: {
                            type: 'string',
                            enum: ['list', 'get', 'items', 'move'],
                            description: 'Action: "list" all sprints, "get" sprint details, "items" in sprint, "move" item to sprint',
                        },
                        sprintId: {
                            type: 'string',
                            description: 'Sprint ID (required for get/items/move)',
                        },
                        workItemId: {
                            type: 'string',
                            description: 'Work item ID (required for move)',
                        },
                        targetSprintId: {
                            type: 'string',
                            description: 'Target sprint ID (required for move)',
                        },
                    },
                    required: ['platform', 'action'],
                },
            },
            // ====================================================================
            // PHASE 2 — Analytics & Intelligence (9 tools)
            // ====================================================================
            {
                name: 'daily_focus',
                description: 'AI-powered daily priorities and focus metrics. Role-aware (developer, manager, QE). Returns top actions, blockers, and key metrics.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        role: {
                            type: 'string',
                            enum: ['developer', 'manager', 'qa', 'po', 'scrum_master'],
                            description: 'Your role for tailored priorities',
                            default: 'manager',
                        },
                    },
                },
            },
            {
                name: 'risk_radar',
                description: 'Comprehensive project risk scoring. Identifies overdue items, blocked chains, scope creep, and team overload with severity ratings.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'flow_metrics',
                description: 'Agile flow metrics: cycle time, lead time, throughput, WIP, and bottleneck identification.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'forecast',
                description: 'Project completion forecasting with optimistic, expected, and pessimistic scenarios based on historical velocity.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'coaching_actions',
                description: 'AI-generated team coaching suggestions and improvement actions based on current project health.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        role: {
                            type: 'string',
                            enum: ['developer', 'manager', 'qa', 'po', 'scrum_master'],
                            description: 'Your role for tailored coaching',
                            default: 'manager',
                        },
                    },
                },
            },
            {
                name: 'delivery_trends',
                description: 'Sprint-by-sprint velocity and delivery trend analysis. Shows acceleration/deceleration patterns.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'work_distribution',
                description: 'Workload distribution analysis: work by status, priority, type, and team member with balance indicators.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'sprint_predictability',
                description: 'Sprint commitment vs delivery predictability. Shows historical accuracy and confidence interval.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'confidence_scan',
                description: 'Evidence-backed completeness and readiness scan for epics, features, or stories. Returns a confidence score with specific gaps.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        targetType: {
                            type: 'string',
                            enum: ['epic', 'feature', 'story', 'bug'],
                            description: 'Type of work item to scan',
                        },
                        targetId: {
                            type: 'string',
                            description: 'The work item ID to scan',
                        },
                        targetTitle: {
                            type: 'string',
                            description: 'Optional title for context',
                        },
                    },
                    required: ['platform', 'targetType', 'targetId'],
                },
            },
            // ====================================================================
            // PHASE 3 — PO Toolkit AI Intelligence (5 tools)
            // ====================================================================
            {
                name: 'generate_acceptance_criteria',
                description: 'AI-generate Gherkin or bullet-point acceptance criteria for a work item. Perfect for POs and BAs.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        workItemId: {
                            type: 'string',
                            description: 'The work item ID',
                        },
                        format: {
                            type: 'string',
                            enum: ['gherkin', 'bullet', 'checklist'],
                            description: 'Output format for acceptance criteria',
                            default: 'gherkin',
                        },
                    },
                    required: ['platform', 'workItemId'],
                },
            },
            {
                name: 'estimate_story_points',
                description: 'AI-powered story point estimation with detailed reasoning, complexity factors, and confidence level.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        workItemId: {
                            type: 'string',
                            description: 'The work item ID to estimate',
                        },
                    },
                    required: ['platform', 'workItemId'],
                },
            },
            {
                name: 'suggest_labels',
                description: 'AI-powered label/tag suggestions based on work item content, title, and description patterns.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        workItemId: {
                            type: 'string',
                            description: 'The work item ID',
                        },
                    },
                    required: ['platform', 'workItemId'],
                },
            },
            {
                name: 'recommend_assignment',
                description: 'AI-powered team member assignment recommendation based on expertise, workload, and availability.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        workItemId: {
                            type: 'string',
                            description: 'The work item ID',
                        },
                    },
                    required: ['platform', 'workItemId'],
                },
            },
            {
                name: 'quick_summary',
                description: 'AI-generated concise summary of a work item including status, key points, blockers, and next steps.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        platform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'The platform',
                        },
                        workItemId: {
                            type: 'string',
                            description: 'The work item ID',
                        },
                    },
                    required: ['platform', 'workItemId'],
                },
            },
            // ====================================================================
            // PHASE 4 — Cross-Platform Migration (1 tool)
            // ====================================================================
            {
                name: 'migrate_work_item',
                description: 'Migrate a work item between Jira and Azure DevOps (bidirectional). Copies fields, maps types, and optionally includes comments and attachments.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        sourcePlatform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'Source platform',
                        },
                        targetPlatform: {
                            type: 'string',
                            enum: ['jira', 'ado'],
                            description: 'Target platform (must differ from source)',
                        },
                        workItemId: {
                            type: 'string',
                            description: 'The work item ID to migrate',
                        },
                        targetProject: {
                            type: 'string',
                            description: 'Target project key/name to create the item in',
                        },
                        includeComments: {
                            type: 'boolean',
                            description: 'Whether to copy comments',
                            default: true,
                        },
                        includeAttachments: {
                            type: 'boolean',
                            description: 'Whether to copy attachments',
                            default: false,
                        },
                    },
                    required: ['sourcePlatform', 'targetPlatform', 'workItemId', 'targetProject'],
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const toolArgs = args ?? {};
    try {
        let result;
        switch (name) {
            case 'analyze_work_item':
                result = await client.analyzeWorkItem(toolArgs.platform, toolArgs.itemId, toolArgs.analysisType);
                break;
            case 'search_work_items':
                result = await client.searchWorkItems(toolArgs.platform, toolArgs.query, toolArgs.maxResults);
                break;
            case 'create_work_item':
                result = await client.createWorkItem(toolArgs.platform, toolArgs);
                break;
            case 'update_work_item':
                result = await client.updateWorkItem(toolArgs.platform, toolArgs.itemId, toolArgs.updates);
                break;
            case 'add_comment':
                result = await client.addComment(toolArgs.platform, toolArgs.itemId, toolArgs.comment);
                break;
            case 'get_my_work_items':
                result = await client.getMyWorkItems(toolArgs.platform, toolArgs.status, toolArgs.maxResults);
                break;
            case 'generate_report':
                result = await client.generateReport(toolArgs.platform, toolArgs.project, toolArgs.reportType, toolArgs.sprintId);
                break;
            case 'ai_chat':
                result = await client.aiChat(toolArgs.message, toolArgs.context);
                break;
            // ================================================================
            // PHASE 1 — Already-built MCP endpoints (7 tools)
            // ================================================================
            case 'breakdown_epic':
                result = await client.breakdownEpic(toolArgs.platform, toolArgs.epicId, toolArgs.createStories, toolArgs.phase);
                break;
            case 'generate_test_cases':
                result = await client.generateTestCases(toolArgs.platform, toolArgs.workItemId, toolArgs.createTestCases, toolArgs.testType);
                break;
            case 'create_subtasks':
                result = await client.createSubtasks(toolArgs.platform, toolArgs.parentId, toolArgs.subtasks);
                break;
            case 'link_work_items':
                result = await client.linkWorkItems(toolArgs.platform, toolArgs.sourceId, toolArgs.targetId, toolArgs.linkType, toolArgs.comment);
                break;
            case 'clone_work_item':
                result = await client.cloneWorkItem(toolArgs.platform, toolArgs.workItemId, toolArgs.titlePrefix, toolArgs.includeAttachments);
                break;
            case 'bulk_update':
                result = await client.bulkUpdate(toolArgs.platform, toolArgs.workItemIds, toolArgs.updates, toolArgs.addComment);
                break;
            case 'manage_sprint':
                result = await client.manageSprint(toolArgs.platform, toolArgs.action, toolArgs.sprintId, toolArgs.workItemId, toolArgs.targetSprintId);
                break;
            // ================================================================
            // PHASE 2 — Analytics & Intelligence (9 tools)
            // ================================================================
            case 'daily_focus':
                result = await client.dailyFocus(toolArgs.role);
                break;
            case 'risk_radar':
                result = await client.riskRadar();
                break;
            case 'flow_metrics':
                result = await client.flowMetrics();
                break;
            case 'forecast':
                result = await client.forecast();
                break;
            case 'coaching_actions':
                result = await client.coachingActions(toolArgs.role);
                break;
            case 'delivery_trends':
                result = await client.deliveryTrends();
                break;
            case 'work_distribution':
                result = await client.workDistribution();
                break;
            case 'sprint_predictability':
                result = await client.sprintPredictability();
                break;
            case 'confidence_scan':
                result = await client.confidenceScan(toolArgs.platform, toolArgs.targetType, toolArgs.targetId, toolArgs.targetTitle);
                break;
            // ================================================================
            // PHASE 3 — PO Toolkit AI Intelligence (5 tools)
            // ================================================================
            case 'generate_acceptance_criteria':
                result = await client.generateAcceptanceCriteria(toolArgs.platform, toolArgs.workItemId, toolArgs.format);
                break;
            case 'estimate_story_points':
                result = await client.estimateStoryPoints(toolArgs.platform, toolArgs.workItemId);
                break;
            case 'suggest_labels':
                result = await client.suggestLabels(toolArgs.platform, toolArgs.workItemId);
                break;
            case 'recommend_assignment':
                result = await client.recommendAssignment(toolArgs.platform, toolArgs.workItemId);
                break;
            case 'quick_summary':
                result = await client.quickSummary(toolArgs.platform, toolArgs.workItemId);
                break;
            // ================================================================
            // PHASE 4 — Cross-Platform Migration (1 tool)
            // ================================================================
            case 'migrate_work_item':
                result = await client.migrateWorkItem(toolArgs.sourcePlatform, toolArgs.targetPlatform, toolArgs.workItemId, toolArgs.targetProject, toolArgs.includeComments, toolArgs.includeAttachments);
                break;
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('AJAIA MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map