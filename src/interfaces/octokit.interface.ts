import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';

export type IOctokit = Octokit &
    Api & {
        paginate: PaginateInterface;
    };
