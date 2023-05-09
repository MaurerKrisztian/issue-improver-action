import { IPlaceholderProvider } from './interfaces/placeholder-provider.interface';
import * as github from '@actions/github';
import { Injectable } from 'type-chef-di';
@Injectable()
export class IssueBodyPlaceholder implements IPlaceholderProvider {
    provideValue(): string {
        return JSON.stringify(github.context.payload.issue.body);
    }
}
