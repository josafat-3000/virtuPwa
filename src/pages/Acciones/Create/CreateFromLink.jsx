import { useState, useRef, useEffect } from 'react';
import {
  Form,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Upload,
  Radio,
  message
} from 'antd';
import { UploadOutlined, CameraOutlined } from '@ant-design/icons';
import Webcam from 'react-webcam';
import './Register.css';
import { useParams } from "react-router-dom";
import axios from 'axios';
import GenerateCard from './GenerateCard'; // Importa el nuevo componente GenerateCard
import useTokenValidation from '../../../hooks/useTokenValidation'; // Corrige la ruta de importación

const { Title } = Typography;

const RegisterForm = () => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState({ file1: null, file2: null });
  const [inputType1, setInputType1] = useState('upload');
  const [inputType2, setInputType2] = useState('upload');
  const [captured1, setCaptured1] = useState(null);
  const [captured2, setCaptured2] = useState(null);
  const [visitId, setVisitId] = useState(null); // Guardar el id de la visita
  const [hasVehicle, setHasVehicle] = useState(false); // Controla si el visitante tiene vehículo
  const [creatingVisit, setCreatingVisit] = useState(true); // Controla si se está creando la visita
  const webcamRef1 = useRef(null);
  const webcamRef2 = useRef(null);
  const { token } = useParams();

  const { isTokenUsed, verifyToken, validateBeforeSubmit } = useTokenValidation(token); // Usa el hook para validar el token

  const handleCreateVisit = async (values) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/visits/link`, {
        ...values, token
      });
      setVisitId(response.data.data.visit.id); // Ajusta según tu backend
      setCreatingVisit(false);
    } catch (error) {
      console.error(error);
      message.error('Error al crear la visita');
    }
  };

  const capture = (ref, index) => {
    const imageSrc = ref.current.getScreenshot();
    const byteString = atob(imageSrc.split(',')[1]);
    const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], `captura_${index + 1}.png`, { type: mimeString });

    setFiles((prev) => ({ ...prev, [`file${index + 1}`]: file }));
    if (index === 0) setCaptured1(imageSrc);
    else setCaptured2(imageSrc);

    message.success(`Foto ${index + 1} capturada`);
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  const handleSubmit = async () => {
    try {
      validateBeforeSubmit(); // Valida el token antes de proceder

      // Verificamos que ambos archivos estén presentes
      if (!files.file1 || !files.file2) {
        return message.error("Por favor sube o captura ambas fotos.");
      }
      if (!visitId) {
        return message.error("Primero debes crear la visita.");
      }

      const formData = new FormData();
      formData.append("file1", files.file1);
      formData.append("file2", files.file2);
      formData.append("visitId", visitId); // Relaciona automáticamente

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/docs/upload/${token}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        message.success("Archivos subidos correctamente");
        form.resetFields();
        setCaptured1(null);
        setCaptured2(null);
        setFiles({ file1: null, file2: null });
        verifyToken(); // Verifica nuevamente el token después de enviar el formulario
      }
    } catch (error) {
      if (error.message === "Este token ya ha sido utilizado.") {
        message.error(error.message);
      } else {
        console.error(error);
        const msg = error.response?.data?.error || "Ocurrió un error al subir los archivos.";
        message.error(msg);
      }
    }
  };

  return (
    <>
      {creatingVisit ? (
        <GenerateCard onOk={handleCreateVisit} hasVehicle={hasVehicle} setHasVehicle={setHasVehicle} />
      ) : (
        <Row justify="center" className="register-container">
          <Col xs={22} sm={18} md={12}>
            <Card className="register-card">
              <div className="register-logo">
                <CameraOutlined className="user-icon" />
              </div>
              <Title level={4}>Sube o toma tus fotos</Title>

              {isTokenUsed ? (
                <Title level={4} type="danger">Este token ya ha sido utilizado.</Title>
              ) : (
                <Form form={form} layout="vertical" onFinish={handleSubmit}>

                  {/* FOTO 1 */}
                  <Form.Item label="Identificación oficial">
                    <Radio.Group
                      value={inputType1}
                      onChange={(e) => {
                        setInputType1(e.target.value);
                        setCaptured1(null); // Reinicia si cambia
                      }}
                    >
                      <Radio value="upload">Subir archivo</Radio>
                      <Radio value="camera">Tomar foto (trasera)</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {inputType1 === 'upload' ? (
                    <Form.Item
                      name="file1"
                      label="Identificación oficial"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      rules={[{ required: true, message: 'Este campo es obligatorio' }]} >
                      <Upload
                        listType="picture"
                        beforeUpload={() => false}
                        accept="image/*"
                        onChange={({ fileList }) => {
                          const file = fileList?.[0]?.originFileObj;
                          if (file) {
                            setFiles((prev) => ({ ...prev, file1: file }));
                          }
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Subir archivo</Button>
                      </Upload>
                    </Form.Item>
                  ) : (
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      {captured1 ? (
                        <>
                          <img
                            src={captured1}
                            alt="Captura 1"
                            style={{ width: '90%', maxWidth: '300px', borderRadius: '10px' }}
                          />
                          <Button
                            onClick={() => setCaptured1(null)}
                            style={{ marginTop: 8 }}
                          >
                            Volver a tomar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Webcam
                            audio={false}
                            ref={webcamRef1}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: 'environment' }}
                            style={{
                              width: '90%',
                              maxWidth: '300px',
                              borderRadius: '10px',
                              objectFit: 'cover'
                            }}
                          />
                          <Button
                            onClick={() => capture(webcamRef1, 0)}
                            style={{ marginTop: 8 }}
                          >
                            Capturar tu identificación
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* FOTO 2 */}
                  <Form.Item label="Selfie para reconocimiento facial">
                    <Radio.Group
                      value={inputType2}
                      onChange={(e) => {
                        setInputType2(e.target.value);
                        setCaptured2(null); // Reinicia si cambia
                      }}
                    >
                      <Radio value="upload">Subir foto </Radio>
                      <Radio value="camera">Tomar selfie (frontal)</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {inputType2 === 'upload' ? (
                    <Form.Item
                      name="file2"
                      label="Subir foto"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      rules={[{ required: true, message: 'Este campo es obligatorio' }]}>
                      <Upload
                        listType="picture"
                        beforeUpload={() => false}
                        accept="image/*"
                        onChange={({ fileList }) => {
                          const file = fileList?.[0]?.originFileObj;
                          if (file) {
                            setFiles((prev) => ({ ...prev, file2: file }));
                          }
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Subir archivo</Button>
                      </Upload>
                    </Form.Item>
                  ) : (
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      {captured2 ? (
                        <>
                          <img
                            src={captured2}
                            alt="Captura 2"
                            style={{ width: '90%', maxWidth: '300px', borderRadius: '10px' }}
                          />
                          <Button
                            onClick={() => setCaptured2(null)}
                            style={{ marginTop: 8 }}
                          >
                            Volver a tomar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Webcam
                            audio={false}
                            ref={webcamRef2}
                            screenshotFormat="image/png"
                            videoConstraints={{ facingMode: 'user' }}
                            style={{
                              width: '90%',
                              maxWidth: '300px',
                              borderRadius: '10px',
                              objectFit: 'cover'
                            }}
                          />
                          <Button
                            onClick={() => capture(webcamRef2, 1)}
                            style={{ marginTop: 8 }}
                          >
                            Capturar selfie
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      disabled={isTokenUsed} // Deshabilita el botón si el token ya fue usado
                    >
                      Registrar
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default RegisterForm;
