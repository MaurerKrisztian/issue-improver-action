import * as core from '@actions/core';
import * as github from '@actions/github';
import { ActionRunner } from './services/action-runner';
import { Utils } from './utils';
import { Configuration, OpenAIApi } from 'openai';
import { CommentBuilder } from './services/comment-builder';

async function run() {
    const apiKey = core.getInput('api-key');
    const template = core.getInput('template');
    const githubToken = core.getInput('github-token');
    const model = core.getInput('model', { required: false }) || 'text-davinci-003';
    const findRelatedIssues = core.getInput('find-related-issues');
    const maxTokens = Number.parseInt(core.getInput('max_tokens', { required: false })) || 150;

    const commentBuilder = new CommentBuilder();

    const openaiClient = new OpenAIApi(
        new Configuration({
            apiKey: apiKey,
        }),
    );

    const octokit = await github.getOctokit(githubToken);
    const context = github.context;
    const issue = context.payload.issue;

    core.notice(JSON.stringify(issue));

    const getIssueReflectionMessage = async () => {
        const resolvedTemple = Utils.resolveTemplate(template, {
            issueBody: issue?.body || '',
            issueTitle: issue?.title || '',
            author: issue.user.login || '',
        });

        return (
            await openaiClient.createCompletion({
                model: model,
                prompt: resolvedTemple,
                max_tokens: maxTokens,
            })
        ).data.choices[0].text;
    };

    const getRelatedIssues = async () => {
        const issuesResponse = await octokit.rest.issues.listForRepo({
            owner: context.repo.owner,
            repo: context.repo.repo,
            state: 'open',
        });

        const issues = issuesResponse.data.map((issue) => ({
            number: issue.number,
            title: issue.title,
            link: issue.html_url,
        }));

        const relatedIssuesResponse = await openaiClient.createCompletion({
            model: model,
            prompt: `Find related issues to: " {{issueTitle}} "  from thies issues: ${JSON.stringify(
                issues,
            )}. Make a list of issue title what is may related in this format [title](link)`,
            max_tokens: maxTokens,
        });
        return relatedIssuesResponse.data.choices[0].text;
    };

    const createComment = async (message: string) => {
        await octokit.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue?.number,
            body: message,
        });
    };

    commentBuilder.addSection('[GPT Reflection]', await getIssueReflectionMessage());

    if (findRelatedIssues) {
        commentBuilder.addSection('[Potentially Related Issues]', await getRelatedIssues());
    }

    core.notice(`Try to create a comment...`);
    await createComment(commentBuilder.getMessage());
    core.notice('Comment created successfully');
}

const runner = new ActionRunner({ name: 'GPT issue improver', cb: run });
runner.run();
