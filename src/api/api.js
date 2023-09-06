import axiosInstance from "./axiosInstance";

const GETSICK = "/sick?q=";

let timer;

const getSickData = (param = "") => {
  if (timer) {
    clearTimeout(timer);
  }

  return new Promise((resolve, reject) => {
    timer = setTimeout(async () => {
      try {
        if (param === "") {
          resolve([]);
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
    }, 300);
  });
};

export { getSickData };
