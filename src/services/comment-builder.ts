import * as core from '@actions/core';
export interface ISection {
    title: string;
    description: string;
}
export class CommentBuilder {
    private message: string;

    addSection(options: ISection) {
        core.notice(`Add section: `);
        core.notice(`${options.title}:  ${options.description}`);
        this.message = `
${this.message} 

### ${options.title}
${options.description}
`;
    }

    addSections(sections: ISection[]) {
        for (const section of sections) {
            this.addSection(section);
        }
    }

    getMessage() {
        return this.message;
    }
}
