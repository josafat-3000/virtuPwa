import React, { useEffect, useState } from 'react';
import { Badge, Dropdown, List, Typography, Divider } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, addNotification } from '../../store/notificationSlice.js';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const sseUrl = `${backendUrl}/api/v1/notifications/stream`;

const NotificationIcon = () => {
  console.log(sseUrl)
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    // Obtener las notificaciones iniciales al cargar el componente
    dispatch(fetchNotifications());

    // Configurar el cliente SSE con reintentos
    let eventSource = new EventSource(sseUrl, { withCredentials: true });

    // Manejar la conexión SSE
    const handleSSE = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      dispatch(addNotification({ message: data.message, created_at: data.created_at }));

      // Incrementar el contador si el dropdown no está visible
      if (!isDropdownVisible) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    eventSource.onmessage = handleSSE;

    eventSource.onerror = () => {
      console.error('Error connecting to SSE');
      eventSource.close();
      setTimeout(() => {
        // Reintentar la conexión después de un tiempo
        eventSource = new EventSource(sseUrl);
      }, 5000); // Intentar reconectar después de 5 segundos
    };

    // Limpiar el EventSource al desmontar el componente
    return () => {
      eventSource.close();
    };
  }, [dispatch, isDropdownVisible]);

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
          <List.Item style={{ padding: '8px 16px' }}>
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
