import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { Utils } from '../services/utils';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import { ISection } from '../services/comment-builder';
import * as core from '@actions/core';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';

export class RelatedIssuesSectionCreator implements ISectionCreator {
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return (
            inputs.addRelatedIssuesSection &&
            !!config.sections.relatedIssues.prompt &&
            !!config.sections.relatedIssues.title
        );
    }
    async createSection(
        inputs: IInputs,
        openaiClient: OpenAIApi,
        octokit: Octokit &
            Api & {
                paginate: PaginateInterface;
            },
        config: Partial<IConfig>,
    ): Promise<ISection[]> {
        const issue = context.payload.issue;

        const issuesResponse = await octokit.rest.issues.listForRepo({
            owner: context.repo.owner,
            repo: context.repo.repo,
            state: 'open',
        });

        const issues = issuesResponse.data.map((issue) => ({
            number: issue.number,
            title: issue.title,
            link: issue.html_url,
        }));

        const resolvedTemple = Utils.resolveTemplate(config.sections.relatedIssues.prompt, {
            issueBody: issue?.body,
            issueTitle: issue?.title,
            author: issue.user.login,
            openIssues: JSON.stringify(issues),
        });

        core.notice(`[Ask GPT]: ${resolvedTemple}`);
        const relatedIssuesResponse = await openaiClient.createCompletion({
            model: inputs.model,
            prompt: resolvedTemple,
            max_tokens: inputs.maxTokens,
        });

        return [
            {
                prompt: resolvedTemple,
                title: config.sections.relatedIssues.title,
                description: relatedIssuesResponse.data.choices[0].text,
            },
        ];
    }
}
