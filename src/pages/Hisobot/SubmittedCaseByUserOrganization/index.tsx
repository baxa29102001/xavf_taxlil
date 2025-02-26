import {useQuery} from "react-query";
import axiosT from "@/api/axios.ts";
import {ISubmitedCaseUserOrganization} from "@/Interface/IHisobot.ts";
import {Button, DatePicker, Input, Select, Space, Table} from "antd";
import {useState} from "react";
import useDebouncedValue from "@/hooks/use-debounced-value.tsx";
import dayjs from "dayjs";
import PageTitle from "@/components/common/PageTitle";
import {PrinterOutlined} from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import {QuarterList} from "@/constants/share.tsx";

const { Search } = Input;

const columns = [
    {
        title: 'Ҳолат келиб тушган йўналишлар номи\tУмумий келиб тушган ҳолатлар сони\tКелишилган ҳолатлар сони\tРад қиинган ҳолатлар сони \tЖараёндаги ҳолатлар сони ',
        dataIndex: 'organization_name',
        key: 'organization_name',
    },
    {
        title: 'Умумий юборилган ҳолатлар сони',
        dataIndex: 'total_cases',
        key: 'total_cases',
    },
    {
        title: 'Келишилган ҳолатлар сони',
        dataIndex: 'approved_cases',
        key: 'approved_cases',
    },
    {
        title: 'Рад қиинган ҳолатлар сони',
        dataIndex: 'rejected_cases',
        key: 'rejected_cases',
    },
    {
        title: 'Жараёндаги ҳолатлар сони',
        dataIndex: 'in_progress_cases',
        key: 'in_progress_cases',
    },
];


const Index = () => {

    const currentYear = dayjs().year();

    const [dataSource, setDataSource] = useState<ISubmitedCaseUserOrganization[]>([]);

    const [searchText, setSearchText] = useState('')
    const [quarter, setQuarter] = useState<number>()
    const [year, setYear] = useState<string>(currentYear.toString())

    const searchValue = useDebouncedValue(searchText, 1000)
    const onSearchChange = (text: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchText(text.target.value)
    }


    const onYearChange = (year: string) => {
        const formated = dayjs(year).format('YYYY')
        setYear(formated)
    }

    const {isLoading} = useQuery(['submitted-cases-by-user-organization', searchValue, year, quarter], ()=>axiosT.get<{organizations: ISubmitedCaseUserOrganization[]}>(`/reports/submitted-cases-by-user-organization/`, {
            params: {
                year: year,
                search: searchValue,
                quarter: quarter
            }
    }),
        {
            onSuccess({ data }) {
               setDataSource(data.organizations);
            }
        }
    )

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });


    return (
        <div>

            <div className={'grid grid-cols-12'}>
                <div className="col-span-6">
                    <PageTitle
                        title={'Тадбиркорлик субъекти фаолиятида аниқланган ва ижрочилардан 2025 йилнинг чорагида барча тадбиркорлик субъектлар бўйича  келиб тушган ҳолатларнинг йўналишлар кесимидаги таҳлили'}
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
                            target={'_blank'}
                            href={`${axiosT.defaults.baseURL}/reports/organizations-category-scores/?year=${year}&export=excel`}
                        >
                            Excel yuklab olish
                        </Button>
                    </Space>

                </div>
            </div>

            <div className={'grid grid-cols-12 gap-4 mb-5'}>
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
                            placeholder="Mas’ul"
                            options={QuarterList}
                            className={'w-[250px]'}
                        />

                        <Select
                            allowClear
                            onChange={(quarter) => setQuarter(quarter)}
                            placeholder="Chorak"
                            options={QuarterList}
                            className={'w-[250px]'}
                        />

                        <DatePicker
                            onChange={onYearChange}
                            picker="year"
                        />
                    </Space>

                </div>
            </div>

            <div ref={contentRef}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    loading={isLoading}
                />
            </div>

        </div>
    );
};

export default Index;
