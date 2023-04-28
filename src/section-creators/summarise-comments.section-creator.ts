import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import * as core from '@actions/core';
import { Utils } from '../services/utils';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { IIssueComment } from '../interfaces/issue-comment.interface';

export class SummariseCommentsSectionCreator implements ISectionCreator {
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return (
            inputs.addCommentSummarySection &&
            !!config.sections.commentSummary.prompt &&
            !!config.sections.commentSummary.title
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

        const comments = await this.getAllCommentsForIssue(
            context.repo.owner,
            context.repo.repo,
            issue.number,
            inputs.githubToken,
        );

        core.notice(`Comments: ${JSON.stringify(comments)}`);

        const prompt = Utils.resolveTemplate(config?.sections?.commentSummary?.prompt, {
            issueTitle: issue.title,
            issueBody: issue.body,
            issueComments: JSON.stringify(comments),
        });

        const message = (
            await openaiClient.createCompletion({
                model: inputs.model,
                prompt: prompt,
                max_tokens: inputs.maxTokens,
            })
        ).data.choices[0].text;
        return [
            {
                prompt: prompt,
                title: config.sections.commentSummary.title,
                description: message,
            },
        ];
    }

    private async getAllCommentsForIssue(
        owner: string,
        repo: string,
        issueNumber: number,
        accessToken: string,
    ): Promise<IIssueComment[]> {
        const octokit = new Octokit({ auth: accessToken });
        const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
            owner,
            repo,
            issue_number: issueNumber,
        });
        return response.data as IIssueComment[];
    }
}
