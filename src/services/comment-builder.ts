import * as core from '@actions/core';
export interface ISection {
    prompt?: string;
    title: string;
    description: string;
}
export class CommentBuilder {
    private message: string = '';

    addSection(options: ISection, isDebug: boolean = false) {
        core.notice(`Add section: `);
        core.notice(`${options.title}:  ${options.description}`);
        this.message = `
${this.message} 

### ${options.title}

${isDebug ? `- Prompt: ${options?.prompt}` : ''}

${options.description}
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
