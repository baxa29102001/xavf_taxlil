import axiosT from "@/api/axios";
import { FC, useState } from "react";
import { useQuery } from "react-query";

interface OrganizationCardProps {
  title: string;
  image: string;
  count: any;
  styleOptions?: {
    bgColor?: string;
  };

  desc: string;
}
export const OrganizationCard: FC<OrganizationCardProps> = ({
  styleOptions,
  title,
  desc,
  image,
  count,
}) => {
  return (
    <div
      className="p-5 flex items-center justify-between rounded-2xl "
      style={{
        backgroundColor: styleOptions?.bgColor || "#E8EBFF",
      }}
    >
      <div className="flex items-center gap-3">
        <img src={image || "/assets/organizations.svg"} />

        <div className="">
          <h3 className="text-[#425166]  font-semibold text-base">{title}</h3>
          <h4 className="text-[#4079ED] text-xs">{desc}</h4>
        </div>
      </div>

      <p className="font-semibold text-[#151D48] text-2xl">{count}</p>
    </div>
  );
};

export const OrganizationStatics = () => {
  const [statics, setStatics] = useState<any>({
    high_risk_count: 0,
    low_risk_count: 0,
    medium_risk_count: 0,
    total_change_percent: 0,
    total_organizations: 0,
  });
  useQuery(
    ["organizationsRiskLevel"],
    () => axiosT.get("/dashboard/summary/"),
    {
      onSuccess({ data }) {
        setStatics(data);
      },
    }
  );
  return (
    <div
      className="grid grid-cols-4 gap-4 bg-white p-3 rounded-[20px] mb-4"
      style={{
        boxShadow: "0px 4px 20px 0px rgba(238, 238, 238, 0.50)",
      }}
    >
      <OrganizationCard
        count={statics.total_organizations}
        image="/assets/organizations.svg"
        desc="+8% o’tkan chorakga nisbatan"
        title="Umumiy tashkilotlar"
      />
      <OrganizationCard
        count={statics.low_risk_count}
        image="/assets/good_organization.svg"
        desc="+8% o’tkan chorakga nisbatan"
        title="Xavfi past tashkilotlar"
        styleOptions={{
          bgColor: "#DCFCE7",
        }}
      />
      <OrganizationCard
        count={statics.medium_risk_count}
        image="/assets/middle_organization.svg"
        desc="+8% o’tkan chorakga nisbatan"
        title="Xavfi o’rta tashkilotlar"
        styleOptions={{
          bgColor: "#FFF4DE",
        }}
      />{" "}
      <OrganizationCard
        count={statics.high_risk_count}
        image="/assets/bad_organization.svg"
        desc="+8% o’tkan chorakga nisbatan"
        title="Xavfi yuqori tashkilotlar"
        styleOptions={{
          bgColor: "#FFE2E5",
        }}
      />
    </div>
  );
};
