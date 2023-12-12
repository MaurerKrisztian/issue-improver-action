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
export class RelatedIssuesSectionCreator implements ISectionCreator {
    constructor(private readonly placeholderResolver: PlaceholderResolver) {}
    isAddSection(inputs: IInputs, config: Partial<IConfig>) {
        return (
            inputs.addRelatedIssuesSection &&
            !!config.sections.relatedIssues.prompt &&
            !!config.sections.relatedIssues.title
        );
    }
    async createSection(
        inputs: IInputs,
        openaiClient: OpenAI,
        octokit: IOctokit,
        config: Partial<IConfig>,
    ): Promise<ISection[]> {
        const resolvedTemple = await this.placeholderResolver.resolve(config.sections.relatedIssues.prompt);

        return [
            {
                prompt: resolvedTemple,
                title: config.sections.relatedIssues.title,
                description: await Utils.askGpt(openaiClient, resolvedTemple, config, inputs),
            },
        ];
    }
}
