import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Modal, Form, Input, Select, notification, Spin, Table } from 'antd';
import { Upload, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { fetchUser,fetchAllUsers, updateUser, deleteUser } from '../../store/configSlice';
import {registerUser} from '../../store/registerSlice';
const { Option } = Select;
const roles = ['Admin', 'User', 'Guard'];
const { Dragger } = Upload;

const Configuracion = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.user.id);
  const { user, users, loading, error } = useSelector((state) => state.config);
  const [ userEdit, setUserEdit] = useState(null);
  const [isEditVisible, setisEditVisible] = useState(false);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  // Verificar si el usuario es administrador
  
  useEffect(() => {
    dispatch(fetchUser(currentUserId));
  }, [dispatch,currentUserId]);
  
  // Cargar información de los usuarios si es administrador
  const isAdmin = user?.role_id === 1;
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, isAdmin]);
  
  // Mostrar modal para editar perfil (propio o de otro usuario)
  const showEditUserModal = (userToEdit) => {
    setUserEdit(userToEdit); // Guardar el usuario para editarlo en el formulario
    form2.setFieldsValue(userToEdit); // Establecer valores del formulario
    setisEditVisible(true);
  };

  // Guardar cambios en perfil o usuario editado
  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        // Comprobar si se está editando un usuario
        dispatch(updateUser({ id: user.id, data: values }))
          .unwrap() // Para asegurarse de que el dispatch regrese una promesa correctamente manejada
          .then(() => {
            notification.success({
              message: 'Perfil actualizado',
              description: 'El perfil ha sido actualizado correctamente.',
            });
  
            // Si es administrador, recargar lista de usuarios
            if (isAdmin) {
              dispatch(fetchAllUsers());
            }
  
            // Recargar la información del perfil del usuario actual
            return dispatch(fetchUser(currentUserId));
          })
          .then(() => {
            form.resetFields(); // Restablecer los campos del formulario con los nuevos datos
            setisEditVisible(false); // Cerrar el modal
          })
          .catch((error) => {
            notification.error({
              message: 'Error al actualizar',
              description: `No se pudo actualizar el perfil: ${error.message}`,
            });
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  
  const handleSubmit2 = () => {
    form2.validateFields()
      .then((values) => {
        // Comprobar si se está editando un usuario
        dispatch(updateUser({ id: userEdit.id, data: values }))
          .unwrap() // Para asegurarse de que el dispatch regrese una promesa correctamente manejada
          .then(() => {
            notification.success({
              message: 'Perfil actualizado',
              description: 'El perfil ha sido actualizado correctamente.',
            });
  
            // Si es administrador, recargar lista de usuarios
            if (isAdmin) {
              dispatch(fetchAllUsers());
            }
  
            // Recargar la información del perfil del usuario actual
            return dispatch(fetchUser(currentUserId));
          })
          .then(() => {
            form.resetFields(); // Restablecer los campos del formulario con los nuevos datos
            setisEditVisible(false); // Cerrar el modal
          })
          .catch((error) => {
            notification.error({
              message: 'Error al actualizar',
              description: `No se pudo actualizar el perfil: ${error.message}`,
            });
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  

  // Cancelar edición o cierre de modal
  const handleCancel = () => {
    form.resetFields();
    setisEditVisible(false);
  };

  const handleDelete = (userToDelete) => {
    Modal.confirm({
      title: 'Eliminar Usuario',
      content: `¿Estás seguro de que deseas eliminar a ${userToDelete.name}?`,
      onOk: async () => {
        try {
          // Dispatch the delete action and wait for it to complete
          const resultAction = await dispatch(deleteUser(userToDelete.id));
  
          if (deleteUser.fulfilled.match(resultAction)) {
            // Check if the result is successful
            notification.success({
              message: 'Usuario Eliminado',
              description: resultAction.payload.message || 'El usuario ha sido eliminado con éxito.',
            });
          } else if (deleteUser.rejected.match(resultAction)) {
            // Check if the result is an error
            notification.error({
              message: 'Error',
              description: resultAction.payload || 'No se pudo eliminar el usuario.',
            });
          }
        } catch (error) {
          // Handle unexpected errors
          notification.error({
            message: 'Error',
            description: `No se pudo eliminar el usuario: ${error.message}`,
          });
        }
      },
    });
  };

  const showAddModal = () => {
    setIsAddVisible(true);
  };
  const handleAddOk = (values) => {
    dispatch(registerUser(values))
    setIsAddVisible(false);
  };
  const handleAddCancel = () => {
    setIsAddVisible(false);
  };
  // Columnas de la tabla para mostrar usuarios (solo admin puede ver esto)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Rol',
      dataIndex: 'role_id',
      key: 'role_id',
      width: 100,
      render: (role) => roles[role-1],
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 100,
      render: (text, record) => (
        <div>
          <Button icon={<EditOutlined />} onClick={() => showEditUserModal(record)} style={{ marginRight: 8 }} />
          {isAdmin && (
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger />
          )}
        </div>
      ),
    },
  ];

  // const handleFile = (file) => {
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     const binaryStr = e.target.result;
  //     const workbook = XLSX.read(binaryStr, { type: "binary" });

  //     // Solo leer la primera hoja
  //     const firstSheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[firstSheetName];

  //     // Convertir los datos a formato JSON
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  //     // Aquí puedes validar y enviar los datos al backend
  //     setData(jsonData);
  //     console.log("Datos importados:", jsonData);
  //   };

  //   reader.readAsBinaryString(file);
  //   return false; // Evita que se suba automáticamente el archivo
  // };


  // const submitData = async () => {
  //   try {
  //     // Supongamos que tienes una API para registrar usuarios
  //     const response = await axios.post("/api/register-users", data);
  //     message.success("Usuarios registrados correctamente.");
  //   } catch (error) {
  //     message.error("Error al registrar los usuarios.");
  //   }
  // };

  return (
    <div style={{ padding: '24px' }}>
      {/* Card para editar la información del perfil propio */}
      <Card title="Editar tu perfil" style={{ marginBottom: '16px' }}>
      {loading && <Spin tip="Cargando..." size="large" />}
        {!loading&&<Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={user}>
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[{ required: true, message: 'Por favor ingresa tu correo electrónico' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Número de teléfono"
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar Cambios
          </Button>
        </Form>}
      </Card>

      {/* Card para gestionar usuarios (solo visible para administradores) */}
      {isAdmin && (
        <Card title="Gestión de Usuarios">
          <h2>Importar Usuarios desde Excel</h2>
      
      {/* <Dragger
        name="file"
        //beforeUpload={handleFile}
        multiple={false}
        accept=".xlsx, .xls"
        showUploadList={false}
        style={{ marginBottom: 16 }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Haz clic o arrastra un archivo Excel para importarlo</p>
      </Dragger> */}

        <div style={{ textAlign: 'left', backgroundColor: '#fff', padding: '20px 0', borderRadius: '8px' }}>
          <Button icon={<PlusOutlined />} onClick={showAddModal} type="primary" style={{margin: '10px' }}>
            Registrar usuario
          </Button>
          <Modal title="Basic Modal" open={isAddVisible} footer={null} onOk={handleAddOk} onCancel={handleAddCancel}>
            <Form
          name="register"
          onFinish={handleAddOk}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingresa tu nombre!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo electrónico!' },
              { type: 'email', message: 'El correo electrónico no es válido!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Registrar
            </Button>
          </Form.Item>
        </Form>
          </Modal>
          <Button style={{margin: '10px'}} icon={<UploadOutlined />} type="default">
            Importar usuarios
          </Button>
        </div>
          {loading && <Spin tip="Cargando..." size="large" />}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          
          {/* Tabla para mostrar los usuarios solo si es Admin */}
          <Table dataSource={users} scroll={{ x: true }} columns={columns} rowKey="id" pagination={false} />
        </Card>
      )}

      {/* Modal para editar el perfil del usuario */}
      <Modal title={'Editar Usuario' } open={isEditVisible} onOk={handleSubmit2} onCancel={handleCancel}>
        <Form form={form2} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[{ required: true, message: 'Por favor ingresa el correo electrónico' }]}
          >
            <Input />
          </Form.Item>
          {isAdmin && user && (
            <Form.Item
              name="role_id"
              label="Rol"
              rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
            >
              <Select>
                {roles.map((r, index) => (
                  <Option key={index} value={index+1}>
                    {r}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Configuracion;
