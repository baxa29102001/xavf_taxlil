import {useQuery} from "react-query";
import axiosT from "@/api/axios.ts";
import {IOrganizationByRegion} from "@/Interface/IHisobot.ts";
import {Button, DatePicker, Input, Select, Space} from "antd";
import {useState} from "react";
import useDebouncedValue from "@/hooks/use-debounced-value.tsx";
import dayjs from "dayjs";
import PageTitle from "@/components/common/PageTitle";
import {PrinterOutlined} from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import {QuarterList} from "@/constants/share.tsx";

const { Search } = Input;


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

     useQuery(['organizations-scores', searchValue, year, quarter, organizationId], ()=>
            axiosT.get<{regions: IOrganizationByRegion[]}>(`/reports/organization-scores-by-region/`, {
            params: {
                year: year,
                search: searchValue,
                quarter: quarter,
                organization_id: organizationId
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

                {
                    dataSource  ?
                        <table className={'w-full'}>
                            <thead>
                                <tr>
                                    <th className={'px-3 py-2 bg-[#fafafa] border-r-[#f0f0f0]'}>
                                        Хавф даражасини баҳолаш кўрсаткичлари
                                    </th>
                                    {
                                        dataSource?.map((item, key) => {
                                            // setDataIndex(dataIndex + 1)
                                            console.log(key, 'key')
                                            return (
                                                <>
                                                    <th className={'px-3 py-3 bg-[#fafafa] border-r border-r-[#f0f0f0]'}>
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
                                <>

                                {
                                    dataSource.map((region)=> {
                                        return (
                                            <>
                                                {
                                                    region.criteria_scores.map((criteriaScore) => {
                                                        return (
                                                            <tr>
                                                                <td className={'px-3 py-3 w-[300px] bg-white border-b border-[#f0f0f0]'}>
                                                                    {criteriaScore.name}
                                                                </td>
                                                                {
                                                                    dataSource.map((scoreByRegion)=> {

                                                                        return (
                                                                            <td className={'px-3 py-2 w-[300px] bg-white border-b border-[#f0f0f0] text-center'}>
                                                                                {
                                                                                    // @ts-ignore
                                                                                    scoreByRegion.criteria_scores.find((item) => item.region_id === region.region_id).score
                                                                                }
                                                                            </td>
                                                                        )
                                                                    })
                                                                }

                                                            </tr>
                                                        )
                                                    })
                                                }

                                            </>
                                        )
                                    })
                                }

                                    {/*{*/}
                                    {/*    dataSource..criteria_scores.map((score) => {*/}
                                    {/*        return (*/}
                                    {/*            <tr>*/}
                                    {/*                <td className={'px-3 py-2 w-[400px]'}>*/}
                                    {/*                    {score.name}*/}
                                    {/*                </td>*/}
                                    {/*                {*/}
                                    {/*                    dataSource.map((regionScore)=> {*/}
                                    {/*                        return (*/}
                                    {/*                            <td>*/}
                                    {/*                                {regionScore.criteria_scores[dataIndex].score}*/}
                                    {/*                            </td>*/}
                                    {/*                        )*/}
                                    {/*                    })*/}
                                    {/*                }*/}
                                    {/*            </tr>*/}
                                    {/*        )*/}
                                    {/*    })*/}
                                    {/*}*/}
                                </>

                            }
                            </tbody>

                        </table>
                    : <div>Выберете оргнизацию</div>
                }


            </div>

        </div>
    );
};

export default Index;