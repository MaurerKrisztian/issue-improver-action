# issue-improver-action

![Maurer Krisztian](https://user-images.githubusercontent.com/48491140/234571713-eb6a3708-40b5-4b81-903d-7c4d0b16ccea.png)



GitHub Action that automates issue improvement suggestions using OpenAI.

## Inputs:

| Input             | Required | Default                    | Info                                |
| ----------------- |----------|----------------------------|-------------------------------------|
| api-key           | Yes      | N/A                        | OpenAI API key                      |
| config-file       | No       | issue-improver-config.json | Configuration file                  |
| add-related-issues-section| No       | True                       | Create a related issues section.    |
| add-summary-section| No       | True                       | Create a summary section.           |
| model             | No       | 'text-davinci-003'         | OpenAI model                        |
| max_tokens        | No       | 150                        | OpenAI max_tokens (response length) |

## Custom section:

To create custom sections, simply create a JSON file (location is the `config-file` input) and modify the prompts and section titles as desired. Additionally, you can add new custom sections to the sections.custom array within the configuration file. This step is optional.

#### Example config:
```json
{
  "sections":{
    "custom":[
      {
        "title":"[JOKE]",
        "prompt":"make a joke about this: {{issueTitle}}"
      },
      {
        "title":"[Poem]",
        "prompt":"Write a short poem about this: {{issueTitle}}"
      }
    ],
    "relatedIssues":{
      "title":"[Related Issues]",
      "prompt":"Find very similar related issue titles for \" title: {{issueTitle}} \"  from thies issues: {{openIssues}} . If none of them very similar just respond with a \"none\". Make a list of issue title what is may related in this format [title](link) - [the similarity]"
    },
    "summary":{
      "title":"[Summary]",
      "prompt":"Summarize this github issue: {{issueTitle}} {{issueBody}}"
    }
  }
}
```
## How does It work?


Whenever an issue is created, this action can be triggered to gather the relevant issue data, use it to resolve the template prompts, and submit it to a GPT model.

E.g
- Find related issues among open issues.
- Summarize issues.

The resulting responses will then be added as a comment to the issue.

## Action example:


```yml

name: CI

on:
  issues:
    types: [opened]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

jobs:
  gpt-comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run my GPT action
        uses: MaurerKrisztian/issue-improver-action@latest
        with:
          api-key: ${{ secrets.GPT_KEY }}
          template: "{{author}} created an issue in github, please sumarize it at [sumarize] section and give suggesion how can improve the issue text at [suggesion] section. Apply it for this github issue:  {{issueTitle}} {{issueBody}}"

```
