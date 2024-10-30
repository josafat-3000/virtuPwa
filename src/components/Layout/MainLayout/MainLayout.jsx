import React, { useState } from 'react';
import { Layout, ConfigProvider } from 'antd';
import Sidebar from '../SideBar/SideBar';
import HeaderComponent from '../Header/Header';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const { Content, Footer } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const isSmallerThanMd = useMediaQuery({ maxWidth: 768 });

  // Calcula el margen izquierdo basado en si el Sidebar está colapsado
  const sidebarWidth = collapsed ? 80 : 200;

  return (
    <ConfigProvider theme={{
      components: {
        Layout: {
          headerBg: "rgb(2,106,159)",
          siderBg: "rgb(2,106,159)",
          triggerBg: "rgb(40,75,124)",
        },
        Menu: {
          darkItemBg: "rgb(2,106,159)",
          darkItemSelectedBg: "rgb(40,75,124)",
        },
      },
    }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <Layout
          style={{
            marginLeft: isSmallerThanMd ? 0 : sidebarWidth, // En pantallas grandes, ajusta el margen
            transition: 'margin-left 0.2s ease',
            // paddingLeft: isSmallerThanMd ? (collapsed ? 0 : 200) : 0, // Ajusta el padding en pantallas pequeñas
          }}
        >
          <HeaderComponent />
          <Content style={{ margin: '16px', height: '90%' }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Virtu ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
