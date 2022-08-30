import fs from "fs";
import Jimp = require("jimp");
import axios from 'axios';
import path from 'path';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      axios({
          method: 'GET',
          url: inputURL,
          responseType: 'arraybuffer'
      })
      .then(async function (res) {
          const photo = await Jimp.read(res.data);
          const root = process.cwd();
          const outpath = path.join(root, "temp", `filtered.${Math.floor(Math.random() * 2000)}.jpg`);
          
          photo .resize(256, 256) .quality(60) .greyscale()
          .write(outpath, (img) => {
              resolve(outpath);
          });
      })
      .catch(error=>{
          reject("Unable to get the image from the url");
      })
  } catch (error) {
      reject("Unable to read the image");
  }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
