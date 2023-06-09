import { ISectionPrompt } from './section-prompt.interface';

export interface IConfig {
    sections: {
        custom: ISectionPrompt[];
        summary: ISectionPrompt;
        relatedIssues: ISectionPrompt;
        labelSuggestion: ISectionPrompt;
        commentSummary: ISectionPrompt;
    };
}
