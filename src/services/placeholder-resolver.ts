import { Utils } from './utils';
import { placeholderProviders } from '../placeholder-providers/placeholders';
import * as core from '@actions/core';
import { container } from '../index';
import { IPlaceholderProvider } from '../placeholder-providers/interfaces/placeholder-provider.interface';
import { Injectable } from 'type-chef-di';

@Injectable({ instantiation: 'singleton' })
export class PlaceholderResolver {
    private readonly cache: Map<string, string> = new Map();
    async resolve(template: string) {
        const placeholderKeys = Utils.getPlaceholders(template);
        const templateContext: { [key: string]: string } = {};
        for (const placeholderKey of placeholderKeys) {
            if (this.cache.has(placeholderKey)) {
                templateContext[placeholderKey] = this.cache.get(placeholderKey);
            }

            const placeholderClass = placeholderProviders[placeholderKey];
            if (placeholderClass == undefined) {
                core.notice(`Cant resolve: ${placeholderKey} placeholder.`);
                continue;
            }
            const placeholderProvider = await container.resolveByType<IPlaceholderProvider>(placeholderClass);
            const resultText = await placeholderProvider.provideValue();
            this.cache.set(placeholderKey, resultText);
            templateContext[placeholderKey] = resultText;
        }
        core.notice(
            `Resolved: ${Object.keys(templateContext)
                .map((value) => `{{${value}}} --> ${templateContext[value].substring(0, 10)}...`)
                .join(',')}`,
        );
        core.notice(
            `Not Resolved: ${placeholderKeys
                .filter((placeholder) => {
                    return !Object.keys(templateContext).includes(placeholder);
                })
                .map((value) => `{{${value}}}`)
                .join(',')}`,
        );
        return Utils.resolveTemplate(template, templateContext);
    }
}
