import fs from 'fs';
import * as core from '@actions/core';
export function getConfig() {
    const fileName = process.env.FILE_NAME || 'example.txt';
    const fileContents = fs.readFileSync(fileName, 'utf8');
    console.log(`File contents: ${fileContents}`);
    core.notice(`File contents: ${fileContents}`);
}
