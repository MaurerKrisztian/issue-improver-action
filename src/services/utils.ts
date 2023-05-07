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
}
