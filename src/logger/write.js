const fs = require("fs");
const path = require("path");
const outputPath = path.join(
  __dirname,
  "../../",
  "output",
  "links",
  "Compra Directa"
);
const read = require("./read");

function writeOld({ filename, content }) {
  return new Promise((resolve, reject) => {
    const outputPathFilename = path.join(outputPath, filename);
    // file exist?
    if (!fs.existsSync(outputPathFilename)) {
      // file doesn't exist
      fs.writeFileSync(outputPathFilename, JSON.stringify(content));
      resolve();
    }

    // file exists
    let existingContent = read({ filename });
    const initLen = existingContent.length;
    content.forEach((element) => {
      if (existingContent.indexOf(element) === -1) {
        existingContent = existingContent.concat(element);
        resolve();
      }
      console.log("Already exists in file:", element);
    });
    if (initLen !== existingContent.length) {
      fs.writeFileSync(outputPathFilename, JSON.stringify(existingContent));
      console.log("Writing file:", filename);
    }
    resolve();
  });
}

function write({ filename, content }) {
  return new Promise((resolve, reject) => {
    const outputPathFilename = path.join(outputPath, filename);
    // file exist?
    if (!fs.existsSync(outputPathFilename)) {
      // file doesn't exist
      fs.writeFileSync(outputPathFilename, JSON.stringify(content));
      resolve();
    }

    // file exists
    let existingContent = read({ filename });
    fs.writeFileSync(
      outputPathFilename,
      JSON.stringify([...new Set([...existingContent, ...content])])
    );
    console.log("json lenght:", [...existingContent, ...content].length);
    resolve();
  });
}
module.exports = write;
