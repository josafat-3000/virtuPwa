import React, { useEffect, useState } from "react";
import { Card, Table, Empty, Typography, Button, Input, Space, DatePicker, Modal, Descriptions, Tag, Row, Col } from "antd";
import { SearchOutlined, EyeOutlined, EditOutlined, QrcodeOutlined, CloseOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { fetchAllVisits } from "../../store/allVisitSlice";
import { patchVisitById } from "../../store/singleVisitSlice";
import EditVisitForm from "../Acciones/Modify/ModifyModal";
import QRModal from "../Acciones/Create/QRModal";

const { Title } = Typography;
const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Nombre del Visitante',
        dataIndex: 'visitor_name',
        key: 'visitor_name',
    },
    {
        title: 'Empresa del Visitante',
        dataIndex: 'visitor_company',
        key: 'visitor_company',
    },
    {
        title: 'Razón de la Visita',
        dataIndex: 'visit_reason',
        key: 'visit_reason',
    },
    {
        title: 'Material de la Visita',
        dataIndex: 'visit_material',
        key: 'visit_material',
    },
    {
        title: 'Vehículo',
        dataIndex: 'vehicle',
        key: 'vehicle',
        render: (vehicle) => vehicle ? 'Sí' : 'No',
    },
    {
        title: 'Modelo del Vehículo',
        dataIndex: 'vehicle_model',
        key: 'vehicle_model',
        render: (text) => text ? text : 'No disponible',
    },
    {
        title: 'Placa del Vehículo',
        dataIndex: 'vehicle_plate',
        key: 'vehicle_plate',
        render: (text) => text ? text : 'No disponible',
    },
    {
        title: 'Fecha y Hora de la Visita',
        dataIndex: 'visit_date',
        key: 'visit_date',
        render: (text) => new Date(text).toLocaleString(),
    },
    {
        title: 'Usuario ID',
        dataIndex: 'user_id',
        key: 'user_id',
    },
    {
        title: 'Estado',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            switch (status) {
                case 'pending':
                    return <span style={{ color: 'orange' }}>Pendiente</span>;
                case 'in_progress':
                    return <span style={{ color: 'blue' }}>En Progreso</span>;
                case 'completed':
                    return <span style={{ color: 'green' }}>Completado</span>;
                default:
                    return 'Desconocido';
            }
        },
    },
    {
        title: 'Fecha de Creación',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => new Date(text).toLocaleString(),
    },
    {
        title: 'Fecha de Actualización',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text) => new Date(text).toLocaleString(),
    },
];

