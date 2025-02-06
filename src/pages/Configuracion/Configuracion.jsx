import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Modal, Form, Input, Select, notification, Spin, Table, Upload, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { fetchUser, fetchAllUsers, updateUser, deleteUser } from '../../store/configSlice';
import { registerUser, registerUsersBulk } from '../../store/registerSlice';
import * as XLSX from 'xlsx';

const { Dragger } = Upload;
const { Option } = Select;
const ROLES = ['Admin', 'User', 'Guard'];

const Configuracion = () => {
  const dispatch = useDispatch();
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modals, setModals] = useState({ add: false, edit: false });
  const [form] = Form.useForm();
  const [fileData, setFileData] = useState(null);
  const [validationError, setValidationError] = useState('');
  const currentUserId = useSelector((state) => state.user.user.id);
  const { user, users, loading, error } = useSelector((state) => state.config);
  const isAdmin = user?.role_id === 1;
  const { modal, notification } = App.useApp(); // Obtén desde el contexto

  // Efectos
  useEffect(() => {
    dispatch(fetchUser(currentUserId));
    if (isAdmin) dispatch(fetchAllUsers());
  }, [dispatch, currentUserId, isAdmin]);

  // Handlers
  const toggleEdit = () => setIsEditing(!isEditing);

  // Función mejorada para manejar archivos
  const handleFileUpload = (file) => {
    setValidationError('');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validación básica de estructura
        if (!jsonData[0]?.Nombre || !jsonData[0]?.Email || !jsonData[0]?.Rol) {
          setValidationError('El archivo no tiene el formato correcto');
          return;
        }

        setFileData(jsonData);
      } catch (error) {
        setValidationError('Error al leer el archivo');
      }
    };

    reader.onerror = () => {
      setValidationError('Error al cargar el archivo');
    };

    reader.readAsArrayBuffer(file);
    return false; // Previene subida automática
  };

   const handleDelete = (userToDelete) => {
    modal.confirm({ // Usa la instancia de modal del contexto
      title: 'Eliminar Usuario',
      content: `¿Estás seguro de que deseas eliminar a ${userToDelete.name}?`,
      onOk: async () => {
        try {
          const resultAction = await dispatch(deleteUser(userToDelete.id));
          
          if (deleteUser.fulfilled.match(resultAction)) {
            notification.success({ // Usa la instancia de notification del contexto
              message: 'Usuario Eliminado',
              description: resultAction.payload.message || 'El usuario ha sido eliminado con éxito.',
            });
          } else if (deleteUser.rejected.match(resultAction)) {
            notification.error({
              message: 'Error',
              description: resultAction.payload || 'No se pudo eliminar el usuario.',
            });
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: `No se pudo eliminar el usuario: ${error.message}`,
          });
        }
      },
    });
  };

  // Función de importación mejorada
  const handleImport = async () => {
    if (!fileData) {
      notification.error({ message: 'Selecciona un archivo primero' });
      return;
    }

    try {
      // Transformar datos al formato esperado por el backend
      const formattedData = fileData.map(item => ({
        name: item.Nombre,
        email: item.Email,
        role_id: ROLES.indexOf(item.Rol) + 1
      }));
      console.log(formattedData)
      await dispatch(registerUsersBulk(formattedData)).unwrap();

      notification.success({
        message: `Importación exitosa`,
        description: `${fileData.length} usuarios importados correctamente`
      });

      // Resetear estado
      setFileData(null);
      setModals({ ...modals, import: false });
      dispatch(fetchAllUsers());

    } catch (error) {
      console.log(error)
      notification.error({
        message: 'Error en importación',
        description: error.message || 'Verifica el formato del archivo'
      });
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Nombre,Email,Rol\nEjemplo Usuario,ejemplo@correo.com,User";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "plantilla-usuarios.csv";
    link.click();
  };

  // Columnas de la tabla
  const columns = useMemo(() => [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'Nombre', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
    {
      title: 'Rol',
      dataIndex: 'role_id',
      key: 'role_id',
      render: roleId => ROLES[roleId - 1]
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingUser(record);
            form.setFieldsValue(record);
            setModals(prev => ({ ...prev, edit: true }));
          }} />
          {isAdmin && <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />}
        </>
      )
    }
  ], [form, isAdmin]);

  return (
    <div style={{ padding: 24 }}>
      {/* Sección de perfil */}
      <Card
        title="Tu perfil"
        extra={!isEditing && <Button icon={<EditOutlined />} onClick={toggleEdit} />}
        style={{ marginBottom: 16 }}
      >
        {isEditing ? (
          <Form form={form} onFinish={() => {
            dispatch(updateUser({ id: user.id, data: form.getFieldsValue() }))
              .then(() => {
                notification.success({ message: 'Perfil actualizado' });
                setIsEditing(false);
                dispatch(fetchUser(currentUserId));
              });
          }}>
            <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Teléfono">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Guardar
            </Button>
            <Button onClick={toggleEdit}>Cancelar</Button>
          </Form>
        ) : (
          <div>
            <p><strong>Nombre:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Teléfono:</strong> {user?.phone || 'N/A'}</p>
          </div>
        )}
      </Card>

      {isAdmin && (
        <Card title="Gestión de usuarios">
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModals({ ...modals, add: true })}
              style={{ marginRight: 8 }}
            >
              Nuevo usuario
            </Button>

            {/* Botón para abrir modal de importación */}
            <Button
              icon={<UploadOutlined />}
              onClick={() => setModals({ ...modals, import: true })} // Nuevo estado para el modal
              style={{ marginRight: 8 }}
            >
              Importar usuarios
            </Button>

            <Button
              type="link"
              onClick={downloadTemplate}
            >
              Descargar plantilla
            </Button>
          </div>

          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            loading={loading}
            scroll={{ x: true }}
          />
        </Card>
      )}

      {/* Modales */}
      <Modal
        title="Nuevo usuario"
        open={modals.add}
        onCancel={() => setModals({ ...modals, add: false })}
        footer={null}
      >
        <Form
          onFinish={(values) => {
            dispatch(registerUser(values))
              .then(() => {
                notification.success({ message: 'Usuario registrado' });
                setModals({ ...modals, add: false });
                dispatch(fetchAllUsers());
              });
          }}
        >
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          
          <Button type="primary" htmlType="submit">Registrar</Button>
        </Form>
      </Modal>

      <Modal
        title="Editar usuario"
        open={modals.edit}
        onCancel={() => setModals({ ...modals, edit: false })}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(values) => {
            dispatch(updateUser({ id: editingUser.id, data: values }))
              .then(() => {
                notification.success({ message: 'Usuario actualizado' });
                setModals({ ...modals, edit: false });
                dispatch(fetchAllUsers());
              });
          }}
        >
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role_id" label="Rol" rules={[{ required: true }]}>
            <Select>
              {ROLES.map((role, index) => (
                <Option key={index} value={index + 1}>{role}</Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">Guardar cambios</Button>
        </Form>
      </Modal>
      {/* Modal de Importación */}
      <Modal
        title="Importar usuarios desde Excel/CSV"
        open={modals.import}
        onCancel={() => {
          setModals({ ...modals, import: false });
          setFileData(null);
          setValidationError('');
        }}
        onOk={handleImport}
        confirmLoading={loading}
        okText="Importar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: !fileData || !!validationError }}
      >
        <Dragger
          accept=".xlsx, .xls, .csv"
          beforeUpload={handleFileUpload}
          showUploadList={false}
          disabled={loading}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            {fileData ? `Archivo listo: ${fileData.length} registros` : "Arrastra el archivo aquí"}
          </p>
          <p className="ant-upload-hint">
            {validationError || "Formatos soportados: .xlsx, .xls, .csv"}
          </p>
        </Dragger>

        {fileData && (
          <div style={{ marginTop: 16 }}>
            <Table
              size="small"
              dataSource={fileData.slice(0, 5)}
              pagination={false}
              rowKey={(record) => record.Email}
              columns={[
                { title: 'Nombre', dataIndex: 'Nombre' },
                { title: 'Email', dataIndex: 'Email' },
                { title: 'Rol', dataIndex: 'Rol' }
              ]}
            />
            {fileData.length > 5 && (
              <p style={{ marginTop: 8 }}>+ {fileData.length - 5} registros adicionales...</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Configuracion;