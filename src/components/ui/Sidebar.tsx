import axiosT from "@/api/axios";
import { EliminationIcon, SolutionIcon } from "@/assets/icons";
import { ROLES } from "@/constants/enum";
import AuthContext from "@/context/authContext";
import {
  AlertOutlined,
  BarChartOutlined,
  CalculatorOutlined,
  UploadOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const routesOption = (notificationCount: number) => [
  {
    key: "",
    icon: <BarChartOutlined />,
    label: <span className="text-base font-medium">Dashboard</span>,
  },
  {
    key: "entity",
    icon: <UserSwitchOutlined />,
    label: (
      <span className="text-base font-medium">Tadbirkorlik subyektlari</span>
    ),
  },
  {
    key: "documents",
    icon: <UploadOutlined />,

    label: (
      <div className="flex items-center justify-between">
        <span className="text-base font-medium">Hujjatlar</span>
        {notificationCount !== 0 && (
          <span className="bg-red-600 rounded-full text-center text-white w-5 h-5 text-[10px] flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "prevention",
    icon: <AlertOutlined />,
    label: <span className="text-base font-medium">Profilaktika</span>,
  },
  {
    key: "examination",
    icon: <CalculatorOutlined />,
    label: <span className="text-base font-medium">Tekshirish</span>,
  },
  {
    key: "hisobot",
    icon: <CalculatorOutlined />,
    label: <span className="text-base font-medium">Hisobot</span>,
  },

  {
    key: "elimination",
    icon: <EliminationIcon />,
    label: <span className="text-base font-medium"> Bartaraf etilganlar</span>,
  },

  {
    key: "solutions",
    icon: <SolutionIcon />,
    label: <span className="text-base font-medium">Choralar</span>,
  },
];

const getRoutesForRole = (role: ROLES, notificationCount: number) => {
  switch (role) {
    case ROLES.IJROCHI:
      return routesOption(0);
    case ROLES.MASUL:
      return routesOption(notificationCount);
    case ROLES.RAHBAR:
      return [
        {
          key: "",
          icon: <BarChartOutlined />,
          label: <span className="text-base font-medium">Dashboard</span>,
        },
        {
          key: "entity",
          icon: <UserSwitchOutlined />,
          label: (
            <span className="text-base font-medium">
              Tadbirkorlik subyektlari
            </span>
          ),
        },

        {
          key: "examination",
          icon: <CalculatorOutlined />,
          label: <span className="text-base font-medium">Tekshirish</span>,
        },

        {
          key: "hisobot",
          icon: <CalculatorOutlined />,
          label: <span className="text-base font-medium">Hisobot</span>,
        },
      ];
    default:
      [];
  }
};

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: FC<SidebarProps> = React.memo(({ collapsed }) => {
  //   const [activeRoute, setActiveRoute] = useState("");
  const matchUrl = useLocation();
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);
  const [notifactionCount, setNotifcationCount] = useState(0);

  useQuery(
    ["mainLayoutCaseStatusDistribution"],
    () => axiosT.get("/dashboard/case-status-distribution/"),
    {
      onSuccess({ data }) {
        setNotifcationCount(data["Yangi"]);
      },
    }
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="h-screen px-4 "
      width={"304px"}
      style={{
        position: "sticky",
        top: "0",
      }}
    >
      <Link to={"/"}>
        <div className="flex items-center gap-2 py-10 px-2">
          <img src="/logo.svg" />
          {!collapsed && (
            <h2 className="text-white">“OʻZKOMNAZORAT” INSPEKSIYASI</h2>
          )}{" "}
        </div>
      </Link>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[matchUrl.pathname.split("/")[2] || ""]}
        items={getRoutesForRole(userDetails.role, notifactionCount)}
        onClick={(item) => {
          navigate(item.key);
        }}
        style={{}}
      />

      <p className="text-white text-center px-2 font-medium mt-[334px]">
        Axborot tizimi{" "}
        <span className="text-lg font-bold greenImportantColor">
          <a href="http://technocorp.uz/">Technocorp</a>
        </span>{" "}
        tomonidan ishlab chiqilgan
      </p>
    </Sider>
  );
});
