import { IssueCommentsPlaceholder } from './issue-comments.placeholder';
import { IPlaceholderProvider } from './interfaces/placeholder-provider.interface';
import { Type } from 'type-chef-di';
import { AllLabelsPlaceholder } from './all-labels.placeholder';
import { OpenIssuesPlaceholder } from './openIssues.placeholder';
import { container } from '../index';
import * as github from '@actions/github';

/**
 * all available placeholder
 */

export const placeholderMap: { [key: string]: () => string | Promise<string> } = {
    /**
     * {{issueBody}}
     */
    issueBody: () => {
        return github.context.payload.issue?.body;
    },

    /**
     * {{issueBody}}
     */
    issueTitle: async () => {
        return github.context.payload.issue?.title;
    },

    /**
     * {{issueAuthor}}
     */
    issueAuthor: () => {
        return github.context.payload.issue?.user?.login;
    },

    /**
     * {{issueNumber}}
     */
    issueNumber: () => {
        return github.context.payload.issue?.number?.toString();
    },

    /**
     * {{issueBody}} All issue comments in Json string format.
     */
    issueComments: fromPlaceholderProvider(IssueCommentsPlaceholder),

    /**
     * {{allLabels}} All available repository label.
     */
    allLabels: fromPlaceholderProvider(AllLabelsPlaceholder),

    /**
     * {{openIssues}} All Open issues in JSON string format.
     */
    openIssues: fromPlaceholderProvider(OpenIssuesPlaceholder),
};

function fromPlaceholderProvider(type: Type<IPlaceholderProvider>): () => string | Promise<string> {
    return async () => {
        return (await container.resolveByType(type)).provideValue();
    };
}
