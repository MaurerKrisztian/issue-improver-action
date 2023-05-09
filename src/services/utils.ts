import * as core from '@actions/core';

export class Utils {
    static resolveTemplate(template: string, context: Record<string, string>) {
        return template.replace(/{{([^}]+)}}/g, (match, prop) => {
            return (
                context[prop] ??
                (function () {
                    core.warning(`Can't resolve ${match} value.`);
                    return `${match}`;
                })()
            );
        });
    }

    static getPlaceholders(text: string): string[] {
        const regex = /{{(.*?)}}/g;
        const matches = text.match(regex);

        if (!matches) {
            return [];
        }

        return matches.map((match) => {
            const placeholder = match.slice(2, -2).trim();
            return placeholder;
        });
    }
}
