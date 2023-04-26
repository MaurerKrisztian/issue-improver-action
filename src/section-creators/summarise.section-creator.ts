import { IInputs } from '../index';
import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from './section-creator.interface';
import * as core from '@actions/core';

export class SummariseSectionCreator implements ISectionCreator {
    isAddSection(inputs: IInputs) {
        return true;
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

        core.notice(`[Ask GPT]: ${`Summarize this github issue: ${issue.title} ${issue.body}`}`);
        const message = (
            await openaiClient.createCompletion({
                model: inputs.model,
                prompt: `Summarize this github issue: ${issue.title} ${issue.body}`,
                max_tokens: inputs.maxTokens,
            })
        ).data.choices[0].text;
        core.notice(`[Response GPT]: ${message}`);
        return {
            title: '[GPT Summarization]',
            description: message,
        };
    }
}
