import fs from 'fs';

const readAllFiles = (path: string): Promise<string[]> => {
  return new Promise(resolve => {
    let filesResult: string[] = [];

    fs.readdir(path, async (err, files) => {
      for (let i = 0; i < files.length; i++) {
        if (fs.lstatSync(`${path}/${files[i]}`).isFile()) {
          filesResult.push(`${path}/${files[i]}`);
        } else {
          filesResult = filesResult.concat(await readAllFiles(`${path}/${files[i]}`));
        }
      }

      resolve(filesResult);
    });
  });
};

export default readAllFiles;
