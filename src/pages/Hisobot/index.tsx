import {useContext} from 'react';
import {HISOBOT_LIST} from "@/constants/share.tsx";
import AuthContext from "@/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import { useLocation } from 'react-router-dom'

const Index = () => {

    const {userDetails} = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const roleRoute = location.pathname.split('/')[1]


    return (
        <div className={'grid grid-cols-12 gap-4'}>
            {
                HISOBOT_LIST[userDetails.role as keyof typeof HISOBOT_LIST].map((item: {label: string, value: string},index:number) => {
                    return (
                      <div
                        className={"col-span-4"}
                        key={item.value}
                        onClick={() =>
                          navigate(`/${roleRoute}/hisobot/${item.value}`)
                        }
                      >
                        <div
                          className={
                            "bg-white p-5 rounded-[15px] h-full text-[#10384F] cursor-pointer"
                          }
                        >
                          <span className='font-semibold'>{index + 1}.</span> {item.label}
                        </div>
                      </div>
                    );
                })
            }
        </div>
    );
};

export default Index;