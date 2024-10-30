import React, { useEffect } from "react";
import { Card, Table, Empty, Row, Col, Typography, Button } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import * as XLSX from "xlsx";
import { fetchAllVisits } from "../../store/allVisitSlice";

const { Title } = Typography;

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

    useEffect(() => {
        dispatch(fetchAllVisits());
    }, [dispatch]);

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

    return (
        <div style={{ margin: '16px' }}>
            <Button
                type="primary"
                onClick={exportToExcel}
                style={{ marginBottom: 16 }}
            >
                Exportar a Excel
            </Button>

            <Card
                style={{ marginTop: '16px', borderRadius: '10px', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)' }}
                bordered={true}
                title="Historial de visitas"
            >
                <Table
                    columns={columns}
                    dataSource={visitas}
                    loading={loadingVisits}
                    locale={{
                        emptyText: <Empty description="No hay datos disponibles" />,
                    }}
                    rowKey="id"
                    scroll={{ x: true }} // Permite el desplazamiento horizontal
                />
            </Card>
        </div>
    );
}

export default Registros;
