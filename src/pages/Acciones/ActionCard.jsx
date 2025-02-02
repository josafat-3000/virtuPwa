import React from 'react';
import { Card, Button } from 'antd';

const ActionCard = ({ title, description, onClick }) => (
  <Card
    title={title}
    bordered={false}
    style={{
      textAlign: 'center',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}
  >
    <p>{description}</p>
    <Button type="primary" onClick={onClick}>
      {title}
    </Button>
  </Card>
);

export default ActionCard;
