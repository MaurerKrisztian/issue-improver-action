# issue-improver-action

![Maurer Krisztian](https://user-images.githubusercontent.com/48491140/234571713-eb6a3708-40b5-4b81-903d-7c4d0b16ccea.png)



GitHub Action that automates issue improvement suggestions using OpenAI.

## Inputs:

| Input                      | Required | Default                    | Info                                           |
|----------------------------|----------|----------------------------|------------------------------------------------|
| openai-key                   | Yes      | N/A                        | OpenAI API key                                 |
| config-file                | No       | issue-improver-config.json | Configuration file                             |
| add-related-issues-section | No       | false                      | Create a related issues section.               |
| add-summary-section        | No       | false                       | Create a summary section.                      |
| add-comment-summary-section        | No       |    false                        | Create comment summary                         |
| add-custom-section         | No       |   false                         | Create custom sections                         |
| add-label-section          | No       |  false                          | Create label suggesion                         |
| model                      | No       | 'text-davinci-003'         | OpenAI model                                   |
| max-tokens                 | No       | 150                        | OpenAI max_tokens (response length)            |
| debug-mode                | No       | false                      | Enable debug mode: Show prompts in comments |


## How does It work?

This action can be triggered to gather the relevant issue data, make usefully comments with GPT model.

One of the main building blocs is the "sections" every section has at lease a title and prompt parameter,
you can specify which section do you need at the action workflow yml. When the action runs, resolves all selected sections prompts with Openapi GPT model.
The prompts has default values (see: `src/config/default-config.ts`) but you can fully customize all of them and create custom sections.
The resulting responses will then be added as a comment to the issue.

## Try it out here: [Demo repository](https://github.com/MaurerKrisztian/issue-improver-action-demo)

## Built in sections:

### related-issues-section
Find related issues among open issues.

I have noticed that many open-source projects have few maintainers and a lot of issues.
Some issues are duplicates, while others are related to each other. These details are useful to the maintainer.
With the assistance of AI, this action will create a "related issues" section in the comment.

### label-section
Find relevant labels for the issue.

The action will get all the labels and descriptions and issue data, based on that create a label suggession.

### summary-section
Summarize the issue text.

### custom-section
add custom sections to the `sections.custom` array within the configuration file.

### comment-summary-section
Summarize all comment at the current issue, make progress report etc.

Occasionally, certain GitHub issues can be overwhelming with an abundance of comments, making it difficult to comprehend the situation. To address this, I have developed a comment summary feature.


## Action example:
This action will trigger when new issue is opened,
and creates a comment including: related-issues-section, summary-section, label-section, custom-section

```yml
name: Improve issues

on:
  issues:
    types: [opened]

jobs:
  gpt-comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create useful comment with AI
        uses: MaurerKrisztian/issue-improver-action@latest
        with:
          openai-key: ${{ secrets.GPT_KEY }}
          max-tokens: 400
          add-related-issues-section: true
          add-summary-section: true
          add-label-section: true
          add-custom-section: true
```

## Comment Summary
The YAML code below demonstrates how to activate comment summary, progress report, using the "!summarize" command.

```yml
on:
  issue_comment:

jobs:
  comment-summary:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Comment summary
        uses: MaurerKrisztian/issue-improver-action@latest
        if: contains(github.event.comment.body, '!summarize')
        with:
          openai-key: ${{ secrets.GPT_KEY }}
          max-tokens: 400
          add-comment-summary-section: true
```

## Custom section:
All section prompts is fully customisable.
To create custom sections / prompts, simply create a JSON file (location is the `config-file` input) and modify the prompts and section titles as desired. This will owerwite the default config (see: `src/config/default-config.ts`). 

Additionally, you can add new custom sections to the `sections.custom` array within the configuration file.

#### Example config:
```json
{
  "sections": {
    "custom": [
      {
        "title": "Joke",
        "prompt": "make a joke about this: {{issueTitle}}"
      },
      {
        "title": "Poem",
        "prompt": "Write a short poem about this: {{issueTitle}}"
      }
    ],
    "relatedIssues": {
      "title": "Related Issues",
      "prompt": "From the list of open issues: {{openIssues}}, identify the most relevant ones related to '{{issueTitle}}' and provide a brief description of their similarities. Just the very simmilar related issues to '{{issueTitle}}' shoud be included in the answer, if none is very similar, andwer with 'none',"
    },
    "summary": {
      "title": "Summary",
      "prompt": "Provide a concise summary of the main points and objectives presented in the issue '{{issueTitle}}' and its content: {{issueBody}}."
    },
    "commentSummary": {
      "title": "Comment summary",
      "prompt": "Review the comments in {{issueComments}} for the issue '{{issueTitle}}' and its content: {{issueBody}}. Extract the key takeaways, notable updates, and any consensus reached, and provide a concise summary of the discussion."
    },
    "labelSuggestion": {
      "title": "Label Suggestion",
      "prompt": "Analyze the issue '{{issueTitle}}' and its content: {{issueBody}}, and suggest appropriate labels from the available labels {{allLabels}} that accurately represent the topic, scope, and complexity of the issue. The response shoud only include a label and why its suitable."
    }
  }
}
```

## Demo:
![Unable to submit form on mobile devices](https://user-images.githubusercontent.com/48491140/236701094-1d46c2bc-1d6c-4335-a0b9-27daf0688841.png)

