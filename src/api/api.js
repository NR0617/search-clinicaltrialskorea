import axiosInstance from './axiosInstance';

const GETSICK = '/sick?q=';

let timer;

const getSickData = param => {
  return new Promise((resolve, reject) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      try {
        if (!param) {
          resolve(null);
          return;
        }
        const response = await axiosInstance.get(GETSICK + param);
        resolve(response.data);
      } catch (error) {
        if (error && error.data) {
          resolve(error.data);
        } else {
          reject(error);
        }
      }
    }, 200);
  });
};

export { getSickData };
