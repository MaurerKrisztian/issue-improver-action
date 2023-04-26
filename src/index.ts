import * as core from '@actions/core';
import * as github from '@actions/github';
import { reflectToIssueWithGPT } from './openapi-service';
async function run() {
    try {
        core.debug('Action is started..');
        const apiKey = core.getInput('api-key');
        const template = core.getInput('template');
        const githubToken = core.getInput('github-token');

        core.notice(githubToken == undefined ? 'github token is undefined' : 'github token is provided');

        console.debug('getOctokit with the github token..');
        const octokit = await github.getOctokit(githubToken);
        const context = github.context;
        // if (context.payload.action !== 'opened') {
        //     console.log('This action only runs when an issue is opened');
        //     return;
        // }
        const issue = context.payload.issue;

        core.notice(JSON.stringify(context.payload));
        core.notice(JSON.stringify(issue));

        const gptMessage =
            (await reflectToIssueWithGPT(
                apiKey,
                { issueBody: issue?.body || '', issueTitle: issue?.title || '' },
                template,
            )) || 'no comment';

        if (!issue?.number) {
            throw new Error('No issue Number');
        }
        await octokit.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue?.number,
            body: gptMessage,
        });

        core.notice('Comment created successfully');
    } catch (error: any) {
        core.setFailed(error?.message);
    }
}

run();
