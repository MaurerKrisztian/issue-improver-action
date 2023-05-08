import * as core from '@actions/core';
export interface ISection {
    prompt?: string;
    title: string;
    description: string;
}
export class CommentBuilder {
    private message: string = '';

    addSection(section: ISection, isDebug: boolean = false) {
        core.notice(`Add section: ${section.title}`);
        core.notice(`Prompt: ${section.prompt}`);
        core.notice(`Answerer: ${section.description}`);
        core.notice(`${section.title}:  ${section.description}`);
        this.message = `
${this.message} 

### ${section.title}

${section.description}
`;
    }

    addSections(sections: ISection[], isDebug: boolean = false) {
        for (const section of sections) {
            this.addSection(section, isDebug);
        }
    }

    getMessage() {
        return this.message;
    }
}
