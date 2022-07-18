import fs from "fs";

export const getRandomSub = () => {
  const rawSubs = fs.readFileSync("./src/data/subs.json");
  const subs = JSON.parse(rawSubs);

  const chosenSub = subs[Math.floor(Math.random() * subs.length)];

  return chosenSub;
}