import axiosT from "@/api/axios";
import { useDetectRoles } from "@/hooks/useDetectRoles";
import { Table } from "antd";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

const columns = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Tashkilot nomi",
    dataIndex: "organization_name",
    key: "organization_name",
  },
  {
    title: "Tashkilot STIR",
    dataIndex: "organization_stir",
    key: "organization_stir",
  },
  {
    title: "Tashkilot joylashgan viloyat",
    dataIndex: "region",
    key: "region",
  },
  {
    title: "Tashkilot joylashgan tuman",
    dataIndex: "district",
    key: "district",
  },
  {
    title: "Tashkilot manzili",
    dataIndex: "adress",
    key: "adress",
  },
  {
    title: "Tahlil natijasi bo‘yicha jami ballar yig‘indisi",
    dataIndex: "ball",
    key: "ball",
  },
  {
    title: "",
    dataIndex: "edit",
    key: "edit",
  },
];

const levelOfRisk: any = {
  "Low Risk": "#CEFFD2",
  "High Risk": "#FFD9D9",
  "Moderate Risk": "#FBFFBC",
};

interface OrganizationsListProps {
  navigateUrl?: string;
}

export const OrganizationsList: FC<OrganizationsListProps> = ({
  navigateUrl,
}) => {
  const [organizationList, setOrganizationList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const { config } = useDetectRoles();

  console.log(config);
  useQuery(
    ["organizationList", id],
    () =>
      axiosT.get("/organizations/list/", {
        params: {
          category_id: id,
        },
      }),
    {
      onSuccess({ data }) {
        const arr = data.results.map((item: any, index: number) => ({
          index: item.id,
          organization_name: item.name,
          organization_stir: item.inn,
          region: item.region || "-",
          district: item.district || "-",
          adress: item.address || "-",
          ball: item.sum_score,
          color: "bg-" + `[${levelOfRisk[item.risk_level]}]`,
          edit: (
            <button
              className="text-[#4E75FF] bg-white px-6 py-2 border border-[#4E75FF] rounded-md cursor-pointer"
              onClick={() => {
                navigate(
                  (navigateUrl ? navigateUrl : `/${config.mainUrl}/entity/`) +
                    `${id}/${item.id}`
                );
              }}
            >
              Batafsil
            </button>
          ),
        }));

        setOrganizationList(arr);
      },
    }
  );

  return (
    <div className="px-4 py-5">
      <h2 className="text-[#262626] text-2xl font-semibold Monserrat mb-4.5">
        Telekommunikatsiya va maʼlumotlar uzatish tarmoqlari
      </h2>

      <div className="bg-white rounded-2xl p-3">
        <Table
          dataSource={organizationList}
          columns={columns}
          rowHoverable={false}
          rowClassName={(item: any) => {
            return `${item.color} cursor-pointer`;
          }}
        />
      </div>
    </div>
  );
};
