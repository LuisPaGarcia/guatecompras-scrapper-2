const fs = require("fs");
const path = require("path");
const outputPath = path.join(
  __dirname,
  "../../",
  "output",
  "links",
  "Compra Directa"
);

function read({ filename }) {
  const outputPathFilename = path.join(outputPath, filename);

  const data = fs.readFileSync(outputPathFilename, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(data);
}

module.exports = read;
