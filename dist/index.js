"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const openapi_service_1 = require("./openapi-service");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiKey = core.getInput('api-key');
            const template = core.getInput('template');
            const octokit = yield github.getOctokit(core.getInput('github-token'));
            const context = github.context;
            if (context.payload.action !== 'opened') {
                console.log('This action only runs when an issue is opened');
                return;
            }
            const issue = context.payload.issue;
            const gptMessage = (yield (0, openapi_service_1.reflectToIssueWithGPT)(apiKey, { issueBody: (issue === null || issue === void 0 ? void 0 : issue.body) || "", issueTitle: (issue === null || issue === void 0 ? void 0 : issue.html_url) || "" }, template)) || "no comment";
            if (!(issue === null || issue === void 0 ? void 0 : issue.number)) {
                throw new Error("No issue Number");
            }
            yield octokit.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issue === null || issue === void 0 ? void 0 : issue.number,
                body: gptMessage,
            });
            console.log('Comment created successfully');
        }
        catch (error) {
            core.setFailed(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
run();
//# sourceMappingURL=index.js.map