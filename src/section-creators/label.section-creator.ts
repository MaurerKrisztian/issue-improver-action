import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { context } from '@actions/github';
import { ISection } from '../services/comment-builder';
import { ISectionCreator } from '../interfaces/section-creator.interface';
import * as core from '@actions/core';
import { Utils } from '../services/utils';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { ILabel } from '../interfaces/labels.interface';

export class LabelSectionCreator implements ISectionCreator {
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
        const issue = context.payload.issue;

        const getAllLabelsForRepository = async (
            owner: string,
            repo: string,
        ): Promise<Pick<ILabel, 'name' | 'description'>[]> => {
            const response = await octokit.rest.issues.listLabelsForRepo({
                owner,
                repo,
            });
            return response?.data.map((label) => ({ name: label.name, description: label.description }));
        };

        const labels = await getAllLabelsForRepository(context.repo.owner, context.repo.repo);
        core.notice(`Labels: ${JSON.stringify(labels)}`);

        const prompt = Utils.resolveTemplate(config?.sections?.labelSuggestion?.prompt, {
            issueTitle: issue.title,
            issueBody: issue.body,
            allLabel: JSON.stringify(labels),
        });

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
