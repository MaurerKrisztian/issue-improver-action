import * as core from '@actions/core';
import * as github from '@actions/github';
import {reflectToIssueWithGPT} from "./openapi-service";
async function run() {
    try {
        const apiKey = core.getInput('api-key');
        const template = core.getInput('template');

        const octokit = await github.getOctokit(core.getInput('github-token'));
        const context = github.context;
        if (context.payload.action !== 'opened') {
            console.log('This action only runs when an issue is opened');
            return;
        }
        const issue = context.payload.issue;

        const gptMessage = await reflectToIssueWithGPT(apiKey, {issueBody: issue?.body || "", issueTitle: issue?.html_url || ""}, template) || "no comment"

        if (!issue?.number){
            throw new Error("No issue Number")
        }
        await octokit.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue?.number,
            body: gptMessage,
        })

        console.log('Comment created successfully');
    } catch (error: any) {
        core.setFailed(error?.message);
    }
}

run();
