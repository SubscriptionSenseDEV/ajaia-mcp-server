/**
 * AJAIA API Client
 * Communicates with the AJAIA Vercel backend
 */
export class AjaiaClient {
    baseUrl;
    apiKey;
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.apiKey = apiKey;
    }
    async request(endpoint, method = 'GET', body) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-MCP-API-Key': this.apiKey,
        };
        const options = {
            method,
            headers,
        };
        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorText;
                }
                catch {
                    errorMessage = errorText || `HTTP ${response.status}`;
                }
                throw new Error(`API Error (${response.status}): ${errorMessage}`);
            }
            const data = await response.json();
            // Handle nested response structure from Vercel
            if (data.body && typeof data.body === 'string') {
                try {
                    return JSON.parse(data.body);
                }
                catch {
                    return data;
                }
            }
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Request failed: ${String(error)}`);
        }
    }
    /**
     * Analyze a work item
     */
    async analyzeWorkItem(platform, itemId, analysisType = 'full') {
        return this.request('/api/mcp/analyze', 'POST', {
            platform,
            itemId,
            analysisType,
        });
    }
    /**
     * Search for work items
     */
    async searchWorkItems(platform, query, maxResults = 50) {
        return this.request('/api/mcp/search', 'POST', {
            platform,
            query,
            maxResults,
        });
    }
    /**
     * Create a new work item
     */
    async createWorkItem(platform, data) {
        return this.request('/api/mcp/create', 'POST', {
            platform,
            ...data,
        });
    }
    /**
     * Update an existing work item
     */
    async updateWorkItem(platform, itemId, updates) {
        return this.request('/api/mcp/update', 'POST', {
            platform,
            workItemId: itemId,
            updates,
        });
    }
    /**
     * Add a comment to a work item
     */
    async addComment(platform, itemId, comment) {
        return this.request('/api/mcp/comment', 'POST', {
            platform,
            workItemId: itemId,
            comment,
        });
    }
    /**
     * Get work items assigned to the current user
     */
    async getMyWorkItems(platform, status, maxResults = 20) {
        return this.request('/api/mcp/my-items', 'POST', {
            platform,
            status,
            maxResults,
        });
    }
    /**
     * Generate a report
     */
    async generateReport(platform, project, reportType, sprintId) {
        return this.request('/api/mcp/report', 'POST', {
            platform,
            project,
            reportType,
            sprintId,
        });
    }
    /**
     * AI Chat - have a conversation with AJAIA
     */
    async aiChat(message, context) {
        return this.request('/api/mcp/chat', 'POST', {
            message,
            context,
        });
    }
    // ==========================================================================
    // PHASE 1 — Already-built MCP endpoints (7 tools)
    // ==========================================================================
    /**
     * AI-powered epic breakdown into features, stories, tasks, and test cases.
     * Optionally auto-creates them in Jira/ADO.
     */
    async breakdownEpic(platform, epicId, createStories = true, phase = 'full') {
        return this.request('/api/mcp/breakdown-epic', 'POST', {
            platform,
            epicId,
            createStories,
            phase,
        });
    }
    /**
     * AI-generate test cases from a work item and optionally create them in the platform.
     */
    async generateTestCases(platform, workItemId, createTestCases = true, testType = 'functional') {
        return this.request('/api/mcp/generate-test-cases', 'POST', {
            platform,
            workItemId,
            createTestCases,
            testType,
        });
    }
    /**
     * Batch create child tasks/subtasks under a parent work item.
     */
    async createSubtasks(platform, parentId, subtasks) {
        return this.request('/api/mcp/create-subtasks', 'POST', {
            platform,
            parentId,
            subtasks,
        });
    }
    /**
     * Create a relationship/link between two work items.
     */
    async linkWorkItems(platform, sourceId, targetId, linkType, comment) {
        return this.request('/api/mcp/link-items', 'POST', {
            platform,
            sourceId,
            targetId,
            linkType,
            comment,
        });
    }
    /**
     * Deep clone a work item with all fields, labels, and auto-link to original.
     */
    async cloneWorkItem(platform, workItemId, titlePrefix = '[Clone]', includeAttachments = false) {
        return this.request('/api/mcp/clone-item', 'POST', {
            platform,
            workItemId,
            titlePrefix,
            includeAttachments,
        });
    }
    /**
     * Update up to 50 work items at once.
     */
    async bulkUpdate(platform, workItemIds, updates, addComment) {
        return this.request('/api/mcp/bulk-update', 'POST', {
            platform,
            workItemIds,
            updates,
            addComment,
        });
    }
    /**
     * Sprint management: list sprints, get details, get items, move items.
     */
    async manageSprint(platform, action, sprintId, workItemId, targetSprintId) {
        return this.request('/api/mcp/sprint', 'POST', {
            platform,
            action,
            sprintId,
            workItemId,
            targetSprintId,
        });
    }
    // ==========================================================================
    // PHASE 2 — Analytics & Intelligence (9 tools)
    // ==========================================================================
    /**
     * Role-aware daily priorities, top actions, and focus metrics.
     */
    async dailyFocus(role = 'manager') {
        return this.request('/api/mcp/analytics/daily-focus', 'POST', { role });
    }
    /**
     * Comprehensive risk scoring with contributing factors.
     */
    async riskRadar() {
        return this.request('/api/mcp/analytics/risk-radar', 'POST', {});
    }
    /**
     * Flow metrics: cycle time, lead time, throughput, bottlenecks.
     */
    async flowMetrics() {
        return this.request('/api/mcp/analytics/flow-metrics', 'POST', {});
    }
    /**
     * Project completion forecasting with optimistic/expected/pessimistic scenarios.
     */
    async forecast() {
        return this.request('/api/mcp/analytics/forecast', 'POST', {});
    }
    /**
     * AI-generated coaching suggestions for team improvement.
     */
    async coachingActions(role = 'manager') {
        return this.request('/api/mcp/analytics/coaching-actions', 'POST', { role });
    }
    /**
     * Sprint-by-sprint velocity and delivery trend analysis.
     */
    async deliveryTrends() {
        return this.request('/api/mcp/analytics/delivery-trends', 'POST', {});
    }
    /**
     * Workload distribution analysis across team members.
     */
    async workDistribution() {
        return this.request('/api/mcp/analytics/work-distribution', 'POST', {});
    }
    /**
     * Sprint commitment vs delivery predictability metrics.
     */
    async sprintPredictability() {
        return this.request('/api/mcp/analytics/predictability', 'POST', {});
    }
    /**
     * Evidence-backed confidence scan for epics, features, or stories.
     */
    async confidenceScan(platform, targetType, targetId, targetTitle) {
        return this.request('/api/mcp/confidence-scan', 'POST', {
            platform,
            targetType,
            targetId,
            targetTitle,
        });
    }
    // ==========================================================================
    // PHASE 3 — PO Toolkit AI Intelligence (5 tools)
    // ==========================================================================
    /**
     * AI-generate Gherkin acceptance criteria for a work item.
     */
    async generateAcceptanceCriteria(platform, workItemId, format = 'gherkin') {
        return this.request('/api/mcp/generate-ac', 'POST', {
            platform,
            workItemId,
            format,
        });
    }
    /**
     * AI-powered story point estimation with reasoning.
     */
    async estimateStoryPoints(platform, workItemId) {
        return this.request('/api/mcp/estimate-points', 'POST', {
            platform,
            workItemId,
        });
    }
    /**
     * AI-powered label/tag suggestions based on work item content.
     */
    async suggestLabels(platform, workItemId) {
        return this.request('/api/mcp/suggest-labels', 'POST', {
            platform,
            workItemId,
        });
    }
    /**
     * AI-powered team member assignment recommendation.
     */
    async recommendAssignment(platform, workItemId) {
        return this.request('/api/mcp/recommend-assignee', 'POST', {
            platform,
            workItemId,
        });
    }
    /**
     * AI-generated concise summary of a work item.
     */
    async quickSummary(platform, workItemId) {
        return this.request('/api/mcp/quick-summary', 'POST', {
            platform,
            workItemId,
        });
    }
    // ==========================================================================
    // PHASE 4 — Cross-Platform Migration (1 tool)
    // ==========================================================================
    /**
     * Migrate a work item between ADO and Jira (bidirectional).
     */
    async migrateWorkItem(sourcePlatform, targetPlatform, workItemId, targetProject, includeComments = true, includeAttachments = false) {
        return this.request('/api/mcp/migrate', 'POST', {
            sourcePlatform,
            targetPlatform,
            workItemId,
            targetProject,
            includeComments,
            includeAttachments,
        });
    }
    /**
     * Validate API key
     */
    async validateKey() {
        try {
            await this.request('/api/mcp/validate', 'POST', {});
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=client.js.map