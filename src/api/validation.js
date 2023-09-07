const isValid = createdAt => {
  const expireTime = 86400000;
  const currentTime = Date.now();
  // 캐싱한 시각에서 1일이 넘었다면 false(invalid)
  return currentTime - createdAt < expireTime;
};

export default isValid;
