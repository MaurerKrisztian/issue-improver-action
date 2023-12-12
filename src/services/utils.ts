import * as core from '@actions/core';
import { IConfig } from '../interfaces/config.interface';
import { IInputs } from '../interfaces/inputs.interface';
import { OpenAI } from 'openai';

export class Utils {
    static resolveTemplate(template: string, context: Record<string, string>) {
        return template.replace(/{{([^}]+)}}/g, (match, prop) => {
            return (
                context[prop] ??
                (function() {
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

    static async askGpt(openaiClient: OpenAI, prompt: string, config: Partial<IConfig>, inputs: IInputs) {
        return (
            await openaiClient.chat.completions.create({
                model: inputs.model,
                messages: [
                    { role: 'system', content: config.systemMessage },
                    { role: 'user', content: prompt },
                ],
                max_tokens: inputs.maxTokens,
            })
        ).choices[0].message?.content;
    };
}
