import { OpenAI } from 'openai';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import { ISection } from '../services/comment-builder';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { Injectable } from 'type-chef-di';
import { PlaceholderResolver } from '../services/placeholder-resolver';
import { IOctokit } from '../interfaces/octokit.interface';
import { Utils } from '../services/utils';

@Injectable()
export class CustomSectionCreator implements ISectionCreator {
    constructor(private readonly placeholderResolver: PlaceholderResolver) {
    }

    isAddSection(inputs: IInputs, config?: Partial<IConfig>): boolean {
        return inputs.addCustomSection.length > 0 && config?.sections?.custom?.length > 0;
    }

    async createSection(
        inputs: IInputs,
        openaiClient: OpenAI,
        octokit: IOctokit,
        config: Partial<IConfig>,
    ): Promise<ISection[]> {

        const resultSections: ISection[] = [];
        for (const sectionConfig of config.sections.custom) {
            const isIncludeSection =
                inputs.addCustomSection.includes(sectionConfig?.id || sectionConfig.title) ||
                inputs.addCustomSection[0] == '*';

            if (!isIncludeSection) {
                continue;
            }
            const resolvedPrompt = await this.placeholderResolver.resolve(sectionConfig.prompt);
            const message = await Utils.askGpt(openaiClient, resolvedPrompt, config, inputs);
            resultSections.push({ title: sectionConfig.title, description: message, prompt: resolvedPrompt });
        }

        return resultSections;
    }
}
