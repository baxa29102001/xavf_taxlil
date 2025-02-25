import React from "react";
import {LeftOutlined} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

interface Props {
    title: string;
    back: boolean
}


const Index:React.FC<Props> = ({back, title}) => {

    const navigate = useNavigate();

    return (
        <div className={'flex items-center mb-4.5'}>
            {
                back &&
                    <div
                        onClick={()=>navigate(-1)}
                        className={'text-[24px] mr-2 cursor-pointer'}
                    >
                        <LeftOutlined />
                    </div>
            }

            <h2 className="text-[#262626] text-2xl font-semibold Monserrat">
                {title}
            </h2>

        </div>
    );
};

export default Index;