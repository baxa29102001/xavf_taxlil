import { useQuery } from "react-query";
import axiosT from "@/api/axios.ts";
import {
  IActionTakenByExaminationByOrganization,
  INNANDNAME,
  IStatusBuCategory,
} from "@/Interface/IHisobot.ts";
import { Button, DatePicker, Input, Select, Space, Table } from "antd";
import { useState } from "react";
import useDebouncedValue from "@/hooks/use-debounced-value.tsx";
import dayjs from "dayjs";
import PageTitle from "@/components/common/PageTitle";
import { PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { QuarterList } from "@/constants/share.tsx";

const { Search } = Input;

const columns = [
  {
    title: "INN",
    dataIndex: "inn",
    key: "inn",
  },
  {
    title: "Tadbirkorlik subyekti nomi",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tekshirishlar soni",
    dataIndex: "tekshiruvlar_soni",
    key: "tekshiruvlar_soni",
  },

  {
    title: "Chiqarilgan ko‘rsatmalar soni",
    dataIndex: "korsatmalar_soni",
    key: "korsatmalar_soni",
  },
  {
    title: "Chiqarilgan taqdimnomalar soni",
    dataIndex: "taqdimnomalar_soni",
    key: "taqdimnomalar_soni",
  },
  {
    title: "Ko‘rilgan intizomiy choralar soni",
    dataIndex: "intizomiy_soni",
    key: "intizomiy_soni",
  },
  {
    title: "Ko‘rilgan maʼmuriy choralar soni",
    dataIndex: "mamuriy_soni",
    key: "mamuriy_soni",
  },
];

const Index = () => {
  const currentYear = dayjs().year();

  const [dataSource, setDataSource] = useState<{
    count: number;
    results: INNANDNAME[] & IActionTakenByExaminationByOrganization[];
  }>({
    results: [],
    count: 0,
  });

  const [searchText, setSearchText] = useState("");
  const [quarter, setQuarter] = useState<number>();
  const [year, setYear] = useState<string>(currentYear.toString());
  const [activePage, setActivePage] = useState(1);

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
    [
      "action-taken-by-examination-by-organization",
      searchValue,
      year,
      quarter,
      activePage,
    ],
    () =>
      axiosT.get<{
        results: INNANDNAME[] & IActionTakenByExaminationByOrganization[];
        count: number;
      }>(`/reports/report-by-examination/`, {
        params: {
          year: year,
          search: searchValue,
          page: activePage,
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
              "O‘tkazilgan tekshirishlarga asosan ko‘rilgan choralar tadbirkorlik subyektlar kesimida"
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

      {/* <div className={"grid grid-cols-12 gap-4 mb-5"}>
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
          dataSource={dataSource.results}
          columns={columns}
          loading={isLoading}
          locale={{
            emptyText: "Ma’lumotlar mavjud emas",
          }}
          pagination={{
           showSizeChanger:false,
            current: activePage,
            total: dataSource.count,
            onChange(page: number) {
              setActivePage(page);
            },
          }}
        />
      </div>
    </div>
  );
};

export default Index;
