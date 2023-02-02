import probe, { ProbeResult } from 'probe-image-size';
import { createWriteStream, mkdirSync } from 'fs';
import { get } from 'https';

type ImageResolution = Pick<ProbeResult, "width" | "height">;

const IMAGE_URL = 'https://pbs.twimg.com/media/FMceCAbXIAItvrJ?format=jpg&name=large';
const DEST_PATH = '/mnt/e/Keut/Downloads/F1/Backgrounds'
const MINIMUM_HEIGHT = 1080;
const MINIMUM_WIDTH = 1920;

const prepareUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set('name', 'orig');

  return parsedUrl.toString();  
};

const retrieveImageInfo = async (url: string): Promise<ProbeResult> => {
  const highDefUrl = prepareUrl(url);

  return await probe(highDefUrl);
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

const checkAndCreateValidFolder = (destinationPath: string): string => {
  if(destinationPath.charAt(-1) !== '/') {
    destinationPath = destinationPath.concat('/');
  }
  mkdirSync(destinationPath, {
    recursive: true
  });
  return destinationPath;
};

const addFileNameToPath = (folderPath: string, url: string): string => {
  let fileName = new URL(url).pathname.split('/').at(-1);
  return `${folderPath}${fileName}.png`;
};

const downloadImage = async (imageUrl: string, destinationPath: string): Promise<void> => {
  get(imageUrl, (result) => {
    destinationPath = checkAndCreateValidFolder(destinationPath);
    let filePath = addFileNameToPath(destinationPath, imageUrl);
    let writeStream = result.pipe(createWriteStream(filePath));
    writeStream.once('close', () => {
      console.log('done');
    })
  });
};

retrieveImageInfo(IMAGE_URL).then(async (result) => {
  if (filterMinimumResolution(result, { width: MINIMUM_WIDTH, height: MINIMUM_HEIGHT })) {
    await downloadImage(result.url, DEST_PATH);
    console.log(result);
  }
});