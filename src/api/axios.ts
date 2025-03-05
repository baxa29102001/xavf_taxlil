import axios from "axios";

const axiosT = axios.create({
  baseURL: "https://rkjp.technocorp.uz/api",
  withCredentials: true,
});

axiosT.interceptors.request.use((config) => {
  return config;
});

axiosT.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    return Promise.reject(error.response.data);
  }
);

export default axiosT;
