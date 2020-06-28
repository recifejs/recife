import fs from 'fs';
import path from 'path';

const readAllFiles = (basePath: string): Promise<string[]> => {
  return new Promise(resolve => {
    let filesResult: string[] = [];
    fs.exists(basePath, exist => {
      if (exist) {
        fs.readdir(basePath, async (_err, files) => {
          for (let i = 0; i < files.length; i++) {
            const file = path.join(basePath, files[i]);

            if (fs.lstatSync(file).isFile()) {
              filesResult.push(file);
            } else {
              filesResult = filesResult.concat(await readAllFiles(file));
            }
          }

          resolve(filesResult);
        });
      } else {
        resolve([]);
      }
    });
  });
};

export default readAllFiles;
