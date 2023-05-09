import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import { Utils } from '../services/utils';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { IIssueComment } from '../interfaces/issue-comment.interface';
import { encode } from 'gpt-tokenizer';

export class SummariseCommentsSectionCreator implements ISectionCreator {
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return (
            inputs.addCommentSummarySection &&
            !!config.sections.commentSummary.prompt &&
            !!config.sections.commentSummary.title
        );
    }
    
    async generatePromptChunks(prompt: string, maxTokens: number) {
        const promptTokens = encode(prompt)
        const chunks = [];

        let currentChunk = '';

        for (const token of promptTokens) {
            if ((currentChunk + ' ' + token).length <= maxTokens) {
                currentChunk += ' ' + token;
            } else {
                chunks.push(currentChunk.trim());
                currentChunk = token;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
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

        const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
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

        const prompt = Utils.resolveTemplate(config?.sections?.commentSummary?.prompt, {
            issueTitle: issue.title,
            issueBody: issue.body,
            issueComments: JSON.stringify(issueComments),
        });

        const promptChunks = await this.generatePromptChunks(prompt, inputs.maxTokens / 2);
        const messageParts = ['Merge all the summarization data into one message. Each data chunk is separated by ---'];

        for (const chunk of promptChunks) {
            const result = (
                await openaiClient.createCompletion({
                    model: inputs.model,
                    prompt: chunk,
                    max_tokens: inputs.maxTokens,
                })
            ).data.choices[0].text;

            messageParts.push(result);
        }

        const message = (
            await openaiClient.createCompletion({
                model: inputs.model,
                prompt: messageParts.join('---'),
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
}

