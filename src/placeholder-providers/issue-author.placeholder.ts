import { IPlaceholderProvider } from './interfaces/placeholder-provider.interface';
import * as github from '@actions/github';
import { Injectable } from 'type-chef-di';
@Injectable()
export class IssueAuthorPlaceholder implements IPlaceholderProvider {
    provideValue(): string {
        return github.context.payload.issue?.user?.login;
    }
}
