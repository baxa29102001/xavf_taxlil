import { ROLES } from "@/constants/enum";
import {
  AlertOutlined,
  BarChartOutlined,
  CalculatorOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const getRoutesForRole = (role: ROLES) => {
  switch (role) {
    case ROLES.IJROCHI:
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
          key: "documents",
          icon: <UploadOutlined />,
          label: <span className="text-base font-medium">Hujjatlar</span>,
        },
        {
          key: "prevention",
          icon: <AlertOutlined />,
          label: <span className="text-base font-medium">Profilatika</span>,
        },
        {
          key: "examination",
          icon: <CalculatorOutlined />,
          label: <span className="text-base font-medium">Tekshirish</span>,
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

  const [activeRoute, setActiveRoute] = useState("performer");

  const navigate = useNavigate();
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="h-screen px-4"
        width={"234px"}
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
          items={getRoutesForRole(ROLES.IJROCHI)}
          onClick={(item: any) => {
            setActiveRoute(item.key);
            navigate(item.key);
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
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
