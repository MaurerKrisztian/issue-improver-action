import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { Utils } from '../services/utils';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import { ISection } from '../services/comment-builder';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import * as core from '@actions/core';

export class CustomSectionCreator implements ISectionCreator {
    isAddSection(inputs: IInputs, config?: Partial<IConfig>): boolean {
        return config?.sections?.custom?.length > 0;
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

        const askGpt = async (prompt: string) => {
            core.notice(`[Ask GPT]: ${prompt}`);
            return (
                await openaiClient.createCompletion({
                    model: inputs.model,
                    prompt: prompt,
                    max_tokens: inputs.maxTokens,
                })
            ).data.choices[0].text;
        };

        const resultSections: ISection[] = [];
        for (const sectionConfig of config.sections.custom) {
            const resolvedPrompt = Utils.resolveTemplate(sectionConfig.prompt, {
                issueBody: issue?.body,
                issueTitle: issue?.title,
                author: issue?.user?.login,
            });
            const message = await askGpt(resolvedPrompt);
            resultSections.push({ title: sectionConfig.title, description: message, prompt: resolvedPrompt });
        }

        return resultSections;
    }
}
