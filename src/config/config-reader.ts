import fs from 'fs';
import * as core from '@actions/core';
import { IConfig } from '../interfaces/config.interface';
import { defaultConfig } from './default-config';

export function getConfig(path?: string): Partial<IConfig> {
    const fileName = path || 'issue-improver-config.json';
    if (!fs.existsSync(fileName)) {
        core.notice(`Config file '${fileName}' not found.`);
        core.notice(`Loading default config.`);
        core.notice(`Config loaded: ${JSON.stringify(defaultConfig)}`);
        return defaultConfig;
    }
    const fileContents = fs.readFileSync(fileName, 'utf8');
    const config = JSON.parse(fileContents);
    config.sections = { ...defaultConfig.sections, ...config.sections };
    core.notice(`Config loaded: ${JSON.stringify(config)}`);
    return config;
}
