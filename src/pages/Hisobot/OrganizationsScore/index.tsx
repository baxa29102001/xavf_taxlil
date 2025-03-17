import { useQuery } from "react-query";
import axiosT from "@/api/axios.ts";
import { IOrganizationScore } from "@/Interface/IHisobot.ts";
import { Button, DatePicker, Input, Space, Table } from "antd";
import { useState } from "react";
import useDebouncedValue from "@/hooks/use-debounced-value.tsx";
import dayjs from "dayjs";
import PageTitle from "@/components/common/PageTitle";
import { PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const { Search } = Input;

const columns = [
  {
    title: "Tashkilot STIR",
    dataIndex: "inn",
    key: "inn",
  },
  {
    title: "Tadbirkorlik subyekti nomi",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Umumiy ballar",
    dataIndex: "total_score",
    key: "total_score",
  },
  {
    title: "1-chorak",
    dataIndex: "Q1_score",
    key: "Q1_score",
  },
  {
    title: "2-chorak",
    dataIndex: "Q2_score",
    key: "Q2_score",
  },
  {
    title: "3-chorak",
    dataIndex: "Q3_score",
    key: "Q3_score",
  },
  {
    title: "4-chorak",
    dataIndex: "Q4_score",
    key: "Q4_score",
  },
];

const Index = () => {
  const currentYear = dayjs().year();

  const [dataSource, setDataSource] = useState<IOrganizationScore[]>([]);

  const [searchText, setSearchText] = useState("");
  const [year, setYear] = useState<string>(currentYear.toString());

  const searchValue = useDebouncedValue(searchText, 1000);
  const onSearchChange = (
    text: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchText(text.target.value);
  };

  const onYearChange = (year: string) => {
    const formated = !year
      ? `${new Date().getFullYear()}`
      : dayjs(year).format("YYYY");
    setYear(formated);
  };

  const { isLoading } = useQuery(
    ["organizations-scores", searchValue, year],
    () =>
      axiosT.get<{ organizations: IOrganizationScore[] }>(
        `/reports/organizations-scores/`,
        {
          params: {
            year: year,
            search: searchValue,
          },
        }
      ),
    {
      onSuccess({ data }) {
        setDataSource(data.organizations);
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
            title={`Xavf tahlili natijalari choraklar kesimida`}
            back
          />
        </div>
        <div className="col-span-6 flex justify-end">
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
              href={`${axiosT.defaults.baseURL}/reports/organizations-scores/?year=${year}&export=excel`}
            >
              Excel yuklab olish
            </Button>
          </Space>
        </div>
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
          <DatePicker onChange={onYearChange} picker="year" />
        </div>
      </div>

      <div ref={contentRef}>
        <Table dataSource={dataSource} columns={columns} loading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
