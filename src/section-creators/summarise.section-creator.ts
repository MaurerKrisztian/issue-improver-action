import { IInputs } from '../index';
import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from './section-creator.interface';
import * as core from '@actions/core';
import { IConfig } from '../config/config-reader';
import { Utils } from '../utils';

export class SummariseSectionCreator implements ISectionCreator {
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return !!config.sections.summary.prompt && !!config.sections.summary.title;
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

        const message = (
            await openaiClient.createCompletion({
                model: inputs.model,
                prompt: Utils.resolveTemplate(config?.sections?.summary?.prompt, {
                    issueTile: issue.title,
                    issueBody: issue.body,
                }),
                max_tokens: inputs.maxTokens,
            })
        ).data.choices[0].text;
        core.notice(`[Response GPT]: ${message}`);
        return [
            {
                title: config.sections.summary.prompt,
                description: message,
            },
        ];
    }
}
