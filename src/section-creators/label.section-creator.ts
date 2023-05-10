import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { Injectable } from 'type-chef-di';
import { PlaceholderResolver } from '../services/placeholder-resolver';

@Injectable()
export class LabelSectionCreator implements ISectionCreator {
    constructor(readonly placeholderResolver: PlaceholderResolver) {}
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return (
            inputs.addLabelSection &&
            !!config.sections?.labelSuggestion?.prompt &&
            !!config.sections?.labelSuggestion?.title
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
        const prompt = await this.placeholderResolver.resolve(config?.sections?.labelSuggestion?.prompt);
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
                title: config?.sections?.labelSuggestion?.title,
                description: message,
            },
        ];
    }
}
