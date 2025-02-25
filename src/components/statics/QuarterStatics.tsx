import { useQuery } from "react-query";

import axiosT from "@/api/axios";
import { useState } from "react";
import { VerticalChart } from "../charts/DynamicBarChart";
import { BasicLineChart } from "../charts/LineCharts";

const quartersOptions: any = {
  Q1: "1-chorak",
  Q2: "2-chorak",
  Q3: "3-chorak",
  Q4: "4-chorak",
};
export const QuarterStatics = () => {
  const [statics, setStatics] = useState<any>([]);

  useQuery(
    ["quartersStatics"],
    () => axiosT.get("/dashboard/risk-over-quarters/"),
    {
      onSuccess({ data }) {
        const arr = Object.keys(data).map((item: any) => ({
          ...data[item],
          title: quartersOptions[item],
        }));

        setStatics(arr);
      },
    }
  );

  return (
    <div
      className="bg-white py-[23px] px-8 rounded-[20px]"
      style={{
        boxShadow: "0px 4px 20px 0px rgba(238, 238, 238, 0.50)",
      }}
    >
      <h2 className="text-[#05004E] font-semibold text-[20px] mb-4">
        Xavf darajalari bo’yicha
      </h2>

      <BasicLineChart
        xAxis={{
          categories: statics.map((item: any) => item.title),
        }}
        series={[
          {
            name: "Xavfi yuqori tashkilotlar",
            data: statics.map((item: any) => item.high),
            color: "#EF4444", // riski yuqori bo'lgan tashkilotlar
          },
          {
            name: "Xavfi past tashkilotlar",
            data: statics.map((item: any) => item.low),
            color: "#3CD856", // riski kam bo'lgan tashkilotlar
          },
          {
            name: "Xavfi o’rta tashkilotlar", // riski o'rtacha bo'lgan tashkilotlar
            data: statics.map((item: any) => item.medium),
            color: "#FFF4DE",
          },
        ]}
      />
    </div>
  );
};
