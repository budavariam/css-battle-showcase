import fs from 'fs';
import path from 'path';

export const BATTLE_PATH = path.join(process.cwd(), '_battles');
export const battleFilePaths = fs
    .readdirSync(BATTLE_PATH)
    // only return those  that start with a number
    .filter(path => /^\d/.test(path))