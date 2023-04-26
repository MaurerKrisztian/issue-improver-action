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

    getMessage() {
        return this.message;
    }
}
