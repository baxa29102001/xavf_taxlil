import { logout } from "@/api/auth";
import { Sidebar } from "@/components/ui/Sidebar";
import AuthContext from "@/context/authContext";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout, Space, theme } from "antd";
import React, { useCallback, useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
const { Header, Content } = Layout;

export const MainLayout = React.memo(() => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { setUserHandler, userDetails } = useContext(AuthContext);

  const navigate = useNavigate();

  const logoutHandler = useCallback(() => {
    logout()
      .then(() => {
        navigate("/login");
        setUserHandler(null);
        localStorage.clear();
      })
      .catch(() => {});
  }, [navigate, setUserHandler]);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
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
});
