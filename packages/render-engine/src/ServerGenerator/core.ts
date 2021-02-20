import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const generateBabelConfigFile = async (): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'babelConfig.mst'));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(FilePaths.server, 'babel.config.js'), renderedFile);
};

const generateCoreFiles = (): Promise<void[]> => {
  return Promise.all([generateBabelConfigFile()]);
};

export default generateCoreFiles;