import React from 'react';
import { Layout, Button, Dropdown, Space } from 'antd';
import { BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined, SmileOutlined } from '@ant-design/icons';
import logo from '../../../assets/virtu.png';
import './Header.css'
const { Header } = Layout;

const items = [
    {
        key: '1',
        label: 'Perfil',
        icon: <UserOutlined />,
      },
      {
        key: '2',
        label: 'Configuración',
        icon: <SettingOutlined />,
      },
      {
        key: '3',
        label: 'Salir',
        icon: <LogoutOutlined />,
      }
];

const HeaderComponent = () => (
    <Header
        style={{
            margin: '15px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 30px',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
        }}
    >
        <div className="header-left">
            <img src={logo} alt="Logo" className="header-logo-image" />
        </div>
        
    </Header>
);

export default HeaderComponent;
