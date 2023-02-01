import probe from 'probe-image-size';

let url = 'https://pbs.twimg.com/media/FMceCAbXIAItvrJ?format=jpg&name=large';

probe(url).then(result => {
  console.log(result);
});