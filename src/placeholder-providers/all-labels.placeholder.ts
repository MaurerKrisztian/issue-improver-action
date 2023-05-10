import { IPlaceholderProvider } from './interfaces/placeholder-provider.interface';
import { Inject, Injectable } from 'type-chef-di';
import { ILabel } from '../interfaces/labels.interface';
import { context } from '@actions/github';
import * as core from '@actions/core';
import { IOctokit } from './issue-comments.placeholder';
@Injectable()
export class AllLabelsPlaceholder implements IPlaceholderProvider {
    constructor(@Inject('octokit') private readonly octokit: IOctokit) {}
    async provideValue(): Promise<string> {
        const getAllLabelsForRepository = async (
            owner: string,
            repo: string,
        ): Promise<Pick<ILabel, 'name' | 'description'>[]> => {
            const response = await this.octokit.rest.issues.listLabelsForRepo({
                owner,
                repo,
            });
            return response?.data.map((label) => ({ name: label.name, description: label.description }));
        };

        const labels = await getAllLabelsForRepository(context.repo.owner, context.repo.repo);
        core.notice(`Labels: ${JSON.stringify(labels)}`);
        return JSON.stringify(labels);
    }
}
