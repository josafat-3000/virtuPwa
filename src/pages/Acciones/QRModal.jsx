import React, { useRef } from 'react';
import { Modal, Button, Typography, QRCode } from 'antd';

const { Title, Text } = Typography;

const QRModal = ({ visitId, onClose, loading }) => {
  const qrRef = useRef();

  const handleShare = async () => {
    try {
      const originalCanvas = qrRef.current.querySelector('canvas');
      const canvas = document.createElement('canvas');
      const margin = 20;
      
      canvas.width = originalCanvas.width + margin * 2;
      canvas.height = originalCanvas.height + margin * 2 + 80;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalCanvas, margin, margin);
      
      ctx.fillStyle = 'black';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Instrucciones:', canvas.width / 2, originalCanvas.height + margin + 20);
      
      ctx.font = 'italic 16px Arial';
      ctx.fillText('Presentar el código QR en Acceso Visita.', canvas.width / 2, originalCanvas.height + margin + 40);

      const image = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      
      if (navigator.share) {
        await navigator.share({
          files: [new File([image], 'qr-code.png', { type: 'image/png' })],
          title: 'Código QR'
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.download = 'QRCode.png';
      a.href = url;
      a.click();
    }
  };

  return (
    <Modal
      title="Código QR de la Visita"
      open={!!visitId}
      centered
      onCancel={onClose}
      footer={[
        <Button key="share" type="primary" loading={loading} onClick={handleShare}>
          Compartir
        </Button>,
        <Button key="download" type="primary" loading={loading} onClick={handleDownload}>
          Descargar
        </Button>
      ]}
    >
      <div ref={qrRef} style={{ textAlign: 'center', padding: 20, background: 'white' }}>
        <Title level={4} style={{ marginBottom: 10 }}>Instrucciones:</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
          Presentar el código QR en Acceso Visita. Acceso con identificación oficial.
        </Text>
        <QRCode value={visitId.toString()} size={200} />
      </div>
    </Modal>
  );
};

export default QRModal;