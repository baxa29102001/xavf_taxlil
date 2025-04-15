import axiosT from "./axios";

export const FetchAllExaminationLists = async (params: any) => {
  try {
    const { data } = await axiosT.get("/examination/organization-list/", {
      params,
    });
    const formatedData = data.map((item: any) => ({
      value: item.id,
      label: item.name,
      status: item.risk_status,
      inn: item.inn,
    }));

    return formatedData;
  } catch (error) {}
};
