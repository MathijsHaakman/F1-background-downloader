import probe, { ProbeResult } from 'probe-image-size';
import { createWriteStream } from 'fs';
import { get } from 'https';
import { checkAndCreateValidFolder, readBookmarksFile } from './fileHelper';
import { once } from 'events';

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

const downloadImage = async (imageUrl: string, destinationPath: string): Promise<void> => {
  get(imageUrl, async (result) => {
    destinationPath = checkAndCreateValidFolder(destinationPath);
    let filePath = addFileNameToPath(destinationPath, imageUrl);
    let writeStream = result.pipe(createWriteStream(filePath));
    await once(writeStream, 'close');
    console.log('Done downloading', imageUrl);
  });
};

readBookmarksFile(BOOKMARKS_FILE_PATH).then((bookmarks) => {
  for (const bookmark of bookmarks) {
    const highDefUrl = prepareUrl(bookmark);
  
    retrieveImageInfo(highDefUrl).then(async (result) => {
      if (filterMinimumResolution(result, { width: MINIMUM_WIDTH, height: MINIMUM_HEIGHT })) {
        await downloadImage(result.url, DEST_PATH);
        console.log(result);
      }
    });
  }
});
