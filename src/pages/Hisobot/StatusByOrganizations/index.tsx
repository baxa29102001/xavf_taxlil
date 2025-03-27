import { useQuery } from "react-query";
import axiosT from "@/api/axios.ts";
import { IStatusBuCategory } from "@/Interface/IHisobot.ts";
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
    title: "Holat yuborilgan yo‘nalishlar nomi",
    dataIndex: "category_name",
    key: "category_name",
  },
  {
    title: "Umumiy yuborilgan holatlar soni",
    dataIndex: "total_cases_count",
    key: "total_cases_count",
  },
  {
    title: "Kelishilgan holatlar soni",
    dataIndex: "approved_count",
    key: "approved_count",
  },
  {
    title: "Rad qiingan holatlar soni",
    dataIndex: "rejected_count",
    key: "rejected_count",
  },
  {
    title: "Jarayondagi holatlar soni",
    dataIndex: "in_progress_count",
    key: "in_progress_count",
  },
];

const Index = () => {
  const currentYear = dayjs().year();

  const [dataSource, setDataSource] = useState<IStatusBuCategory[]>([]);
  const [organizationsSelect, setOrganizationsSelect] = useState<
    { label: string; value: number }[]
  >([]);

  const [searchText, setSearchText] = useState("");
  const [quarter, setQuarter] = useState<number>();
  const [year, setYear] = useState<string>(currentYear.toString());
  const [organizationId, setOrganizationId] = useState<number>();

  // get Organizations
  const { isLoading: isLoadingOrganizations } = useQuery(
    ["organizations-select"],
    () => axiosT.get<{ id: number; name: string }[]>(`organizations/select/`),
    {
      onSuccess({ data }) {
        const formated = data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        setOrganizationsSelect(formated);
      },
    }
  );

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
    ["case-status-by-category", searchValue, year, quarter, organizationId],
    () =>
      axiosT.get<{ categories: IStatusBuCategory[] }>(
        `/reports/case-status-by-category/`,
        {
          params: {
            year: year,
            search: searchValue,
            quarter: quarter,
            organizationId: organizationId,
          },
        }
      ),
    {
      onSuccess({ data }) {
        setDataSource(data.categories);
      },
    }
  );

  const onOrganizationChange = (organization: number) => {
    setOrganizationId(organization);
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <div className={"grid grid-cols-12"}>
        <div className="col-span-6">
          <PageTitle
            title={
              "Tadbirkorlik subyekti faoliyatida aniqlangan va masʼullarga yuborilgan holatlar yo‘nalishlar kesimida"
            }
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
              href={`${axiosT.defaults.baseURL}/reports/case-status-by-category/?year=${year}&export=excel`}
            >
              Excel yuklab olish
            </Button>
          </Space>
        </div>
      </div>

      <div className={"grid grid-cols-12 gap-4 mb-5"}>
        <div className="col-span-6">
          {/* <Search
            placeholder="Tashkilot nomi"
            onChange={(value) => onSearchChange(value)}
            className="max-w-[300px]"
          /> */}
        </div>
        <div className="col-span-6 flex justify-end">
          <Space>
            <Select
              allowClear
              onChange={(organization) => onOrganizationChange(organization)}
              placeholder="Tashkilot"
              options={organizationsSelect}
              loading={isLoadingOrganizations}
              className={"w-[250px]"}
            />

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
      </div>

      <div ref={contentRef}>
        <Table dataSource={dataSource} columns={columns} loading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
