import axiosT from "@/api/axios";
import { ConfigProvider, Select, Table } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";

const dataSource = [
  {
    index: "1",
    organ_name: "“Uzbektelecom” МЧЖ",
    ball: (
      <span className="py-1 px-3 bg-red text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444] rounded-[8px]">
        42
      </span>
    ),
  },
  {
    index: "2",
    organ_name: "“Uzbektelecom” МЧЖ",
    ball: (
      <span className="py-1 px-3 bg-red text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444] rounded-[8px]">
        12
      </span>
    ),
  },
  {
    index: "3",
    organ_name: "“Uzbektelecom” МЧЖ",
    ball: (
      <span className="py-1 px-3 bg-red text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444] rounded-[8px]">
        21
      </span>
    ),
  },
  {
    index: "4",
    organ_name: "“Uzbektelecom” МЧЖ",
    ball: (
      <span className="py-1 px-3 bg-red text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444] rounded-[8px]">
        15
      </span>
    ),
  },
];

const columns = [
  {
    title: "#",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Tashkilot nomi",
    dataIndex: "organ_name",
    key: "organ_name",
  },
  {
    title: "Ball",
    dataIndex: "ball",
    key: "ball",
  },
];

export const TopEntitesStatics = () => {
  const [statics, setStatics] = useState<any>([]);
  useQuery(
    ["topOrganizationsStatics"],
    () => axiosT.get("/dashboard/top-organizations/"),
    {
      onSuccess({ data }) {
        const arr = data?.organizations?.map((item: any, index: number) => ({
          index: index + 1,
          organ_name: item.name,
          ball: (
            <span className="py-1 px-3 bg-red text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444] rounded-[8px]">
              {item.total_score}
            </span>
          ),
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#05004E] font-semibold text-[20px]">
          Top tadbirkorlik subyektlari
        </h2>

        <div className="flex items-center gap-2">
          <Select
            placeholder="Xavf darajasi"
            style={{
              width: 150,
            }}
            allowClear
            options={[
              {
                value: "yaxshi",
                label: "Yaxshi",
              },
              {
                value: "yomon",
                label: "Yomon",
              },
            ]}
          />{" "}
          {/* <Select
            placeholder="Chorak"
            style={{
              width: 150,
            }}
            allowClear
            options={[
              {
                value: "1",
                label: "1-chorak",
              },
              {
                value: "2",
                label: "2-chorak",
              },
            ]}
          /> */}
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#fff",
              headerSplitColor: "#EDF2F6",
              headerColor: "#96A5B8",
            },
          },
        }}
      >
        <Table
          dataSource={statics}
          columns={columns}
          pagination={false}
          rowHoverable={false}
        />
      </ConfigProvider>
    </div>
  );
};
