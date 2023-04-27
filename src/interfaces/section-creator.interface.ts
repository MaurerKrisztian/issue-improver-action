import { OpenAIApi } from 'openai';
import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { ISection } from '../services/comment-builder';
import { IConfig } from './config.interface';
import { IInputs } from './inputs.interface';

export interface ISectionCreator {
    isAddSection(inputs: IInputs, config?: Partial<IConfig>): boolean;

    createSection(
        inputs: IInputs,
        openaiClient: OpenAIApi,
        octokit: Octokit & Api & { paginate: PaginateInterface },
        config?: Partial<IConfig>,
    ): Promise<ISection[]>;
}
