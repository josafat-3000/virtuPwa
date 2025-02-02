import React from 'react';
import { Modal, Button } from 'antd';

async function handleShare() {
    try {
      const originalCanvas = qrRef.current.querySelector("canvas");
      const margin = 20; // Ajusta el tamaño del margen
      const width = originalCanvas.width + margin * 2; // Ancho total con margen
      const height = originalCanvas.height + margin * 2; // Alto total con margen

      // Crear un nuevo canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      // Llenar el fondo del nuevo canvas
      context.fillStyle = "white"; // Color de fondo
      context.fillRect(0, 0, width, height);

      // Dibujar el canvas original en el nuevo canvas con margen
      context.drawImage(originalCanvas, margin, margin);

      // Obtener la URL de la imagen del nuevo canvas
      const qrImageURL = canvas.toDataURL("image/png");

      if (navigator.share) {
        await navigator.share({
          title: 'Código QR',
          text: 'Mira este código QR generado:',
          files: [
            new File([await (await fetch(qrImageURL)).blob()], 'qr-code.png', { type: 'image/png' })
          ],
        });
        console.log('Compartido exitosamente');
      } else {
        console.log('Web Share API no soportada en este navegador.');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  }

  function doDownload(url, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

const QRCodeModal = ({ open, visitId, setVisitId }) => (
  <Modal
    title="Código QR de la Visita"
    open={open && visitId}
    onCancel={() => setVisitId(null)}
    footer={[
      <Button key="download" onClick={doDownload}>
        Descargar QR
      </Button>,
      <Button key="share" onClick={handleShare}>
        Compartir QR
      </Button>,
    ]}
  >
    <div id="myqrcode">{/* QR Code Content */}</div>
  </Modal>
);

export default QRCodeModal;
