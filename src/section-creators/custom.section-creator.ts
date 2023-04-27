import { IInputs } from '../index';
import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { Utils } from '../utils';
import { ISectionCreator } from './section-creator.interface';
import { ISection } from '../services/comment-builder';
import { IConfig } from '../config/config-reader';

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
            const resolvedPrompt = Utils.resolveTemplate(prompt, {
                issueBody: issue?.body || '',
                issueTitle: issue?.title || '',
                author: issue.user.login || '',
            });

            return (
                await openaiClient.createCompletion({
                    model: inputs.model,
                    prompt: resolvedPrompt,
                    max_tokens: inputs.maxTokens,
                })
            ).data.choices[0].text;
        };

        const resultSections: ISection[] = [];
        for (const sectionConfig of config.sections.custom) {
            const message = await askGpt(sectionConfig.prompt);
            resultSections.push({ title: sectionConfig.title, description: message });
        }

        return resultSections;
    }
}
