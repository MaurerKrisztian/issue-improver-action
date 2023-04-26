import * as core from '@actions/core';

export class ActionRunner {
    constructor(private readonly options: { name: string; cb: () => unknown }) {}
    async run() {
        try {
            core.notice(`Action started: ${this.options.name}`);
            await this.options.cb();
            core.notice('Action completed.');
        } catch (error: any) {
            core.setFailed(error?.message);
        }
    }
}
