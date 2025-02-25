import { useContext, useState } from "react";

import { Input, Select, DatePicker, Table } from "antd";
import { useQuery } from "react-query";
import axiosT from "@/api/axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/context/authContext";
import { ROLES } from "@/constants/enum";
import { useDetectRoles } from "@/hooks/useDetectRoles";

const { Search } = Input;
const { RangePicker } = DatePicker;

const btns = [
  {
    value: "",
    label: "Barchasi",
    count: "",
  },
  {
    value: "new",
    label: "Yangi",
    count: "",
  },
  {
    value: "live",
    label: "Jarayonda",
    count: "",
  },
  {
    value: "completed",
    label: "Tasdiqlangan",
    count: "",
  },
  {
    value: "canceled",
    label: "Rad etilgan",
    count: "",
  },
];

const columns = [
  {
    title: "№",
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
    dataIndex: "inn",
    key: "inn",
  },
  {
    title: "Hujjat sanasi",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Kategoriyasi",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Kriteriya",
    dataIndex: "criteria",
    key: "criteria",
  },
  {
    title: "Statusi",
    dataIndex: "status",
    key: "status",
  },

  {
    title: "",
    dataIndex: "edit",
    key: "edit",
  },
];

const statusOptions: any = {
  Yangi: {
    bgColor: "#CCD8FF",
    color: "#003CFF",
  },
  Jarayonda: {
    bgColor: "#FFF8DD",
    color: "#CCB243",
  },
  Tasdiqlandi: {
    bgColor: "#D2FBF0",
    color: "#18BA92",
  },

  "Rad etildi": {
    bgColor: "#FDD4D4",
    color: "#F42829",
  },
};

const PerformerDocuments = () => {
  const [activeBtn, setActiveBtn] = useState("");

  const [documentsData, setDocumentsData] = useState([]);
  const { config } = useDetectRoles();

  const navigate = useNavigate();

  useQuery(["Scores"], () => axiosT.get("/scores/cases/all/"), {
    onSuccess({ data }) {
      const arr = data.results.map((item: any, index: number) => ({
        ...item,
        index: index + 1,
        status: (
          <span
            style={{
              color: statusOptions[item.status].color,
              backgroundColor: statusOptions[item.status].bgColor,
            }}
            className="px-2 py-1 rounded-lg"
          >
            {item.status}
          </span>
        ),

        edit: (
          <button
            className="text-[#4E75FF] bg-white px-6 py-2 border border-[#4E75FF] rounded-md cursor-pointer"
            onClick={() => {
              const params = new URLSearchParams({
                title: item.organization_name,
              }).toString();
              navigate(
                `/${config.mainUrl}/documents/` + item.id + `/?${params}`
              );
            }}
          >
            Batafsil
          </button>
        ),
      }));

      setDocumentsData(arr);
    },
  });

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[#262626] text-2xl font-semibold Monserrat mb-4.5">
          Hujjatlar
        </h2>
        {config?.role === ROLES.IJROCHI && (
          <button
            className="bg-[#4E75FF] rounded-sm py-2 px-6 text-white cursor-pointer"
            onClick={() => {
              navigate("/performer/documents/category");
            }}
          >
            + Ma’lumot kiritish
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 bg-white w-max p-1 mb-6">
        {btns.map((btn: any) => (
          <button
            className={`py-1.5 px-4 rounded-sm  cursor-pointer ${
              activeBtn === btn.value ? "bg-[#1C5196] text-white" : ""
            }`}
            onClick={() => setActiveBtn(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-8">
        <Search
          placeholder="Tashkilot nomi"
          onSearch={() => {}}
          className="flex-1"
        />
        <RangePicker className="flex-1" placeholder={["dan", "gacha"]} />
        <Select
          allowClear
          onChange={() => {}}
          placeholder="Men tomondan kiritilgan"
          className="flex-1"
          options={[{ value: "jack", label: "Jack" }]}
        />{" "}
        <Select
          allowClear
          onChange={() => {}}
          placeholder="Kategoriyasi"
          className="flex-1"
          options={[{ value: "jack", label: "Jack" }]}
        />{" "}
        <Select
          allowClear
          onChange={() => {}}
          placeholder="Statusi"
          className="flex-1"
          options={[{ value: "jack", label: "Jack" }]}
        />
      </div>
      <div className="bg-white rounded-2xl p-3">
        <Table columns={columns} dataSource={documentsData} />
      </div>
    </div>
  );
};

export default PerformerDocuments;
