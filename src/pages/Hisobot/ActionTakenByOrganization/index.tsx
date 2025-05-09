import { useQuery } from "react-query";
import axiosT from "@/api/axios.ts";
import { IActionTakenByMainCategory } from "@/Interface/IHisobot.ts";
import { Input, Table } from "antd";
import { useState } from "react";
import useDebouncedValue from "@/hooks/use-debounced-value.tsx";
import dayjs from "dayjs";
import PageTitle from "@/components/common/PageTitle";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const { Search } = Input;

const columns = [
  {
    title: "Yo‘nalishlar nomi",
    dataIndex: "category",
    key: "category",
  },

  // {
  //   title: "Tekshirishlar soni",
  //   dataIndex: "examinations",
  //   key: "examinations",
  // },
  // {
  //   title: "Profilaktikalar soni",
  //   dataIndex: "profilaktika",
  //   key: "profilaktika",
  // },
  {
    title: "Chiqarilgan ko‘rsatmalar soni",
    dataIndex: "instructions",
    key: "instructions",
  },
  {
    title: "Chiqarilgan taqdimnomalar soni",
    dataIndex: "submissions",
    key: "submissions",
  },
  {
    title: "Ko‘rilgan intizomiy choralar soni",
    dataIndex: "disciplinary",
    key: "disciplinary",
  },
  {
    title: "Ko‘rilgan maʼmuriy choralar soni",
    dataIndex: "administrative",
    key: "administrative",
  },
];

const Index = () => {
  const currentYear = dayjs().year();

  const [dataSource, setDataSource] = useState<IActionTakenByMainCategory[]>(
    []
  );

  const [searchText, setSearchText] = useState("");
  const [quarter, setQuarter] = useState<number>();
  const [year, setYear] = useState<string>(currentYear.toString());

  const searchValue = useDebouncedValue(searchText, 1000);
  const onSearchChange = (
    text: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchText(text.target.value);
  };

  const onYearChange = (year: string) => {
    const formated = dayjs(year).format("YYYY");
    setYear(formated);
  };

  const { isLoading } = useQuery(
    ["action-taken-main-by-category", searchValue, year],
    () =>
      axiosT.get<IActionTakenByMainCategory[]>(`/reports/report-by-category/`, {
        params: {
          year: year,
          // search: searchValue,
        },
      }),
    {
      onSuccess({ data }) {
        setDataSource(data);
      },
    }
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <div className={"grid grid-cols-12"}>
        <div className="col-span-6">
          <PageTitle
            title={
              "Xavf tahlili natijalariga asosan ko‘rilgan choralar yo‘nalishlar kesimida"
            }
            back
          />
        </div>
        {/* <div className="col-span-6 flex justify-end">
          <Space>
            <Button
              icon={<PrinterOutlined />}
              color="primary"
              variant="outlined"
              onClick={() => reactToPrintFn()}
            >
              Chop etish
            </Button>
            <Button
              icon={<PrinterOutlined />}
              color="primary"
              variant="outlined"
              target={"_blank"}
              href={`${axiosT.defaults.baseURL}/reports/case-status-by-category/?year=${year}&export=excel`}
            >
              Excel yuklab olish
            </Button>
          </Space>
        </div> */}
      </div>
      {/* 
      <div className={"grid grid-cols-12 gap-4 mb-5"}>
        <div className="col-span-6">
          <Search
            placeholder="Tashkilot nomi"
            onChange={(value) => onSearchChange(value)}
            className="max-w-[300px]"
          />
        </div>
        <div className="col-span-6 flex justify-end">
          <Space>
            <Select
              allowClear
              onChange={(quarter) => setQuarter(quarter)}
              placeholder="Chorak"
              options={QuarterList}
              className={"w-[250px]"}
            />

            <DatePicker onChange={onYearChange} picker="year" />
          </Space>
        </div>
      </div> */}

      <div ref={contentRef}>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          locale={{
            emptyText: "Ma’lumotlar mavjud emas",
          }}
        />
      </div>
    </div>
  );
};

export default Index;
