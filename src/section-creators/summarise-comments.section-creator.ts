import { OpenAI } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { Injectable } from 'type-chef-di';
import { PlaceholderResolver } from '../services/placeholder-resolver';
import { Utils } from '../services/utils';

@Injectable()
export class SummariseCommentsSectionCreator implements ISectionCreator {
    constructor(private readonly placeholderResolver: PlaceholderResolver) {}
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return (
            inputs.addCommentSummarySection &&
            !!config.sections.commentSummary.prompt &&
            !!config.sections.commentSummary.title
        );
    }
    async createSection(
        inputs: IInputs,
        openaiClient: OpenAI,
        octokit: Octokit &
            Api & {
                paginate: PaginateInterface;
            },
        config: Partial<IConfig>,
    ): Promise<ISection[]> {
        const prompt = await this.placeholderResolver.resolve(config?.sections?.commentSummary?.prompt);

        return [
            {
                prompt: prompt,
                title: config.sections.commentSummary.title,
                description: await Utils.askGpt(openaiClient, prompt, config, inputs),
            },
        ];
    }
}
