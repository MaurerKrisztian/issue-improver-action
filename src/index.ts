import * as core from '@actions/core';
import * as github from '@actions/github';
import { ActionRunner } from './services/action-runner';
import { Configuration, OpenAIApi } from 'openai';
import { CommentBuilder } from './services/comment-builder';
import { CustomSectionCreator } from './section-creators/custom.section-creator';
import { RelatedIssuesSectionCreator } from './section-creators/related-issues.section-creator';
import { SummariseSectionCreator } from './section-creators/summarise.section-creator';
import { getConfig } from './config/config-reader';
import { IInputs } from './interfaces/inputs.interface';

const sectionCreators = [new CustomSectionCreator(), new RelatedIssuesSectionCreator(), new SummariseSectionCreator()];
async function run() {
    const inputs: IInputs = {
        apiKey: core.getInput('api-key'),
        findRelatedIssues: core.getInput('find-related-issues') == 'true',
        githubToken: core.getInput('github-token'),
        maxTokens: Number.parseInt(core.getInput('max_tokens')),
        model: core.getInput('model', { required: false }),
        template: core.getInput('template'),
        configFile: core.getInput('config-file'),
    };

    const config = await getConfig(inputs.configFile);

    const openaiClient = new OpenAIApi(
        new Configuration({
            apiKey: inputs.apiKey,
        }),
    );

    const octokit = await github.getOctokit(inputs.githubToken);
    const context = github.context;
    const issue = context.payload.issue;
    core.notice(`Max token / section: ${inputs.maxTokens}`);
    core.notice(JSON.stringify(issue));

    const commentBuilder = new CommentBuilder();
    for (const sectionCreator of sectionCreators) {
        if (sectionCreator.isAddSection(inputs, config)) {
            commentBuilder.addSections(await sectionCreator.createSection(inputs, openaiClient, octokit, config));
        }
    }

    const createComment = async (message: string) => {
        await octokit.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue?.number,
            body: message,
        });
    };

    core.notice(`Try to create a comment...`);
    await createComment(commentBuilder.getMessage());
    core.notice('Comment created successfully');
}

const runner = new ActionRunner({ name: 'GPT issue improver', cb: run });
runner.run();
