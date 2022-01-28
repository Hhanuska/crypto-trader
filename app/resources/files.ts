import fs from 'fs';
import { Meta, Strategy } from '../strategies/_helpers/_strategyTemplate';

export function getFileNames(path: string): Array<string> {
    if (!fs.existsSync(path)) {
        return [];
    }

    const files = fs.readdirSync(path);
    return files;
}

export function removeStartsWithUnderscore(fileNames: Array<string>) {
    for (let i = fileNames.length - 1; i >= 0; i--) {
        if (fileNames[i].startsWith('_')) {
            fileNames.splice(i, 1);
        }
    }

    return fileNames;
}

export async function getStrategies(): Promise<Strategy[]> {
    const fileNames = removeStartsWithUnderscore(getFileNames('app/strategies'));

    const strategies: Strategy[] = [];

    for (let i = 0; i < fileNames.length; i++) {
        const dir = fileNames[i];

        if (fs.existsSync(`app/strategies/${dir}/meta.ts`)) {
            const { getMeta } = await import(`/app/strategies/${dir}/meta`);
            strategies.push({
                ...getMeta(),
                dir: dir
            });
        }
    }

    return strategies;
}
