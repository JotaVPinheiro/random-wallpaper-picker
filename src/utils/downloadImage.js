import fs from "fs";
import ImageDownloader from "image-downloader";

const dest = process.cwd() + "/tmp";

export const downloadImage = async (url) => {
  fs.existsSync(dest) || fs.mkdirSync(dest);

  const { filename } = await ImageDownloader.image({ url, dest });

  return filename;
};
