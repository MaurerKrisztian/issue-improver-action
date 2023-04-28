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

export class SummariseSectionCreator implements ISectionCreator {
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return inputs.addSummarySection && !!config.sections.summary.prompt && !!config.sections.summary.title;
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

        const prompt = Utils.resolveTemplate(config?.sections?.summary?.prompt, {
            issueTitle: issue.title,
            issueBody: issue.body,
        });

        core.notice(`[Ask GPT]: ${prompt}`);

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
                title: config.sections.summary.title,
                description: message,
            },
        ];
    }
}
