import { OpenAIApi } from 'openai';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { Injectable } from 'type-chef-di';
import { IOctokit } from '../placeholder-providers/issue-comments.placeholder';
import { PlaceholderResolver } from '../services/placeholder-resolver';

@Injectable()
export class SummariseSectionCreator implements ISectionCreator {
    constructor(private readonly placeholderResolver: PlaceholderResolver) {}
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return inputs.addSummarySection && !!config.sections?.summary?.prompt && !!config.sections?.summary?.title;
    }
    async createSection(
        inputs: IInputs,
        openaiClient: OpenAIApi,
        octokit: IOctokit,
        config: Partial<IConfig>,
    ): Promise<ISection[]> {
        const prompt = await this.placeholderResolver.resolve(config?.sections?.summary?.prompt);

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
