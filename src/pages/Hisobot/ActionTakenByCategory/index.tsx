import { useQuery } from "react-query";
import axiosT from "@/api/axios.ts";
import {
  IActionTakenByCategory,
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
    title: "Organizatisya nomi",
    dataIndex: "organization_name",
    key: "organization_name",
  },
  {
    title: "Organizatisya INN",
    dataIndex: "inn",
    key: "inn",
  },

  {
    title: "Tekshirishlar soni",
    dataIndex: "examinations_count",
    key: "examinations_count",
  },

  {
    title: "Chiqarilgan ko‘rsatmalar soni",
    dataIndex: "instructions_count",
    key: "instructions_count",
  },
  {
    title: "Chiqarilgan taqdimnomalar soni",
    dataIndex: "submissions_count",
    key: "submissions_count",
  },
  {
    title: "Ko‘rilgan intizomiy choralar soni",
    dataIndex: "disciplinary_measures_count",
    key: "disciplinary_measures_count",
  },
  {
    title: "Ko‘rilgan maʼmuriy choralar soni",
    dataIndex: "administrative_measures_count",
    key: "administrative_measures_count",
  },
];

const Index = () => {
  const currentYear = dayjs().year();

  const [dataSource, setDataSource] = useState<IActionTakenByCategory[]>([]);

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
    ["action-taken-by-category", searchValue, year],
    () =>
      axiosT.get<{ data: IActionTakenByCategory[] }>(
        `/reports/measures-by-organization/`,
        {
          params: {
            year: year,
            search: searchValue,
          },
        }
      ),
    {
      onSuccess({ data }) {
        setDataSource(data.data);
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
              "Xavf tahlili natijalariga asosan ko‘rilgan choralar tadbirkorlik subyeklar kesimida"
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
            {/* <Select
              allowClear
              onChange={(quarter) => setQuarter(quarter)}
              placeholder="Chorak"
              options={QuarterList}
              className={"w-[250px]"}
            /> */}

            <DatePicker onChange={onYearChange} picker="year" />
          </Space>
        </div>
      </div>

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
