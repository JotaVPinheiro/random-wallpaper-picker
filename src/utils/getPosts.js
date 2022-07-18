import fetch from "node-fetch";

export const getPosts = async (chosenSub) => {
  const redditUrl = `https://www.reddit.com/${chosenSub}.json`;

  const response = await fetch(redditUrl);
  const { data } = await response.json();

  return data.children.filter((post) => post.data.post_hint === "image");
};
