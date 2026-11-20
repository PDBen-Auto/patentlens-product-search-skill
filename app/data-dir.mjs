import os from 'node:os';
import path from 'node:path';

export const RECORDS = path.resolve(
  process.env.PATENTLENS_DATA_DIR || path.join(os.homedir(), 'PatentLens-records')
);
