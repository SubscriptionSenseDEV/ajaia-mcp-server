/**
 * AJAIA API Client
 * Communicates with the AJAIA Vercel backend
 */
export declare class AjaiaClient {
    private baseUrl;
    private apiKey;
    constructor(baseUrl: string, apiKey: string);
    private request;
    /**
     * Analyze a work item
     */
    analyzeWorkItem(platform: string, itemId: string, analysisType?: string): Promise<any>;
    /**
     * Search for work items
     */
    searchWorkItems(platform: string, query: string, maxResults?: number): Promise<any>;
    /**
     * Create a new work item
     */
    createWorkItem(platform: string, data: {
        project: string;
        title: string;
        description?: string;
        type: string;
        priority?: string;
        assignee?: string;
    }): Promise<any>;
    /**
     * Update an existing work item
     */
    updateWorkItem(platform: string, itemId: string, updates: Record<string, any>): Promise<any>;
    /**
     * Add a comment to a work item
     */
    addComment(platform: string, itemId: string, comment: string): Promise<any>;
    /**
     * Get work items assigned to the current user
     */
    getMyWorkItems(platform: string, status?: string, maxResults?: number): Promise<any>;
    /**
     * Generate a report
     */
    generateReport(platform: string, project: string, reportType: string, sprintId?: string): Promise<any>;
    /**
     * AI Chat - have a conversation with AJAIA
     */
    aiChat(message: string, context?: Record<string, any>): Promise<any>;
    /**
     * AI-powered epic breakdown into features, stories, tasks, and test cases.
     * Optionally auto-creates them in Jira/ADO.
     */
    breakdownEpic(platform: string, epicId: string, createStories?: boolean, phase?: string): Promise<any>;
    /**
     * AI-generate test cases from a work item and optionally create them in the platform.
     */
    generateTestCases(platform: string, workItemId: string, createTestCases?: boolean, testType?: string): Promise<any>;
    /**
     * Batch create child tasks/subtasks under a parent work item.
     */
    createSubtasks(platform: string, parentId: string, subtasks: Array<{
        title: string;
        description?: string;
        assignee?: string;
        estimatedHours?: number;
    }>): Promise<any>;
    /**
     * Create a relationship/link between two work items.
     */
    linkWorkItems(platform: string, sourceId: string, targetId: string, linkType: string, comment?: string): Promise<any>;
    /**
     * Deep clone a work item with all fields, labels, and auto-link to original.
     */
    cloneWorkItem(platform: string, workItemId: string, titlePrefix?: string, includeAttachments?: boolean): Promise<any>;
    /**
     * Update up to 50 work items at once.
     */
    bulkUpdate(platform: string, workItemIds: string[], updates?: Record<string, any>, addComment?: string): Promise<any>;
    /**
     * Sprint management: list sprints, get details, get items, move items.
     */
    manageSprint(platform: string, action: string, sprintId?: string, workItemId?: string, targetSprintId?: string): Promise<any>;
    /**
     * Role-aware daily priorities, top actions, and focus metrics.
     */
    dailyFocus(role?: string): Promise<any>;
    /**
     * Comprehensive risk scoring with contributing factors.
     */
    riskRadar(): Promise<any>;
    /**
     * Flow metrics: cycle time, lead time, throughput, bottlenecks.
     */
    flowMetrics(): Promise<any>;
    /**
     * Project completion forecasting with optimistic/expected/pessimistic scenarios.
     */
    forecast(): Promise<any>;
    /**
     * AI-generated coaching suggestions for team improvement.
     */
    coachingActions(role?: string): Promise<any>;
    /**
     * Sprint-by-sprint velocity and delivery trend analysis.
     */
    deliveryTrends(): Promise<any>;
    /**
     * Workload distribution analysis across team members.
     */
    workDistribution(): Promise<any>;
    /**
     * Sprint commitment vs delivery predictability metrics.
     */
    sprintPredictability(): Promise<any>;
    /**
     * Evidence-backed confidence scan for epics, features, or stories.
     */
    confidenceScan(platform: string, targetType: string, targetId: string, targetTitle?: string): Promise<any>;
    /**
     * AI-generate Gherkin acceptance criteria for a work item.
     */
    generateAcceptanceCriteria(platform: string, workItemId: string, format?: string): Promise<any>;
    /**
     * AI-powered story point estimation with reasoning.
     */
    estimateStoryPoints(platform: string, workItemId: string): Promise<any>;
    /**
     * AI-powered label/tag suggestions based on work item content.
     */
    suggestLabels(platform: string, workItemId: string): Promise<any>;
    /**
     * AI-powered team member assignment recommendation.
     */
    recommendAssignment(platform: string, workItemId: string): Promise<any>;
    /**
     * AI-generated concise summary of a work item.
     */
    quickSummary(platform: string, workItemId: string): Promise<any>;
    /**
     * Migrate a work item between ADO and Jira (bidirectional).
     */
    migrateWorkItem(sourcePlatform: string, targetPlatform: string, workItemId: string, targetProject: string, includeComments?: boolean, includeAttachments?: boolean): Promise<any>;
    /**
     * Validate API key
     */
    validateKey(): Promise<boolean>;
}
//# sourceMappingURL=client.d.ts.map