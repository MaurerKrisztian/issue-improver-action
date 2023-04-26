import { IInputs } from '../index';
import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { Utils } from '../utils';
import { ISectionCreator } from './section-creator.interface';
import { ISection } from '../services/comment-builder';

export class RelatedIssuesSectionCreator implements ISectionCreator {
    isAddSection(inputs: IInputs) {
        return inputs.findRelatedIssues;
    }
    async createSection(
        inputs: IInputs,
        openaiClient: OpenAIApi,
        octokit: Octokit &
            Api & {
                paginate: PaginateInterface;
            },
    ): Promise<ISection> {
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

        const resolvedTemple = Utils.resolveTemplate(
            `Find related issues to: " {{issueTitle}} "  from thies issues: ${JSON.stringify(
                issues,
            )}. Make a list of issue title what is may related in this format [title](link)`,
            {
                issueBody: issue?.body || '',
                issueTitle: issue?.title || '',
                author: issue.user.login || '',
            },
        );

        const relatedIssuesResponse = await openaiClient.createCompletion({
            model: inputs.model,
            prompt: resolvedTemple,
            max_tokens: inputs.maxTokens,
        });
        const message = relatedIssuesResponse.data.choices[0].text;
        return {
            title: '[GPT Related issues]',
            description: message,
        };
    }
}
