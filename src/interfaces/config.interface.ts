import { ISectionPrompt } from './section-prompt.interface';

export interface IConfig {
    systemMessage?: string;
    sections: {
        custom: ISectionPrompt[];
        summary: ISectionPrompt;
        relatedIssues: ISectionPrompt;
        labelSuggestion: ISectionPrompt;
        commentSummary: ISectionPrompt;
    };
}
