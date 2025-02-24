import axios from "axios";

const mode = import.meta.env.MODE;

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
  async () => {}
);

export default axiosT;
