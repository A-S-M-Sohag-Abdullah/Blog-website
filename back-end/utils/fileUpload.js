const path = require("path");
const fs = require("fs");


async function saveFile(file, saveFileName) {
  try {
    const sourcePath = file.filepath;
    const destinationPath =
      "F:/owm build projects/Blog website/back-end/public/images/" + saveFileName;

    //console.log(file);

    // Copy the uploaded file asynchronously
    await fs.promises.copyFile(sourcePath, destinationPath);

    // Optionally, you can delete the temporary file
    await fs.promises.unlink(sourcePath);

    //console.log("File saved:", destinationPath);
  } catch (err) {
    console.error("Error saving file:", err);
  }
}

module.exports = { saveFile };
