import { PowerShell } from "node-powershell";

import { getRandomSub } from "./utils/getRandomSub.js";
import { getPosts } from "./utils/getPosts.js";
import { getRandomPost } from "./utils/getRandomPost.js";
import { downloadImage } from "./utils/downloadImage.js";
import { writeLog } from "./utils/writeLog.js";

async function index() {
  console.log("Starting...");

  const chosenSub = getRandomSub();
  console.log("Chosen sub:", chosenSub);

  const posts = await getPosts(chosenSub);

  const chosenPost = getRandomPost(posts);

  console.log("Post URL:", `https://www.reddit.com${chosenPost.permalink}`);
  console.log("Image URL:", chosenPost.url_overridden_by_dest);

  console.log("Downloading image...");
  const filename = await downloadImage(chosenPost.url_overridden_by_dest);

  console.log("Setting wallpaper...");
  PowerShell.$`./src/setWallpaper.ps1 -imgPath ${filename}`;

  writeLog(chosenPost);
}

index();
