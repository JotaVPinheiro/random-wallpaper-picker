import fs from "fs";

const path = "./tmp/log.json";

export const writeLog = (post) => {
  fs.existsSync(path) || fs.writeFileSync(path, "[]");

  const rawData = fs.readFileSync(path);
  const data = JSON.parse(rawData) || [];

  data.push({
    timestamp: new Date(),
    postURL: `https://www.reddit.com${post.permalink}`,
    imageURL: post.url_overridden_by_dest,
  });

  fs.writeFileSync(path, JSON.stringify(data));
};
