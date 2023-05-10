import { IPlaceholderProvider } from './interfaces/placeholder-provider.interface';
import { context } from '@actions/github';
import { IIssueComment } from '../interfaces/issue-comment.interface';
import { Inject, Injectable } from 'type-chef-di';
import { IOctokit } from '../interfaces/octokit.interface';

@Injectable()
export class IssueCommentsPlaceholder implements IPlaceholderProvider {
    constructor(@Inject('octokit') private readonly octokit: IOctokit) {}
    async provideValue(): Promise<string> {
        const issue = context.payload.issue;

        const response = await this.octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue.number,
        });

        const comments = response.data as IIssueComment[];
        const issueComments = comments
            .map((comment) => {
                return { body: comment?.body, created_at: comment?.created_at, author: comment?.user?.login };
            })
            .filter((comment) => comment.author !== 'github-actions[bot]');

        return JSON.stringify(issueComments);
    }
}
