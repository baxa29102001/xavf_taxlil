import { useQuery } from "react-query";
import DonutChart from "../charts/DonutChart";
import axiosT from "@/api/axios";
import { useState } from "react";

export const DocumentStatics = () => {
  const [statics, setStatics] = useState<any>({});
  useQuery(
    ["documentsStatics"],
    () => axiosT.get("/dashboard/case-status-distribution/"),
    {
      onSuccess({ data }) {
        setStatics(data);
      },
    }
  );

  return (
    <div
      className="bg-white py-[23px] pb-8 px-8 rounded-[20px]"
      style={{
        boxShadow: "0px 4px 20px 0px rgba(238, 238, 238, 0.50)",
      }}
    >
      <h2 className="text-[#05004E] font-semibold text-[20px]">
        Hujjatlar holati bo’yicha
      </h2>
      <div className="flex items-center gap-2">
        <DonutChart
          value={statics.Tasdiqlandi}
          colors={["#3CD856", "rgba(59, 209, 84, 0.20)"]}
          title="Tasdiqlangan"
        />
        <DonutChart
          value={statics["Rad etildi"]}
          colors={["#F55757", "#FFE7E7"]}
          title="Rad etilgan"
        />
      </div>
    </div>
  );
};
