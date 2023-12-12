import { IConfig } from '../interfaces/config.interface';

export const defaultConfig: IConfig = {
    systemMessage: "You are an experienced software developer tasked with analyzing GitHub issues. Your role involves offering insightful feedback in response to these requests.",
    sections: {
        custom: [],
        relatedIssues: {
            title: 'Related Issues',
            prompt: "From the list of open issues: {{openIssues}}, identify the most relevant ones related to '{{issueTitle}}' and provide a brief description of their similarities. Just the very simmilar related issues to '{{issueTitle}}' shoud be included in the answer, if none is very similar, andwer with 'none',",
        },
        summary: {
            title: 'Summary',
            prompt: "Provide a concise summary of the main points and objectives presented in the issue '{{issueTitle}}' and its content: {{issueBody}}.",
        },
        commentSummary: {
            title: 'Comment summary',
            prompt: "Review the comments in {{issueComments}} for the issue '{{issueTitle}}' and its content: {{issueBody}}. Extract the key takeaways, notable updates, and any consensus reached, and provide a concise summary of the discussion.",
        },
        labelSuggestion: {
            title: 'Label Suggestion',
            prompt: "Analyze the issue '{{issueTitle}}' and its content: {{issueBody}}, and suggest appropriate labels from the available labels {{allLabels}} that accurately represent the topic, scope, and complexity of the issue. The response shoud only include a label and why its suitable.",
        },
    },
};
