import probe from 'probe-image-size';

const prepareUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set('name', 'orig');

  return parsedUrl.toString();  
};

const highDefUrl = prepareUrl('https://pbs.twimg.com/media/FMceCAbXIAItvrJ?format=jpg&name=large');

probe(highDefUrl).then(result => {
  console.log(result);
});