import axiosT from "@/api/axios";
import { FileIcon } from "@/assets/icons";
import {
  ShowFilesByCategories,
  filesProp,
} from "@/components/common/ShowFilesByCategories";
import { Table, TableColumnsType } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";

const BTNS = [
  {
    value: "file_type=1",
    label: "Taqdimnoma",
  },
  {
    value: "file_type=2",
    label: "Ko'rsatma",
  },
  {
    value: "measure_type=2",
    label: "Ma'muriy",
  },
  {
    value: "measure_type=1",
    label: "Intizomiy",
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
    title: "Ko'rilgan chora",
    dataIndex: "solution",
    key: "solution",
  },

  {
    title: "Hujjat",
    dataIndex: "file",
    key: "file",
  },
];
type filesType = {
  file_type: filesProp[];
  files: filesProp[];
  measure_type: filesProp[];
  removed_type: filesProp[];
  rejection_history?: filesProp[];
};
const SolutionList = () => {
  const [activeBtn, setActiveBtn] = useState("file_type=1");
  const [activePage, setActivePage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
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
    rejection_history: [],
  });

  const [documentsData, setDocumentsData] = useState([]);
  useQuery(
    ["solutionsCaseAll", activeBtn, activePage],
    () =>
      axiosT.get("/scores/cases/all/", {
        params: {
          page: activePage,
          [activeBtn.split("=")[0]]: activeBtn.split("=")[1],
        },
      }),
    {
      onSuccess({ data }) {
        const arr = data.results.map((item: any, index: number) => ({
          ...item,
          index: index + 1,

          solution: BTNS.find((i) => i.value === activeBtn)?.label,
          file: (
            <button
              onClick={() => {
                setIsModalOpen({ modal: true, item });
              }}
              className="bg-[#DCE4FF] border rounded-md cursor-pointer border-[#4E75FF] text-[#4E75FF] py-2 px-3 flex items-center gap-2"
            >
              <FileIcon />
              Fayllar
            </button>
          ),
        }));
        setTotalCount(data.count);
        setDocumentsData(arr);
      },
    }
  );

  useQuery(
    ["scoreHistoryFiles", isModalOpen.modal],
    () => axiosT.get(`/scores/cases/all/${isModalOpen.item.id}/`),
    {
      enabled: isModalOpen.modal,
      onSuccess({ data }) {
        setFiles(data);
      },
    }
  );
  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[#262626] text-2xl font-semibold Monserrat mb-4.5">
          Ko'rilgan choralar
        </h2>
      </div>

      <div className="flex items-center gap-2 bg-white w-max p-1 mb-6">
        {BTNS.map((btn: any) => (
          <button
            className={`py-1.5 px-4 rounded-sm  cursor-pointer gap-3 flex items-center justify-between ${
              activeBtn === btn.value ? "bg-[#1C5196] text-white" : ""
            }`}
            onClick={() => {
              setActiveBtn(btn.value);
              //   setSearchParams({ status: btn.value });
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

      {/* <div className="flex items-center gap-2 mb-8">
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
      </div> */}
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

      <ShowFilesByCategories
        files={{
          file_type: files.file_type,
          measure_type: files.measure_type,
          removed_type: files.removed_type,
          files: files.files,
          rejection_history: files.rejection_history,
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

export default SolutionList;
