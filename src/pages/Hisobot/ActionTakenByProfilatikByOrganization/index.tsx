import { useQuery } from "react-query";
import axiosT from "@/api/axios.ts";
import {
  IActionTakenByProfilatikaByOrganization,
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
    title: "O‘tkazilgan profilaktikalar soni",
    dataIndex: "total_profilaktika",
    key: "total_profilaktika",
  },

  {
    title: "Seminar",
    dataIndex: "seminar",
    key: "seminar",
  },
  {
    title: "Ommaviy muhokamalar",
    dataIndex: "public_discussions",
    key: "public_discussions",
  },
  {
    title: "OAVda chiqishlar",
    dataIndex: "media_appearances",
    key: "media_appearances",
  },
  {
    title: "Ochiq eshiklar kuni",
    dataIndex: "open_houses",
    key: "open_houses",
  },
  {
    title: "Tarqatma materiallarni tarqati",
    dataIndex: "distributing_materials",
    key: "distributing_materials",
  },
  {
    title: "Qo‘llanma, tavsiya va boshqa xatlar yuborish",
    dataIndex: "sending_guidelines",
    key: "sending_guidelines",
  },
];

const Index = () => {
  const currentYear = dayjs().year();

  const [dataSource, setDataSource] = useState<
    IActionTakenByProfilatikaByOrganization[] & INNANDNAME[]
  >([]);

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
    ["action-taken-by-profilatika-by-organization", searchValue, year, quarter],
    () =>
      axiosT.get<IActionTakenByProfilatikaByOrganization[] & INNANDNAME[]>(
        `/reports/report-by-profilaktika/`,
        {
          params: {
            year: year,
            // search: searchValue,
            // quarter: quarter,
          },
        }
      ),
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
              "O‘tkazilgan profilaktika tadbirlari tadbirkorlik subyektlar kesimida"
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
