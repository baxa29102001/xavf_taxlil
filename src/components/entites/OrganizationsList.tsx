import axiosT from "@/api/axios";
import { useDetectRoles } from "@/hooks/useDetectRoles";
import { Table } from "antd";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageTitle from "@/components/common/PageTitle";
import Search from "antd/es/input/Search";

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
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "",
    dataIndex: "edit",
    key: "edit",
  },
];

const levelOfRisk: any = {
  "Low Risk": {
    color: "#CEFFD2",
    title: "Xavfi past",
  },
  "High Risk": {
    color: "#FFD9D9",
    title: "Xavfi yuqori",
  },
  "Moderate Risk": {
    color: "#FBFFBC",
    title: "Xavfi o'rtacha",
  },
};

interface OrganizationsListProps {
  navigateUrl?: string;
}

export const OrganizationsList: FC<OrganizationsListProps> = ({
  navigateUrl,
}) => {
  const [organizationList, setOrganizationList] = useState([]);
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const { config } = useDetectRoles();

  useQuery(
    ["organizationList", id, searchText, activePage],
    () =>
      axiosT.get("/organizations/list/", {
        params: {
          category_id: id,
          search: searchText,
          page_size: 10,
          page: activePage,
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
          status: (
            <span
              style={{
                color: "#000",
                backgroundColor: levelOfRisk[item.risk_level]?.color,
                whiteSpace: "nowrap",
              }}
              className="px-2 py-1 rounded-lg"
            >
              {levelOfRisk[item.risk_level]?.title}
            </span>
          ),

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
        setTotalCount(data.count);
        setOrganizationList(arr);
      },
    }
  );

  const onSearchChange = (
    text: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchText(text.target.value);
  };
  return (
    <div className="px-4 py-5">
      <PageTitle title={`${query.get("category_name")}`} back />
      <div className="flex items-center gap-2 mb-8">
        <Search
          placeholder="Tashkilot nomi"
          onChange={(value) => onSearchChange(value)}
          className="flex-1"
        />
      </div>
      <div className="bg-white rounded-2xl p-3">
        <Table
          dataSource={organizationList}
          columns={columns}
          rowHoverable={false}
          rowClassName={(item: any) => {
            return `${item.color} cursor-pointer`;
          }}
          pagination={{
            pageSize: 10,
            total: totalCount,
            onChange(page: number) {
              setActivePage(page);
            },
          }}
        />
      </div>
    </div>
  );
};
