import { ConfigProvider } from "antd";
import { useConfigRoutes } from "./router/main";
import { layoutConfig, menuConfig } from "./customs/ant/configs";

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Golos Text",
          },
          components: {
            Layout: layoutConfig,
            Menu: menuConfig,
          },
        }}
      >
        {useConfigRoutes()}
      </ConfigProvider>
    </>
  );
}

export default App;
