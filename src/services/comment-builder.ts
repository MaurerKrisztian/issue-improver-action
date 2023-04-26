import * as core from '@actions/core';

export class CommentBuilder {
    private message: string;

    addSection(title: string, content: string) {
        core.notice(`${title}:  ${content}`);
        this.message = `
${this.message} 

### ${title}
${content}
`;
    }

    getMessage() {
        return this.message;
    }
}
