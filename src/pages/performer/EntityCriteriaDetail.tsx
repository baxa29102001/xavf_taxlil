import axiosT from "@/api/axios";
import { Divider, Timeline, message } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import PageTitle from "@/components/common/PageTitle";
import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";
import { FileIcon } from "@/assets/icons";

const EntityCriteriaDetail = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [actions, setActions] = useState<any>([]);

  const organizationId = searchParams.get("organizationId");

  const { id } = useParams();

  useQuery(
    ["scoreHistory"],
    () =>
      axiosT.get("/scores/score-history/", {
        params: {
          criteria_id: id,
          organization_id: organizationId,
        },
      }),
    {
      onSuccess({ data }) {
        setActions(data);
      },
    }
  );
  return (
    <div className="px-4 py-5 bg-white">
      {contextHolder}

      <PageTitle title={`${actions?.criteria?.name}`} back />

      {/* <Timeline
        items={actions?.results?.map((item: any) => {
          return {
            children: (
              <div className="flex items-center justify-between">
                <p
                  style={{
                    color: item.removed ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  Ball {item.removed ? "bartaraf etilgan" : "yig'ilgan"} :{" "}
                  <span> {item.calculated_score}</span>
                </p>
              </div>
            ),
          };
        })}
      /> */}
      {actions?.cases?.length === 0 && (
        <div className="flex items-center justify-center mt-4">
          <p className="text-lg font-semibold">
            Bu riteriya bo'yicha ma'lumot topilmadi
          </p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-6">
        {actions?.cases?.map((criteria: any) => {
          return (
            <div className="p-3 border border-black/30 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="">Yaratilgan sana</p>
                <p className="text-lg font-semibold">{criteria?.created_at}</p>
              </div>
              <hr className="my-2 border-black/30" />
              <div className="flex items-center justify-between">
                <p
                  style={{
                    color: criteria.removed ? "red" : "green",
                  }}
                >
                  {criteria.removed ? "Bartaraf etilgan" : "Hisoblangan"} ball
                </p>
                <p
                  style={{
                    color: criteria.removed ? "red" : "green",
                  }}
                  className="text-lg font-semibold"
                >
                  <span>
                    {" "}
                    {criteria.removed
                      ? criteria.removed_score
                      : criteria.added_score}
                  </span>
                </p>
              </div>
              <hr className="my-2 border-black/30" />
              <div className="flex items-center justify-between">
                <p className="">Yuklangan fayl</p>
                <a href={criteria?.files[0]?.file} target="_blank">
                  <div className="py-2 px-3 flex items-center gap-2 bg-[#DCE4FF] rounded-[8px] cursor-pointer ">
                    <FileIcon />
                    Fayl
                  </div>
                </a>
              </div>
              <hr className="my-2 border-black/30" />
              <div className="flex items-center justify-between">
                <p className="">Ijrochi shaxs</p>
                <p className="text-lg font-semibold">
                  {criteria?.created_by?.name || "-"}
                </p>
              </div>
              <hr className="my-2 border-black/30" />
              <div className="flex items-center justify-between">
                <p className="">Masul shaxs</p>
                <p className="text-lg font-semibold">
                  {criteria?.approved_by?.name || "-"}
                </p>
              </div>{" "}
              <hr className="my-2 border-black/30" />
              <div className="flex items-center justify-between">
                <p className="">Izoh</p>
                <p className="text-lg font-semibold">
                  {criteria?.files[0]?.description || "-"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EntityCriteriaDetail;
