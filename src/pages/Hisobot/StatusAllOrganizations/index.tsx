import { useQuery } from "react-query";
import axiosT from "@/api/axios.ts";
import { IStatusAllOrganization } from "@/Interface/IHisobot.ts";
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
    title: "Tadbirkorlik subyekti ro‘yxati",
    dataIndex: "organization_name",
    key: "organization_name",
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

  const [dataSource, setDataSource] = useState<IStatusAllOrganization[]>([]);
  const [organizationsSelect, setOrganizationsSelect] = useState<
    { label: string; value: number }[]
  >([]);
  const [ijrochiSelect, setijrochiSelect] = useState<
    { label: string; value: number }[]
  >([]);

  const [searchText, setSearchText] = useState("");
  const [quarter, setQuarter] = useState<number>();
  const [year, setYear] = useState<string>(currentYear.toString());
  const [organizationId, setOrganizationId] = useState<number>();
  const [ijrochiId, setIjrochiId] = useState<number>();

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

  // get Ijrochi
  const { isLoading: isLoadingIjrochi } = useQuery(
    ["ijrochi-select"],
    () =>
      axiosT.get<{ id: number; first_name: string; last_name: string }[]>(
        `account/ijrochi/`
      ),
    {
      onSuccess({ data }) {
        const formated = data.map((item) => {
          return {
            label: item.first_name + " " + item.last_name,
            value: item.id,
          };
        });
        setijrochiSelect(formated);
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
    [
      "case-status-all-organizations",
      searchValue,
      year,
      quarter,
      organizationId,
      ijrochiId,
    ],
    () =>
      axiosT.get<{ organizations: IStatusAllOrganization[] }>(
        `/reports/case-status-all-organizations/`,
        {
          params: {
            year: year,
            search: searchValue,
            quarter: quarter,
            organizationId: organizationId,
            ijrochi_id: ijrochiId,
          },
        }
      ),
    {
      onSuccess({ data }) {
        setDataSource(data.organizations);
      },
    }
  );

  const onOrganizationChange = (organization: number) => {
    setOrganizationId(organization);
  };

  const onIjrochiChange = (ijrochi: number) => {
    setIjrochiId(ijrochi);
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <div className={"grid grid-cols-12"}>
        <div className="col-span-6">
          <PageTitle
            title={
              "Masʼullarga yuborilgan holatlar tadbirkorlik subyektlar kesimida"
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
              href={`${axiosT.defaults.baseURL}/reports/case-status-all-organizations/?year=${year}&export=excel`}
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
          <Space>
            <Select
              allowClear
              onChange={(ijrochi) => onIjrochiChange(ijrochi)}
              placeholder="Ijrochi"
              options={ijrochiSelect}
              loading={isLoadingIjrochi}
              className={"w-[250px]"}
            />
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
