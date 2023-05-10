import { IPlaceholderProvider } from './interfaces/placeholder-provider.interface';
import { context } from '@actions/github';
import { Inject, Injectable } from 'type-chef-di';
import { IOctokit } from '../interfaces/octokit.interface';

@Injectable()
export class OpenIssuesPlaceholder implements IPlaceholderProvider {
    constructor(@Inject('octokit') private readonly octokit: IOctokit) {}
    async provideValue(): Promise<string> {
        const issue = context.payload.issue;
        const [issuesResponse] = await Promise.all([
            this.octokit.rest.issues.listForRepo({
                owner: context.repo.owner,
                repo: context.repo.repo,
                state: 'open',
            }),
        ]);

        const openIssues = issuesResponse.data
            .map((issue) => ({
                number: issue.number,
                title: issue.title,
                link: issue.html_url,
            }))
            .filter((openIssue) => openIssue.number != issue.number);

        return JSON.stringify(openIssues);
    }
}
