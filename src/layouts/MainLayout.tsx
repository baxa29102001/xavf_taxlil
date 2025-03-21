import { logout } from "@/api/auth";
import axiosT from "@/api/axios";
import { ROLES } from "@/constants/enum";
import AuthContext from "@/context/authContext";
import {
  AlertOutlined,
  BarChartOutlined,
  CalculatorOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Space, theme } from "antd";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Link, Outlet, useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

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
        <span className="text-base font-medium">Hujjatlar </span>
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

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [notifactionCount, setNotifcationCount] = useState(0);

  const { setUserHandler, userDetails } = useContext(AuthContext);

  const [activeRoute, setActiveRoute] = useState("");

  const navigate = useNavigate();

  const logoutHandler = () => {
    logout()
      .then(() => {
        navigate("/login");
        setUserHandler(null);
        localStorage.clear();
      })
      .catch(() => {});
  };

  useQuery(
    ["mainLayoutCaseStatusDistribution", activeRoute],
    () => axiosT.get("/dashboard/case-status-distribution/"),
    {
      onSuccess({ data }) {
        setNotifcationCount(data["Yangi"]);
      },
    }
  );
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="h-screen px-4 "
        width={"234px"}
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
          defaultSelectedKeys={[activeRoute]}
          items={getRoutesForRole(userDetails.role, notifactionCount)}
          onClick={(item: any) => {
            setActiveRoute(item.key);
            navigate(item.key);
          }}
          style={{}}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 20px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <Dropdown
            menu={{
              items: [
                {
                  key: 1,
                  label: (
                    <button
                      className="bg-red-300 p-3 rounded-lg w-full"
                      onClick={() => {
                        logoutHandler();
                      }}
                    >
                      Chiqish
                    </button>
                  ),
                },
              ],
            }}
          >
            <a onClick={(e) => e.preventDefault()} className="text-black">
              <Space>
                <UserOutlined />
                {userDetails?.full_name || "Foydalanuvchi"}
              </Space>
            </a>
          </Dropdown>
        </Header>
        <Content
          style={{
            padding: "24px 16px",
            minHeight: 280,
            // background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
