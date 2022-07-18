export const getRandomPost = (posts) => {
  const { data } = posts[Math.floor(Math.random() * posts.length)];

  return data;
};
