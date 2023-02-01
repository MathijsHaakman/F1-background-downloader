import probe, { ProbeResult } from 'probe-image-size';

const IMAGE_URL = 'https://pbs.twimg.com/media/FMceCAbXIAItvrJ?format=jpg&name=large';

const prepareUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set('name', 'orig');

  return parsedUrl.toString();  
};

const retrieveImageInfo = async (url: string): Promise<ProbeResult> => {
  const highDefUrl = prepareUrl(url);

  return await probe(highDefUrl);
};

retrieveImageInfo(IMAGE_URL).then((result) => {
  console.log(result);
});