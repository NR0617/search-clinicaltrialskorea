const isValid = (createdAt) => {
  const expireTime = 86400000;
  const currentTime = Date.now();
  return currentTime - createdAt < expireTime;
};

export default isValid;