function Registros() {
    const dispatch = useDispatch();
    const { visitas, loadingVisits } = useSelector((state) => state.allVisits);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [openDetails, setOpenDetails] = useState(false);
    const [openModify, setOpenModify] = useState(false);
    const [openQR, setOpenQR] = useState(false);

    useEffect(() => {
        dispatch(fetchAllVisits());
    }, [dispatch]);

    // Ordenar visitas por ID descendente
    const sortedVisitas = [...visitas].sort((a, b) => b.id - a.id);

    // Función para exportar los datos a Excel
    const exportToExcel = () => {
        const exportData = visitas.map(row => ({
            ID: row.id,
            "Nombre del Visitante": row.visitor_name,
            "Empresa del Visitante": row.visitor_company,
            "Razón de la Visita": row.visit_reason,
            "Material de la Visita": row.visit_material,
            Vehículo: row.vehicle ? 'Sí' : 'No',
            "Modelo del Vehículo": row.vehicle_model || 'No disponible',
            "Placa del Vehículo": row.vehicle_plate || 'No disponible',
            "Fecha y Hora de la Visita": new Date(row.visit_date).toLocaleString(),
            "Usuario ID": row.user_id,
            Estado: row.status === 'pending' ? 'Pendiente' :
                row.status === 'in_progress' ? 'En Progreso' :
                    'Completado',
            "Fecha de Creación": new Date(row.created_at).toLocaleString(),
            "Fecha de Actualización": new Date(row.updated_at).toLocaleString(),
        }));

        // Crear hoja de Excel
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Historial de visitas");

        // Establecer ancho de columnas
        worksheet["!cols"] = [
            { wpx: 50 }, // ID
            { wpx: 150 }, // Nombre del Visitante
            { wpx: 150 }, // Empresa del Visitante
            { wpx: 150 }, // Razón de la Visita
            { wpx: 150 }, // Material de la Visita
            { wpx: 80 },  // Vehículo
            { wpx: 150 }, // Modelo del Vehículo
            { wpx: 150 }, // Placa del Vehículo
            { wpx: 180 }, // Fecha y Hora de la Visita
            { wpx: 80 },  // Usuario ID
            { wpx: 100 }, // Estado
            { wpx: 180 }, // Fecha de Creación
            { wpx: 180 }, // Fecha de Actualización
        ];

        // Exportar archivo Excel
        XLSX.writeFile(workbook, "historial_visitas.xlsx");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        Buscar
                    </Button>
                    <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                        Resetear
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : "",
    });

    // Configuración de filtro de rango de fecha
    const getColumnDateRangeProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <RangePicker
                    onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>
                        Buscar
                    </Button>
                    <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                        Resetear
                    </Button>
                </Space>
            </div>
        ),
        onFilter: (value, record) => {
            const [start, end] = value || [];
            const recordDate = new Date(record[dataIndex]);
            return start && end ? recordDate >= start && recordDate <= end : true;
        },
    });

    const handleViewDetails = () => {
        setOpenDetails(true);
    };

    const handleEdit = () => {
        setOpenModify(true);
    };

    const handleRegenerateQR = () => {
        setOpenQR(true);
    };

    const handleDeselectRow = () => {
        setSelectedVisit(null);
        setSelectedRowKeys([]);
    };

    const handleEditVisit = async (data) => {
        try {
            if (selectedVisit?.status === 'in_progress') {
                Modal.warning({ content: 'No se puede editar una visita que ya ha realizado check-in' });
                return;
            }

            if (selectedVisit?.status === 'completed') {
                Modal.warning({ content: 'No se puede editar una visita ya completada' });
                return;
            }

            await dispatch(patchVisitById({ id: selectedVisit?.id, values: data })).unwrap();
            Modal.success({ content: 'Visita actualizada correctamente' });
            setOpenModify(false);
            handleDeselectRow();
            dispatch(fetchAllVisits());
        } catch (error) {
            console.error('Error al actualizar visita:', error);
            Modal.error({ content: error.message || 'Error al actualizar la visita' });
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 35,
            fixed: 'left',
        },
        {
            title: "Visitante",
            dataIndex: "visitor_name",
            key: "visitor_name",
            width: 150,
            ellipsis: true,
            ...getColumnSearchProps("visitor_name"),
        },
        {
            title: "Empresa",
            dataIndex: "visitor_company",
            key: "visitor_company",
            width: 150,
            ellipsis: true,
            ...getColumnSearchProps("visitor_company"),
        },
        {
            title: "Razón",
            dataIndex: "visit_reason",
            key: "visit_reason",
            width: 120,
            ellipsis: true,
            ...getColumnSearchProps("visit_reason"),
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            width: 110,
            filters: [
                { text: "Pendiente", value: "pending" },
                { text: "En Progreso", value: "in_progress" },
                { text: "Completado", value: "completed" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                const config = {
                    pending: { color: 'orange', text: 'Pendiente' },
                    in_progress: { color: 'blue', text: 'En Progreso' },
                    completed: { color: 'green', text: 'Completado' },
                };
                const { color, text } = config[status] || { color: 'default', text: 'Desconocido' };
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "Fecha Visita",
            dataIndex: "visit_date",
            key: "visit_date",
            width: 160,
            render: (text) => new Date(text).toLocaleString('es-MX', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            ...getColumnDateRangeProps("visit_date"),
            responsive: ['md'],
        },
        {
            title: "Veh.",
            dataIndex: "vehicle",
            key: "vehicle",
            width: 60,
            render: (vehicle) => vehicle ? <Tag color="blue">Sí</Tag> : <Tag>No</Tag>,
            responsive: ['lg'],
        },
        {
            title: "Material",
            dataIndex: "visit_material",
            key: "visit_material",
            width: 100,
            ellipsis: true,
            ...getColumnSearchProps("visit_material"),
            responsive: ['xl'],
        },
        {
            title: "Creado",
            dataIndex: "created_at",
            key: "created_at",
            width: 140,
            render: (text) => new Date(text).toLocaleDateString('es-MX', { 
                month: 'short', 
                day: 'numeric',
                year: '2-digit'
            }),
            ...getColumnDateRangeProps("created_at"),
            responsive: ['xl'],
        },
    ];

    const rowSelection = {
        type: 'radio',
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
            setSelectedVisit(selectedRows[0]);
        },
    };

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col xs={24} sm={24} md={8} lg={6}>
                    <Button
                        type="primary"
                        onClick={exportToExcel}
                        style={{ width: '100%', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    >
                        Exportar a Excel
                    </Button>
                </Col>
                
                {selectedVisit && (
                    <>
                        <Col xs={24} sm={24} md={16} lg={18}>
                            <Space 
                                wrap 
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                size={[8, 8]}
                            >
                                <Tag color="blue">ID: {selectedVisit.id}</Tag>
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={handleViewDetails}
                                    size="small"
                                >
                                    <span className="button-text">Ver detalles</span>
                                </Button>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={handleEdit}
                                    disabled={selectedVisit.status === 'in_progress' || selectedVisit.status === 'completed'}
                                    size="small"
                                >
                                    <span className="button-text">Editar</span>
                                </Button>
                                <Button
                                    icon={<QrcodeOutlined />}
                                    onClick={handleRegenerateQR}
                                    size="small"
                                >
                                    <span className="button-text">Ver QR</span>
                                </Button>
                                <Button
                                    icon={<CloseOutlined />}
                                    danger
                                    onClick={handleDeselectRow}
                                    size="small"
                                >
                                    <span className="button-text">Deseleccionar</span>
                                </Button>
                            </Space>
                        </Col>
                    </>
                )}
            </Row>

            <Card
                style={{
                    marginTop: "16px",
                    borderRadius: "10px",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
                }}
                bordered={true}
                title="Historial de visitas"
            >
                <Table
                    columns={columns}
                    dataSource={sortedVisitas}
                    loading={loadingVisits}
                    locale={{
                        emptyText: <Empty description="No hay datos disponibles" />,
                    }}
                    rowKey="id"
                    scroll={{ x: 800 }}
                    rowSelection={rowSelection}
                    size="small"
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
                        pageSizeOptions: ['5', '10', '20', '50', '100'],
                        responsive: true,
                    }}
                    onRow={(record) => ({
                        onClick: () => {
                            if (selectedRowKeys.includes(record.id)) {
                                handleDeselectRow();
                            } else {
                                setSelectedRowKeys([record.id]);
                                setSelectedVisit(record);
                            }
                        },
                        style: {
                            cursor: 'pointer',
                            backgroundColor: selectedRowKeys.includes(record.id) ? '#e6f7ff' : 'transparent',
                        },
                    })}
                />
            </Card>

            {/* Modal de detalles */}
            <Modal
                title="Detalles de la Visita"
                open={openDetails}
                onCancel={() => setOpenDetails(false)}
                footer={[
                    <Button key="close" onClick={() => setOpenDetails(false)}>
                        Cerrar
                    </Button>
                ]}
                width="90%"
                style={{ maxWidth: 900 }}
            >
                {selectedVisit && (
                    <Descriptions 
                        bordered 
                        size="small" 
                        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                        labelStyle={{ fontWeight: 600 }}
                        contentStyle={{ minWidth: 0 }}
                    >
                        <Descriptions.Item label="ID">{selectedVisit.id}</Descriptions.Item>
                        <Descriptions.Item label="Estado">
                            <Tag color={
                                selectedVisit.status === 'pending' ? 'orange' :
                                selectedVisit.status === 'in_progress' ? 'blue' : 'green'
                            }>
                                {selectedVisit.status === 'pending' ? 'Pendiente' :
                                 selectedVisit.status === 'in_progress' ? 'En Progreso' : 'Completado'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Visitante">{selectedVisit.visitor_name}</Descriptions.Item>
                        <Descriptions.Item label="Empresa">{selectedVisit.visitor_company}</Descriptions.Item>
                        <Descriptions.Item label="Razón de Visita">{selectedVisit.visit_reason}</Descriptions.Item>
                        <Descriptions.Item label="Material">{selectedVisit.visit_material || 'No especificado'}</Descriptions.Item>
                        <Descriptions.Item label="Vehículo">
                            <Tag color={selectedVisit.vehicle ? 'blue' : 'default'}>
                                {selectedVisit.vehicle ? 'Sí' : 'No'}
                            </Tag>
                        </Descriptions.Item>
                        {selectedVisit.vehicle && (
                            <>
                                <Descriptions.Item label="Modelo">{selectedVisit.vehicle_model || 'No disponible'}</Descriptions.Item>
                                <Descriptions.Item label="Placa">{selectedVisit.vehicle_plate || 'No disponible'}</Descriptions.Item>
                            </>
                        )}
                        <Descriptions.Item label="Fecha de Visita">
                            {new Date(selectedVisit.visit_date).toLocaleString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Descriptions.Item>
                        <Descriptions.Item label="Usuario ID">{selectedVisit.user_id}</Descriptions.Item>
                        <Descriptions.Item label="Creado">
                            {new Date(selectedVisit.created_at).toLocaleString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Descriptions.Item>
                        <Descriptions.Item label="Actualizado">
                            {new Date(selectedVisit.updated_at).toLocaleString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* Modal de edición */}
            <EditVisitForm
                open={openModify}
                onOk={handleEditVisit}
                onCancel={() => {
                    setOpenModify(false);
                }}
                visit={selectedVisit}
            />

            {/* Modal de regenerar QR */}
            {openQR && selectedVisit && (
                <QRModal
                    visit={selectedVisit}
                    onClose={() => {
                        setOpenQR(false);
                        setSelectedVisit(null);
                    }}
                    loading={false}
                />
            )}
        </div>
    );
}

export default Registros;
