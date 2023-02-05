import { createReadStream, mkdirSync } from 'fs';
import readline from 'readline';
import { once } from 'events';

export const checkAndCreateValidFolder = (destinationPath: string): string => {
  if(destinationPath.charAt(-1) !== '/') {
    destinationPath = destinationPath.concat('/');
  }
  mkdirSync(destinationPath, {
    recursive: true
  });
  return destinationPath;
};

export const readBookmarksFile = async (filePath: string): Promise<string[]> => {
  const bookmarkList: string[] = [];
  const rl = readline.createInterface({
    input: createReadStream(filePath),
    terminal: false,
  });

  rl.on('line', (line) => {
    if (isTwitterImage(line)) {
      bookmarkList.push(line);
    }
  });

  await once(rl, 'close');

  return bookmarkList;
};

const isTwitterImage = (line: string): boolean => line.startsWith('https://pbs.twimg.com/media')