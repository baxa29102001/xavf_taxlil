import {useQuery} from "react-query";
import axiosT from "@/api/axios.ts";
import {IOrganizationByRegion, IOrganizationScore} from "@/Interface/IHisobot.ts";
import {Button, DatePicker, Input, Select, Space, Table} from "antd";
import {useEffect, useState} from "react";
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
        title: 'Xavf darajasini baholash ko‘rsatkichlari',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Tashkilot STIR',
        dataIndex: 'inn',
        key: 'inn',
    },
    {
        title: 'Umumiy ballar',
        dataIndex: 'total_score',
        key: 'total_score',
    },
    {
        title: '1-chorak',
        dataIndex: 'Q1_score',
        key: 'Q1_score',
    },
    {
        title: '2-chorak',
        dataIndex: 'Q2_score',
        key: 'Q2_score',
    },
    {
        title: '3-chorak',
        dataIndex: 'Q3_score',
        key: 'Q3_score',
    },
    {
        title: '4-chorak',
        dataIndex: 'Q4_score',
        key: 'Q4_score',
    },
];


const Index = () => {

    const currentYear = dayjs().year();

    const [dataSource, setDataSource] = useState<IOrganizationByRegion[]>();
    const [organizationsSelect, setOrganizationsSelect] = useState<{label: string, value: number}[]>([]);

    const [searchText, setSearchText] = useState('')
    const [year, setYear] = useState<string>(currentYear.toString())
    const [quarter, setQuarter] = useState<number>()
    const [organizationId, setOrganizationId] = useState<number>()

    // get Organizations
    const {isLoading: isLoadingOrganizations} = useQuery(['organizations-select'], ()=>axiosT.get<{id: number, name: string}[]>(`organizations/select/`),
        {
            onSuccess({ data }) {
                const formated = data.map((item)=>{
                    return {
                        label: item.name,
                        value: item.id
                    }
                })
                setOrganizationsSelect(formated)
            }
        }
    )

    const searchValue = useDebouncedValue(searchText, 1000)
    const onSearchChange = (text: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchText(text.target.value)
    }


    const onYearChange = (year: string) => {
        const formated = dayjs(year).format('YYYY')
        setYear(formated)
    }

    const onOrganizationChange = (organization: number) => {
        setOrganizationId(organization)
    }

    const {isLoading} = useQuery(['organizations-scores', searchValue, year, quarter, organizationId], ()=>
            axiosT.get<{regions: IOrganizationByRegion[]}>(`/reports/organization-scores-by-region/`, {
            params: {
                year: year,
                search: searchValue,
                quarter: quarter,
                organization_id: 40
            }
        }
    ),
        {
            onSuccess({ data }) {
               setDataSource(data.regions);
            }
        }
    )

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });


    const [columns, setColumns] = useState<any[]>([]);


    useEffect(() => {
       if(!dataSource) return

        const dynamicColumns = Object.keys(dataSource[0]).map(key => {
            console.log(key)
            if(key === 'criteria_scores') {
                return (
                    {
                        title: 'Xavf darajasini baholash ko‘rsatkichlari', // Заглавие колонки
                        dataIndex: key, // Ключ данных
                        key, // Уникальный ключ
                    }
                )
            }else{
                return (
                    {
                        title: key.charAt(0).toUpperCase() + key.slice(1), // Заглавие колонки
                        dataIndex: key, // Ключ данных
                        key, // Уникальный ключ
                    }
                )
            }

        });
        setColumns(dynamicColumns);


    }, [dataSource]);

    console.log(dataSource, 'dataSource')

    return (
        <div>

            <div className={'grid grid-cols-12'}>
                <div className="col-span-6">
                    <PageTitle
                        title={'Tadbirkorlik sub’eklar faoliyatida 2025-yil davomida o‘tkazilgan xavf tahlili natijalari'}
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
                            href={`${axiosT.defaults.baseURL}/reports/organization-scores-by-region/?year=${year}&export=excel`}
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
                            onChange={(organization) => onOrganizationChange(organization)}
                            placeholder="Tashkilot"
                            options={organizationsSelect}
                            loading={isLoadingOrganizations}
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
                {/*<Table*/}
                {/*    rowKey="id"*/}
                {/*    dataSource={dataSource}*/}
                {/*    columns={columns}*/}
                {/*    loading={isLoading}*/}
                {/*/>*/}
                <table>
                    <thead>
                        <tr>
                            <th className={'px-3 py-2'}>
                                Xavf darajasini baholash ko‘rsatkichlari
                            </th>
                            <th className={'px-3 py-2'}>
                                Ташкилот СТИР
                            </th>
                            {
                                dataSource?.map((item) => {
                                    return (
                                        <>
                                            <th className={'px-3 py-2'}>
                                                {item.region}
                                            </th>
                                        </>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>

                            {
                                dataSource?.map((region, index) => {
                                    return (
                                        <>
                                            {
                                                Object.keys(region.criteria_scores).map((item) => {
                                                    return (
                                                        <tr>
                                                            <td className={'px-3 py-2'}>
                                                                {region.organization_name}
                                                            </td>
                                                            <td className={'px-3 py-2'}>
                                                                {region.organization_name}
                                                            </td>
                                                            <td className={'px-3 py-2'}>
                                                                {region.criteria_scores.id}
                                                            </td>
                                                        </tr>

                                                    )
                                                })
                                            }
                                        </>
                                    )
                                })
                            }
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default Index;