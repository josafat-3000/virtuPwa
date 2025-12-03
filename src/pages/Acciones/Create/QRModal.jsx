import React, { useRef } from 'react';
import { Modal, Button, Typography, QRCode, Row, Col, Card } from 'antd';
import logo from "../../../assets/virtu.png";

const { Title, Text } = Typography;

const QRModal = ({ visit, onClose, loading }) => {
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

  // 🔹 Campos específicos a mostrar en formato transpuesto
  const selectedFields = [
    { key: 'visitor_name', label: 'Nombre' },
    { key: 'visit_date', label: 'Fecha' },
  ];

  return (
    <Modal
      open={!!visit?.id}
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


      <Row justify="center" align="middle" >
        <Col>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '60%',
              maxWidth: 300,
              height: 'auto',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </Col>
      </Row>
      <div ref={qrRef} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 20,
        background: "white",
      }}>
        {/* 🔹 Diseño transpuesto (Etiqueta - Valor) */}
        <Card style={{ width: '100%', padding: 0 }}>
          <Title level={4}>Información de la visita:</Title>
          <Row gutter={[16, 8]}>
            {selectedFields.map(({ key, label }) => (
              visit[key] && (
                <React.Fragment key={key}>
                  <Col xs={10} sm={8} md={6}>
                    <Text strong>{label}:</Text>
                  </Col>
                  <Col xs={14} sm={16} md={18}>
                    <Text>{visit[key]}</Text>
                  </Col>
                </React.Fragment>
              )
            ))}
          </Row>
        </Card>

        {visit?.id && <QRCode value={visit.id.toString()} size={250} />}
        <Title level={4} style={{ marginTop: 20 }}>Instrucciones:</Title>
        <Text style={{fontSize:17, display: 'block', marginBottom: 20 }}>
          Presentar el código QR en Acceso Visita. Acceso con identificación oficial.
        </Text>
      </div>
    </Modal>
  );
};

export default QRModal;
