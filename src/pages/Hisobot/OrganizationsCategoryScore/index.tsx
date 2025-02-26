import {useQuery} from "react-query";
import axiosT from "@/api/axios.ts";
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

const { Column } = Table;

interface DataType {
    id: number;
    inn: string;
    name: string;
    total_score: number;
    category_scores: {
        category_id: number;
        category_name: string;
        score: number;
    }[]
}


const Index = () => {

    const currentYear = dayjs().year();

    const [dataSource, setDataSource] = useState<DataType[]>([]);

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

    const {isLoading} = useQuery(['organizations-category-scores', searchValue, year, quarter], ()=>axiosT.get<{organizations: DataType[]}>(`/reports/organizations-category-scores/`, {
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

    console.log(dataSource, 'dataSource')

    return (
        <div>

            <div className={'grid grid-cols-12'}>
                <div className="col-span-6">
                    <PageTitle
                        title={'Tadbirkorlik subyeklar faoliyatida 2025-yil 1-chorak (year and quarter) davomida o‘tkazilgan xavf tahlili natijalari yo‘nalishlar kesimida'}
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
                {/*<Table*/}
                {/*    dataSource={dataSource}*/}
                {/*    columns={columns}*/}
                {/*    loading={isLoading}*/}
                {/*/>*/}

                <Table<DataType> dataSource={dataSource} loading={isLoading}>
                    <Column title="Tashkilot STIR" dataIndex="inn" key="inn" />
                    <Column title="Tadbirkorlik subyekti ro‘yxati" dataIndex="name" key="name" />
                    <Column title="Umumiy ballar" dataIndex="total_score" key="total_score" />
                    {
                        dataSource && dataSource.length ?
                            <>
                                {
                                    dataSource[0].category_scores.map((category)=>{
                                        return(
                                            <Column
                                                title={category.category_name}
                                                key={category.category_id}
                                                render={(scores)=> {
                                                    return(
                                                        <div>
                                                            {
                                                                scores.category_scores.map((item: {id: number, category_id: number, score: number})=> {
                                                                    if(item.category_id === category.category_id){
                                                                        return(
                                                                            <div key={item.id}>
                                                                                {item.score}
                                                                            </div>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                }}
                                            />
                                        )
                                    })
                                }
                            </>
                        : null
                    }
                </Table>
            </div>

        </div>
    );
};

export default Index;
