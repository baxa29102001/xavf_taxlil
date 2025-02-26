import {useQuery} from "react-query";
import axiosT from "@/api/axios.ts";
import {ISubmitedCase} from "@/Interface/IHisobot.ts";
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
        title: 'Holat kelib tushgan yo‘nalishlar nomi',
        dataIndex: 'category_name',
        key: 'category_name',
    },
    {
        title: 'Umumiy kelib tushgan holatlar soni',
        dataIndex: 'total_cases',
        key: 'total_cases',
    },
    {
        title: 'Kelishilgan holatlar soni',
        dataIndex: 'approved_cases',
        key: 'approved_cases',
    },
    {
        title: 'Rad qiingan holatlar soni',
        dataIndex: 'rejected_cases',
        key: 'rejected_cases',
    },
    {
        title: 'Jarayondagi holatlar soni',
        dataIndex: 'in_progress_cases',
        key: 'in_progress_cases',
    },
];


const Index = () => {

    const currentYear = dayjs().year();

    const [dataSource, setDataSource] = useState<ISubmitedCase[]>([]);

    const [searchText, setSearchText] = useState('')
    const [quarter, setQuarter] = useState<number>()
    const [year, setYear] = useState<string>(currentYear.toString())
    const [masulSelect, setMasulSelect] = useState<{label: string, value: number}[]>([]);

    const searchValue = useDebouncedValue(searchText, 1000)
    const onSearchChange = (text: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchText(text.target.value)
    }


    const [masulId, setMasulId] = useState<number>()

    const onYearChange = (year: string) => {
        const formated = dayjs(year).format('YYYY')
        setYear(formated)
    }

    // get Masul
    const {isLoading: isLoadingMasul} = useQuery(['masul-select'], ()=>axiosT.get<{id: number, name: string}[]>(`account/masul/`),
        {
            onSuccess({ data }) {
                const formated = data.map((item)=>{
                    return {
                        label: item.name,
                        value: item.id
                    }
                })
                setMasulSelect(formated)
            }
        }
    )


    const onMasulChange = (ijrochi: number) => {
        setMasulId(ijrochi)
    }

    const {isLoading} = useQuery(['submitted-cases-by-category', searchValue, year, quarter, masulId], ()=>axiosT.get<{categories: ISubmitedCase[]}>(`/reports/submitted-cases-by-category/`, {
            params: {
                year: year,
                search: searchValue,
                quarter: quarter,
                masul_id: masulId
            }
    }),
        {
            onSuccess({ data }) {
               setDataSource(data.categories);
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
                        title={'Tadbirkorlik subyekti faoliyatida aniqlangan va ijrochilardan 2025 yilning -choragida barcha tadbirkorlik subyektlar bo‘yicha kelib tushgan holatlarning yo‘nalishlar kesimidagi tahlili'}
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
                            href={`${axiosT.defaults.baseURL}/reports/submitted-cases-by-category/?year=${year}&export=excel`}
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
                            onChange={(masul) => onMasulChange(masul)}
                            placeholder="Mas’ul"
                            options={masulSelect}
                            loading={isLoadingMasul}
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
