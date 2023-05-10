import { IssueBodyPlaceholder } from './issue-body.placeholder';
import { IssueTitlePlaceholder } from './issue-title.placeholder';
import { IssueCommentsPlaceholder } from './issue-comments.placeholder';
import { IPlaceholderProvider } from './interfaces/placeholder-provider.interface';
import { Type } from 'type-chef-di';
import { IssueAuthorPlaceholder } from './issue-author.placeholder';
import { AllLabelsPlaceholder } from './all-labels.placeholder';
import { OpenIssuesPlaceholder } from './openIssues.placeholder';

// the template variable will be resolved by thies. e.g. {{issueBody}} will resolved by IssueBodyPlaceholder
export const placeholderProviders: { [key: string]: Type<IPlaceholderProvider> } = {
    issueBody: IssueBodyPlaceholder,
    issueTitle: IssueTitlePlaceholder,
    issueComments: IssueCommentsPlaceholder,
    issueAuthor: IssueAuthorPlaceholder,
    allLabels: AllLabelsPlaceholder,
    openIssues: OpenIssuesPlaceholder,
};
