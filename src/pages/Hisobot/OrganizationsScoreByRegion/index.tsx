import {useQuery} from "react-query";
import axiosT from "@/api/axios.ts";
import {IOrganizationByRegion} from "@/Interface/IHisobot.ts";
import {Button, DatePicker, Input, Select, Space} from "antd";
import {useEffect, useState} from "react";
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

    const [Criteries, setCriteries] = useState<{region_id: number, name: string }[]>([])

    useEffect(() => {

        if(!dataSource) return
        const scores = dataSource.map((regionData)=> {
            return regionData.criteria_scores.map(item=> {
                return {
                    name: item.name,
                    region_id: item.region_id,
                }
            })
        })
        const unnested = scores.flat()

        const uniqueItems = unnested.filter((item, index, self) =>
            index === self.findIndex((t) => (t.name === item.name))
        );

        setCriteries(uniqueItems);

    }, [dataSource]);

    console.log(dataSource, 'data-source')
    console.log(Criteries, 'Criteries')


    return (
        <div>

            <div className={'grid grid-cols-12'}>
                <div className="col-span-6">
                    <PageTitle
                        title={'Axborotlashtirish, raqamli texnologiyalar, elektron xizmatlar va raqamli servislar, axborot xavfsizligi  faoliyatida 2025-yil 1-chorak davomida o‘tkazilgan xavf tahlilining kriterilar bo‘yicha natijalari'}
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
                            <thead className={'bg-[#fafafa]'}>
                                <tr>
                                    <th className={'px-3 py-2 bg-[#fafafa] border-r-[#f0f0f0]'}>
                                        Xavf darajasini baholash ko‘rsatkichlari
                                    </th>
                                    {
                                        dataSource?.map((item) => {
                                            return (
                                                <th
                                                    key={item.region_id}
                                                    className={'px-3 py-3 bg-[#fafafa] border-r border-r-[#f0f0f0]'}
                                                >
                                                    {item.region}
                                                </th>
                                            )
                                        })
                                    }
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    Criteries.map((criteries)=> {
                                        return(
                                            <tr key={criteries.name}>
                                                <td className={'py-3 px-3 w-[300px] bg-white border-b border-[#f0f0f0]'}>
                                                    {criteries.name}
                                                </td>
                                                {
                                                    dataSource.map((score)=> {
                                                        return(
                                                            <td key={score.region_id} className={'bg-white text-center  border-b border-[#f0f0f0]'}>
                                                                {
                                                                    score.criteria_scores.map((item)=> {
                                                                        if(item.region_id === score.region_id && criteries.name === item.name){
                                                                            return (
                                                                                <div>
                                                                                    {item.score}
                                                                                </div>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </td>
                                                        )
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
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
