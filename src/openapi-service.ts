import {Configuration, OpenAIApi} from "openai";
import {resolveTemplate} from "./utils";

export async function reflectToIssueWithGPT(apiKey: string, context: { issueBody: string, issueTitle: string }, template: string, max_tokens = 150) {
    const configuration = new Configuration({
        apiKey: apiKey,
    });
    const openaiClient = new OpenAIApi(configuration);
    const completion = await openaiClient.createCompletion({
        model: "text-davinci-003",
        prompt: resolveTemplate(template, context),
        max_tokens: max_tokens
    });
    console.log(completion.data.choices[0].text);
    return completion.data.choices[0].text
}
