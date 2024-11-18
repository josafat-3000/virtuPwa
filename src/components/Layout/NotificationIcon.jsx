import React, { useEffect, useState } from 'react';
import { Badge, Dropdown, List, Typography, Divider } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, addNotification } from '../../store/notificationSlice.js';
import { io } from 'socket.io-client';

const backendUrl = '';
const socketUrl = '';
// Conectar al servidor de socket
if (import.meta.env.ENV === 'production') {
  backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  socketUrl = backendUrl.replace('https://', 'wss://');
}
else {
  backendUrl = import.meta.env.VITE_BACKEND_URL_DEV;
  socketUrl = backendUrl.replace('http://', 'ws://');
}
// Reemplaza 'https' por 'wss' en la URL, si existe.

const socket = io(socketUrl);

const NotificationIcon = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const [unreadCount, setUnreadCount] = useState(0); // Contador de notificaciones no leídas
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    // Obtener las notificaciones al cargar el componente
    dispatch(fetchNotifications());

    // Escuchar notificaciones en tiempo real
    socket.on('notification', (message) => {
      dispatch(addNotification({ message, created_at: new Date().toISOString() }));

      // Incrementar el contador si el dropdown no está visible
      if (!isDropdownVisible) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Limpiar el listener de socket al desmontar el componente
    return () => {
      socket.off('notification');
    };
  }, [dispatch]); // Eliminamos `isDropdownVisible` como dependencia

  // Función para manejar cuando el dropdown se abre o cierra
  const handleDropdownVisibleChange = (visible) => {
    if (visible) {
      setUnreadCount(0); // Resetear el contador solo cuando se abre el dropdown
    }
    setIsDropdownVisible(visible);
  };


  // Definir el contenido del menú
  const menu = (
    <List
      size="small"
      dataSource={notifications.slice().reverse()}
      renderItem={(item, index) => (
        <div key={index}>
          <List.Item
            style={{ padding: '8px 16px' }}
          >
            <List.Item.Meta
              title={<Typography.Text strong>Notificación de {item.notification_type}</Typography.Text>}
              description={
                <Typography.Text>La Visita: {item.visit_id} ha hecho {item.notification_type}</Typography.Text>
              }
            />
          </List.Item>
          {index !== notifications.length - 1 && <Divider />}
        </div>
      )}
      style={{ maxHeight: '300px', overflowY: 'auto', width: '300px' }}
    />
  );


  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{ items: [{ key: '1', label: menu }] }}
      onOpenChange={handleDropdownVisibleChange} // Manejar visibilidad
    >
      <Badge count={isDropdownVisible ? 0 : unreadCount} offset={[10, 0]}>
        <BellOutlined
          style={{
            fontSize: '24px',
            cursor: 'pointer',
          }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationIcon;
