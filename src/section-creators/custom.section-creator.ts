import { IInputs } from '../index';
import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { Utils } from '../utils';
import { ISectionCreator } from './section-creator.interface';
import { ISection } from '../services/comment-builder';
import * as core from "@actions/core";

export class CustomSectionCreator implements ISectionCreator {
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
        const resolvedTemple = Utils.resolveTemplate(inputs.template, {
            issueBody: issue?.body || '',
            issueTitle: issue?.title || '',
            author: issue.user.login || '',
        });

        core.notice(`[ASK GPT]: ${resolvedTemple}`);
        const message = (
            await openaiClient.createCompletion({
                model: inputs.model,
                prompt: resolvedTemple,
                max_tokens: inputs.maxTokens,
            })
        ).data.choices[0].text;
        core.notice(`[Response GPT]: ${message}`);
        return {
            title: '[GPT custom]',
            description: message,
        };
    }
}
