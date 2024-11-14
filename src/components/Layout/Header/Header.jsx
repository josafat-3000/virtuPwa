// src/components/HeaderComponent.js
import React from 'react';
import { Layout } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import NotificationIcon from '../NotificationIcon';  // Importar el componente NotificationIcon
import logo from '../../../assets/virtu.png';
import './Header.css';

const { Header } = Layout;

const HeaderComponent = () => {
    return (
        <Header
            style={{
                margin: '15px',
                display: 'flex',
                justifyContent: 'space-between',
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

            <div className="header-right">
                {/* Aquí colocamos el NotificationIcon que maneja las notificaciones */}
                <NotificationIcon />
            </div>
        </Header>
    );
};

export default HeaderComponent;
