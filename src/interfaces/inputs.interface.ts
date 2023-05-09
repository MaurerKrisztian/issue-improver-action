export interface IInputs {
    apiKey: string;
    githubToken: string;
    model: string;
    addRelatedIssuesSection: boolean;
    addSummarySection: boolean;
    addCustomSection: string[];
    addLabelSection: boolean;
    addCommentSummarySection: boolean;
    maxTokens: number;
    configFile: string;
    debug: boolean;
}
