import axiosT from "./axios";

export const getMe = async () => {
  const { data } = await axiosT.get("/account/me");
  return data;
};
export const login = async (payload: any) => {
  const { data } = await axiosT.post("/account/login/", payload);
  return data;
};
export const logout = async () => {
  const { data } = await axiosT.get("/account/logout");
  return data;
};
