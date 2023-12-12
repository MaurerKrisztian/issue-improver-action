import { OpenAI } from 'openai';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { Injectable } from 'type-chef-di';
import { PlaceholderResolver } from '../services/placeholder-resolver';
import { IOctokit } from '../interfaces/octokit.interface';
import { Utils } from '../services/utils';

@Injectable()
export class SummariseSectionCreator implements ISectionCreator {
    constructor(private readonly placeholderResolver: PlaceholderResolver) {}
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return inputs.addSummarySection && !!config.sections?.summary?.prompt && !!config.sections?.summary?.title;
    }
    async createSection(
        inputs: IInputs,
        openaiClient: OpenAI,
        octokit: IOctokit,
        config: Partial<IConfig>,
    ): Promise<ISection[]> {
        const prompt = await this.placeholderResolver.resolve(config?.sections?.summary?.prompt);

        return [
            {
                prompt: prompt,
                title: config.sections.summary.title,
                description: await Utils.askGpt(openaiClient, prompt, config, inputs),
            },
        ];
    }
}
