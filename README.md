# issue-improver-action

![Maurer Krisztian](https://user-images.githubusercontent.com/48491140/234571713-eb6a3708-40b5-4b81-903d-7c4d0b16ccea.png)



GitHub Action that automates issue improvement suggestions using OpenAI.


Action example:



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
          template: "{{author}} created and issue in github, please sumarize it at [sumarize] section and give suggesion how can improve the issue text at [suggesion].. Apply it for this github issue:  {{issueTitle}} {{issueBody}}"

```
