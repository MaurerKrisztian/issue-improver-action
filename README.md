# issue-improver-action

![Maurer Krisztian](https://user-images.githubusercontent.com/48491140/234571713-eb6a3708-40b5-4b81-903d-7c4d0b16ccea.png)



GitHub Action that automates issue improvement suggestions using OpenAI.

## Inputs:

| Input             | Required | Default            | Info                                                                                               |
| ----------------- | -------- |--------------------|----------------------------------------------------------------------------------------------------|
| api-key           | Yes      | N/A                | OpenAI API key                                                                                     |
| template          | Yes      | N/A                | The resolved template will be sent to GPT. Placeholders: {{author}}, {{issueTitle}}, {{issueBody}} |
| find-related-issues| No       | False              | Create a related issues section.                                                                   |
| model             | No       | 'text-davinci-003' | OpenAI model                                                                                       |
| max_tokens        | No       | 150                | OpenAI max_tokens (response length)                                                                |


## How does It work?


Whenever an issue is created, this action can be triggered to gather the relevant issue data, use it to resolve the template variable, and submit it to a GPT model.
Find related issues among open issues.
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
