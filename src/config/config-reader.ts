import fs from 'fs';
import * as core from '@actions/core';

export interface ISectionPrompt {
    title: string;
    prompt: string;
    enable?: boolean;
}
export interface IConfig {
    sections: {
        custom: ISectionPrompt[];
        summary: ISectionPrompt;
        relatedIssues: ISectionPrompt;
    };
}

const defaultConfig: IConfig = {
    sections: {
        custom: [
            {
                title: '[Custom]',
                prompt: 'make a joke about this: {{issueTitle}}',
            },
        ],
        relatedIssues: {
            title: '[Related Issues]',
            prompt: 'Find very similar related issue titles for " title: {{issueTitle}} "  from thies issues: {{openIssues}} . If none of them very similar just respond with a "none". Make a list of issue title what is may related in this format [title](link) - [the similarity]',
        },
        summary: { title: '[Summary]', prompt: 'Summarize this github issue: {{issueTitle}} {{issueBody}}' },
    },
};
export function getConfig(path?: string): Partial<IConfig> {
    const fileName = path || 'issue-improver-config.json';
    if (!fs.existsSync(fileName)) {
        core.notice(`Config file '${fileName}' not found.`);
        core.notice(`Loading default config.`);
        return defaultConfig;
    }
    const fileContents = fs.readFileSync(fileName, 'utf8');
    const config = JSON.parse(fileContents);
    core.notice(`Config loaded: ${JSON.stringify(config)}`);
    return config;
}
