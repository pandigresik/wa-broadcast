const Downloader = require('./downloader')

const download = new Downloader()
const urlFile = 'https://d17ivq9b7rppb3.cloudfront.net/original/commons/dicoding-logo-full.png';
const filePath = 'unduhan/' + urlFile.substring(urlFile.lastIndexOf('/') + 1);
console.log(filePath);
download.download(urlFile, filePath);