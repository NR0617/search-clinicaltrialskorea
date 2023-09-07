import axios from "axios";
import isValid from "./validation";
const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  timeout: 5000,
});

instance.interceptors.request.use(
  async function (config) {
    config.headers.contentType = "application/json; charset=utf-8";
    const result = await caches
      .match(config.url)
      .then((response) => response && response.json());
    if (!!result) {
      if (isValid(result.headers.created_date)) {
        return Promise.reject(result);
      }
      const cacheStorage = await caches.open("search");
      await cacheStorage.delete(config.url);
    }
    console.log("api call");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async function (config) {
    if (config.data.length !== 0) {
      config.headers.created_date = Date.now();
      const cacheStorage = await caches.open("search");
      const headers = new Headers();
      headers.append("Content-Type", "application/json;charset=utf-8");
      const cacheResponse = new Response(JSON.stringify(config), {
        headers: headers,
      });

      await cacheStorage.put(config.config.url, cacheResponse);
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default instance;
