import { IInputs } from '../index';
import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from './section-creator.interface';

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

        const message = (
            await openaiClient.createCompletion({
                model: inputs.model,
                prompt: `Summarize this github issue: ${issue.title} ${issue.body}`,
                max_tokens: inputs.maxTokens,
            })
        ).data.choices[0].text;
        return {
            title: '[GPT Summarization]',
            description: message,
        };
    }
}
