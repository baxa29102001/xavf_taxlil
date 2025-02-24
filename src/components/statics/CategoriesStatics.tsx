import { useQuery } from "react-query";

import axiosT from "@/api/axios";
import { useState } from "react";
import { VerticalChart } from "../charts/DynamicBarChart";

export const CategoriesStatics = () => {
  const [statics, setStatics] = useState<any>([]);
  useQuery(
    ["categoriesStatics"],
    () => axiosT.get("/dashboard/organizations-by-category/"),
    {
      onSuccess({ data }) {
        const arr = Object.keys(data).map((item: any, index: number) => ({
          ...data[item],
          title: item,
          //   data: [data[item].high, data[item].low, data[item].medium],
        }));

        console.log("arr", arr);
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
        Kategoriyalar bo’yicha
      </h2>

      <VerticalChart
        xAxis={{
          max: statics.length - 1,
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
