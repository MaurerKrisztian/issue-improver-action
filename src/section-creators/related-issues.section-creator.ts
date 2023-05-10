import { OpenAIApi } from 'openai';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import { ISection } from '../services/comment-builder';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { Injectable } from 'type-chef-di';
import { IOctokit } from '../placeholder-providers/issue-comments.placeholder';
import { PlaceholderResolver } from '../services/placeholder-resolver';

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
        openaiClient: OpenAIApi,
        octokit: IOctokit,
        config: Partial<IConfig>,
    ): Promise<ISection[]> {
        const resolvedTemple = await this.placeholderResolver.resolve(config.sections.relatedIssues.prompt);
        const relatedIssuesResponse = await openaiClient.createCompletion({
            model: inputs.model,
            prompt: resolvedTemple,
            max_tokens: inputs.maxTokens,
        });

        return [
            {
                prompt: resolvedTemple,
                title: config.sections.relatedIssues.title,
                description: relatedIssuesResponse.data.choices[0].text,
            },
        ];
    }
}
