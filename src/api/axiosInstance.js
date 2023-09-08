import axios from 'axios';
import isValid from './validation';
const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  timeout: 20000,
});

instance.interceptors.request.use(
  async function (config) {
    config.headers.contentType = 'application/json; charset=utf-8';
    const result = await caches.match(config.url).then(response => response && response.json());
    if (result) {
      if (isValid(result.headers.created_date)) {
        return Promise.reject(result);
      }
      const cacheStorage = await caches.open('search');
      await cacheStorage.delete(config.url);
    }
    // 요구사항: API를 호출할 때 마다 `console.info("calling api")` 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정
    console.info('calling api');
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  async function (config) {
    if (config.data.length !== 0) {
      config.headers.created_date = Date.now();
      const cacheStorage = await caches.open('search');
      const cacheResponse = new Response(JSON.stringify(config));
      await cacheStorage.put(config.config.url, cacheResponse);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
export default instance;
