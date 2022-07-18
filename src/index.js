import fetch from "node-fetch";
import { PowerShell } from "node-powershell";
import ImageDownloader from "image-downloader";
import fs from "fs";

async function DownloadImage(url) {
  console.log("Downloading image...");

  const { filename } = await ImageDownloader.image({
    url: url,
    dest: filePath,
  });

  console.log("Setting wallpaper...");

  PowerShell.$`./src/SetWallpaper.ps1 -imgPath ${filename}`;
}

function WriteLog(post) {
  const path = "./tmp/log.json";
  if (!fs.existsSync(path)) fs.writeFileSync(path, "[]");

  const rawData = fs.readFileSync(path);
  const data = JSON.parse(rawData) || [];

  data.push({
    timestamp: new Date(),
    postURL: `https://www.reddit.com${post.permalink}`,
    imageURL: post.url_overridden_by_dest,
  });

  fs.writeFileSync(path, JSON.stringify(data));
}

async function loadPost(redditUrl) {
  const response = await fetch(redditUrl);
  const { data } = await response.json();

  let postsURLs = [];

  data.children.map((post) => {
    if (post.data.post_hint == "image") postsURLs.push(post);
  });

  let chosenPost = postsURLs[Math.floor(Math.random() * postsURLs.length)];
  console.log(`Post URL: https://www.reddit.com${chosenPost.data.permalink}`);
  console.log(`Image URL: ${chosenPost.data.url_overridden_by_dest}`);

  DownloadImage(chosenPost.data.url_overridden_by_dest);
  WriteLog(chosenPost.data);
}

console.log("Starting...");

let filePath = process.cwd() + "/tmp";
if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);

const rawSubs = fs.readFileSync("./src/data/subs.json");
const subs = JSON.parse(rawSubs);

let chosenSub = subs[Math.floor(Math.random() * subs.length)];
console.log("Chosen sub:", chosenSub);

let redditUrl = `https://www.reddit.com/${chosenSub}.json`;

loadPost(redditUrl);
