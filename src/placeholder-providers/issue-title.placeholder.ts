import * as github from '@actions/github';
import { IPlaceholderProvider } from './interfaces/placeholder-provider.interface';
import { Injectable } from 'type-chef-di';
@Injectable()
export class IssueTitlePlaceholder implements IPlaceholderProvider {
    provideValue(): string {
        return JSON.stringify(github.context.payload.issue?.title);
    }
}
