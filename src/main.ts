import probe, { ProbeResult } from 'probe-image-size';
import { createWriteStream } from 'fs';
import { get } from 'https';
import { checkAndCreateValidFolder, readBookmarksFile } from './fileHelper';
import { once } from 'events';
import { IncomingMessage } from 'http';

type ImageResolution = Pick<ProbeResult, "width" | "height">;

const DEST_PATH = '/mnt/e/Keut/Downloads/F1/Backgrounds';
const BOOKMARKS_FILE_PATH = '/mnt/e/Keut/Downloads/F1/backgroundBookmarks.txt';
const MINIMUM_HEIGHT = 1080;
const MINIMUM_WIDTH = 1920;

const prepareUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set('name', 'orig');

  return parsedUrl.toString();  
};

const retrieveImageInfo = async (url: string): Promise<ProbeResult> => {
  return await probe(url);
};

const filterMinimumResolution = (imageResolution: ImageResolution, minimalResolution: ImageResolution): boolean => {
  if (imageResolution.height < minimalResolution.height) {
    return false;
  }

  if (imageResolution.width < minimalResolution.width) {
    return false;
  }
  return true;
};

const addFileNameToPath = (folderPath: string, url: string): string => {
  let fileName = new URL(url).pathname.split('/').at(-1);
  return `${folderPath}${fileName}.png`;
};

const asyncGetRequest = (url: string): Promise<IncomingMessage> => {
  return new Promise<IncomingMessage>((resolve, reject) => {
    get(url, (result: IncomingMessage) => {
      if (result.statusCode === 200) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
};

const downloadImage = async (imageUrl: string, destinationPath: string): Promise<void> => {
  const requestResult = await asyncGetRequest(imageUrl);
  destinationPath = checkAndCreateValidFolder(destinationPath);
  let filePath = addFileNameToPath(destinationPath, imageUrl);
  let writeStream = requestResult.pipe(createWriteStream(filePath));
  await once(writeStream, 'close');
};

(async () => {
  const bookmarks = await readBookmarksFile(BOOKMARKS_FILE_PATH);
  for (const bookmark of bookmarks) {
    const highDefUrl = prepareUrl(bookmark);

    try {
      const result = await retrieveImageInfo(highDefUrl);
      if (filterMinimumResolution(result, { width: MINIMUM_WIDTH, height: MINIMUM_HEIGHT })) {
        await downloadImage(result.url, DEST_PATH);
      }
    } catch (error) {
      console.error('Error downloadImage', {error, highDefUrl})
    }
  }
})();