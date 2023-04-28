export interface IInputs {
    apiKey: string;
    template: string;
    githubToken: string;
    model: string;
    addRelatedIssuesSection: boolean;
    addSummarySection: boolean;
    maxTokens: number;
    configFile: string;
    debug: boolean;
}
