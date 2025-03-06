import axiosT from "@/api/axios";
import { Timeline, message } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import PageTitle from "@/components/common/PageTitle";

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
        console.log("data", data);
        setActions(data);
      },
    }
  );
  return (
    <div className="px-4 py-5 bg-white">
      {contextHolder}

      <PageTitle title={`${actions[0]?.criteria?.name}`} back />

      <Timeline
        items={
          actions.map((item: any) => {
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
                    <span
                    // style={{
                    //   color: item.removed ? "red" : "green",
                    //   fontWeight: "bold",
                    // }}
                    >
                      {" "}
                      {item.calculated_score}
                    </span>
                  </p>
                </div>
              ),
            };
          })

          //   [
          //   {
          //     children: "Create a services site 2015-09-01",
          //   },
          //   {
          //     children: "Solve initial network problems 2015-09-01",
          //   },
          //   {
          //     children: "Technical testing 2015-09-01",
          //   },
          //   {
          //     children: "Network problems being solved 2015-09-01",
          //   },
          // ]
        }
      />
    </div>
  );
};

export default EntityCriteriaDetail;
