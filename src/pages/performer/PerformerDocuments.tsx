import { useContext, useLayoutEffect, useState } from "react";

import { Input, Select, DatePicker, Table, message } from "antd";
import { useQuery } from "react-query";
import axiosT from "@/api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROLES } from "@/constants/enum";
import { useDetectRoles } from "@/hooks/useDetectRoles";
import { CancelIcon, ConfirmIcon, FileIcon } from "@/assets/icons";
import {
  ShowFilesByCategories,
  filesProp,
} from "@/components/common/ShowFilesByCategories";

const { Search } = Input;
const { RangePicker } = DatePicker;

const btns = [
  {
    value: "",
    label: "Barchasi",
    count: "",
  },
  {
    value: "Yangi",
    label: "Yangi",
    count: "0",
    id: "Yangi",
  },
  {
    value: "Jarayonda",
    label: "Jarayonda",
    count: "0",
    id: "Jarayonda",
  },
  {
    value: "Tasdiqlandi",
    label: "Tasdiqlangan",
    count: "0",
    id: "Tasdiqlandi",
  },
  {
    value: "Rad etildi",
    label: "Rad etilgan",
    count: "0",
    id: "Rad etildi",
  },
  {
    value: "Bartaraf qilingan",
    label: "Bartaraf qilish uchun sorov",
    count: "0",
    id: "Bartaraf qilingan",
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

  Bartaraf: {
    bgColor: "#EB6402",
    color: "#fff",
  },
};

type filesType = {
  file_type: filesProp[];
  files: filesProp[];
  measure_type: filesProp[];
  removed_type: filesProp[];
};

const PerformerDocuments = () => {
  const [activeBtn, setActiveBtn] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const [documentsData, setDocumentsData] = useState([]);
  const [documentsEliminateData, setDocumentsEliminateData] = useState([]);
  const { config } = useDetectRoles();
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [BTNS, setBTNs] = useState(btns);
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState(0);
  const [totalEliminateCount, setTotalEliminateCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const [activePage, setActivePage] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [eliminateActivePage, setEliminateActivePage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<{
    modal: boolean;
    item: any;
  }>({
    modal: false,
    item: {},
  });
  const [files, setFiles] = useState<filesType>({
    file_type: [],
    files: [],
    measure_type: [],
    removed_type: [],
  });

  useQuery(["categories"], () => axiosT.get("/organizations/categories/"), {
    onSuccess({ data }) {
      setCategories(data);
    },
  });
  useQuery(
    ["casedistribution"],
    () => axiosT.get("/dashboard/case-status-distribution/"),
    {
      onSuccess({ data }) {
        const arr = BTNS.map((item: any) => {
          return {
            ...item,
            count: data[item.id],
          };
        });
        setBTNs(arr);
      },
    }
  );

  useQuery(
    ["Scores", activeBtn, activeCategory, searchText, activePage],
    () =>
      axiosT.get("/scores/cases/all/", {
        params: {
          status: activeBtn === "Bartaraf qilingan" ? undefined : activeBtn,
          category_id: activeCategory,
          search: searchText,
          page: activePage,
          removed: activeBtn === "Bartaraf qilingan" ? true : undefined,
        },
      }),
    {
      onSuccess({ data }) {
        const arr = data.results.map((item: any, index: number) => ({
          ...item,
          index: index + 1,
          status: (
            <span
              style={{
                color:
                  statusOptions[item.removed ? "Bartaraf" : item.status].color,
                backgroundColor:
                  statusOptions[item.removed ? "Bartaraf" : item.status]
                    .bgColor,
                whiteSpace: "nowrap",
              }}
              className="px-2 py-1 rounded-lg"
            >
              {item.removed ? "Bartaraf qilindi" : item.status}
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
        setTotalCount(data.count);
        setDocumentsData(arr);
      },
    }
  );

  useQuery(
    ["files", isModalOpen.modal],
    () => axiosT.get(`/scores/cases/all/${isModalOpen.item?.case}/`),
    {
      enabled: !!isModalOpen.modal,
      onSuccess({ data }) {
        setFiles(data);
      },
    }
  );

  const { refetch: refetchRemovedScores } = useQuery(
    [
      "removedScoreNews",
      activeBtn,
      eliminateActivePage,
      activeCategory,
      searchText,
      activePage,
    ],
    () =>
      axiosT.get("/scores/removed-scores/", {
        params: {
          status: 1,
          category_id: activeCategory,
          search: searchText,
          page: activePage,
        },
      }),
    {
      onSuccess({ data }) {
        const arr = data.results.map((item: any, index: number) => ({
          ...item,
          index: index + 1,
          status: "So'rov yuborilgan",

          edit: (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsModalOpen({ modal: true, item: item });
                }}
                className="bg-[#DCE4FF] border rounded-md cursor-pointer border-[#4E75FF] text-[#4E75FF] py-2 px-3 flex items-center gap-2"
              >
                <FileIcon />
                Fayllar
              </button>
              {config?.role === ROLES.MASUL && (
                <>
                  <button
                    className="text-[#18BA92] bg-white px-3 py-2 border border-[#18BA92] rounded-md cursor-pointer"
                    onClick={() => handleApprove(item.id)}
                  >
                    <ConfirmIcon />
                  </button>
                  <button
                    className="text-[#F42829] bg-white px-3 py-2 border border-[#F42829] rounded-md cursor-pointer"
                    onClick={() => handleReject(item.id)}
                  >
                    <CancelIcon />
                  </button>
                </>
              )}
            </div>
          ),
        }));
        setTotalEliminateCount(data.count);
        setDocumentsEliminateData(arr);
      },
    }
  );

  const handleApprove = async (id: number) => {
    try {
      await axiosT.put(`/scores/removed-scores/${id}/approve/`);
      messageApi.open({
        type: "success",
        content: "Tasdiqlandi",
      });
      refetchRemovedScores();
    } catch (error) {
      console.error("Error approving request:", error);
      messageApi.open({
        type: "error",
        content: "Xatolik yuz berdi",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axiosT.put(`/scores/removed-scores/${id}/reject/`);
      messageApi.open({
        type: "success",
        content: "Rad etildi",
      });
      refetchRemovedScores();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Xatolik yuz berdi",
      });
    }
  };

  const onSearchChange = (
    text: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchText(text.target.value);
  };

  useLayoutEffect(() => {
    const status = searchParams.get("status") || "";
    setActiveBtn(status);
  }, []);

  return (
    <div className="px-4 py-5">
      {contextHolder}
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
            + Ma'lumot kiritish
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 bg-white w-max p-1 mb-6">
        {BTNS.map((btn: any) => (
          <button
            className={`py-1.5 px-4 rounded-sm  cursor-pointer gap-3 flex items-center justify-between ${
              activeBtn === btn.value ? "bg-[#1C5196] text-white" : ""
            }`}
            onClick={() => {
              setActiveBtn(btn.value);
              setSearchParams({ status: btn.value });
            }}
          >
            {btn.label}
            {![undefined, 0].includes(btn.count) && (
              <span className="bg-red-600 rounded-full text-center text-white w-5 h-5 text-[10px] flex items-center justify-center">
                {btn.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-8">
        <Search
          placeholder="Tashkilot nomi"
          onChange={(value) => onSearchChange(value)}
          className="flex-1"
        />
        <RangePicker className="flex-1" placeholder={["dan", "gacha"]} />
        <Select
          allowClear
          onChange={() => {}}
          placeholder="Men tomondan kiritilgan"
          className="flex-1"
          options={[]}
        />
        <Select
          allowClear
          onChange={(data: any) => {
            setActiveCategory(data);
          }}
          placeholder="Kategoriyasi"
          className="flex-1"
          options={categories.map((item: any) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      </div>

      {activeBtn === "Bartaraf qilingan" ? (
        <>
          <div className="bg-white rounded-2xl p-3">
            <Table
              columns={columns}
              dataSource={documentsEliminateData}
              pagination={{
                total: totalEliminateCount,
                pageSize: 10,
                onChange: (page: any) => {
                  setEliminateActivePage(page);
                },
              }}
            />
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl p-3">
          <Table
            columns={columns}
            dataSource={documentsData}
            pagination={{
              total: totalCount,
              pageSize: 10,
              onChange: (page: any) => {
                setActivePage(page);
              },
            }}
          />
        </div>
      )}

      <ShowFilesByCategories
        files={{
          file_type: files.file_type,
          measure_type: files.measure_type,
          removed_type: files.removed_type,
          files: files.files,
        }}
        isModalOpen={isModalOpen.modal}
        setIsModalOpen={() => {
          setIsModalOpen({
            modal: false,
            item: {},
          });
        }}
      />
    </div>
  );
};

export default PerformerDocuments;
