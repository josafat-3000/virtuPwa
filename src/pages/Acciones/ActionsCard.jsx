import React from 'react';
import { Card, Button } from 'antd';
import {
  PlusOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const ActionsCard = ({ action }) => {
  // Mapeo local de íconos
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'plus':
        return <PlusOutlined />;
      case 'check':
        return <CheckCircleOutlined />;
      case 'edit':
        return <EditOutlined />;
      case 'delete':
        return <DeleteOutlined />;
      default:
        return null;
    }
  };

  return (
    <Card
      title={action.title}
      bordered={false}
      style={{
        textAlign: 'center',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ flexGrow: 1 }}>{action.description}</p>
        <Button
          type="primary"
          onClick={action.action}
          icon={getIcon(action.icon)}
          style={{ width: '100%', marginTop: 'auto' }}
        >
          {action.title}
        </Button>
      </div>
    </Card>
  );
};

export default ActionsCard;