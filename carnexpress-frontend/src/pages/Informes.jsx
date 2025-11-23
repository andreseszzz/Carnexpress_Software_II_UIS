import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEstadisticas } from '../api/strapi';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

function Informes() {
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    totalPedidos: 0,
    pedidosPorEstado: {},
    productosVendidos: []
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const data = await getEstadisticas(token);
        
        if (data.pedidos && data.detalles) {
          const pedidos = data.pedidos.data || [];
          const detalles = data.detalles.data || [];

          const totalVentas = pedidos
            .filter(p => p.estado === 'entregado')
            .reduce((sum, p) => sum + (p.total || 0), 0);

          const pedidosPorEstado = pedidos.reduce((acc, p) => {
            acc[p.estado] = (acc[p.estado] || 0) + 1;
            return acc;
          }, {});

          const productosMap = {};
          detalles.forEach(detalle => {
            const productoNombre = detalle.producto?.nombre || 'Producto desconocido';
            const productoId = detalle.producto?.id || 'unknown';
            
            if (!productosMap[productoId]) {
              productosMap[productoId] = {
                nombre: productoNombre,
                cantidad: 0,
                total: 0
              };
            }
            
            productosMap[productoId].cantidad += detalle.cantidad || 0;
            productosMap[productoId].total += detalle.subtotal || 0;
          });

          const productosVendidos = Object.values(productosMap)
            .sort((a, b) => b.cantidad - a.cantidad);

          setEstadisticas({
            totalVentas,
            totalPedidos: pedidos.length,
            pedidosPorEstado,
            productosVendidos
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setLoading(false);
      }
    };

    if (token) {
      fetchEstadisticas();
    }
  }, [token]);

  // Exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Carnexpress - Informe de Ventas', 14, 20);
    
    // Fecha
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 14, 28);
    
    // Resumen
    doc.setFontSize(14);
    doc.text('Resumen General', 14, 40);
    doc.setFontSize(10);
    doc.text(`Total de Ventas: $${estadisticas.totalVentas.toLocaleString('es-CO')} COP`, 14, 48);
    doc.text(`Total de Pedidos: ${estadisticas.totalPedidos}`, 14, 54);
    doc.text(`Pedidos Entregados: ${estadisticas.pedidosPorEstado.entregado || 0}`, 14, 60);
    
    // Tabla de productos más vendidos
    doc.text('Productos Más Vendidos', 14, 75);
    
    const tableData = estadisticas.productosVendidos.slice(0, 10).map((producto, index) => [
      index + 1,
      producto.nombre,
      producto.cantidad,
      `$${producto.total.toLocaleString('es-CO')}`
    ]);
    
    doc.autoTable({
      head: [['#', 'Producto', 'Cantidad', 'Total']],
      body: tableData,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 69] }
    });
    
    // Guardar
    doc.save(`informe-carnexpress-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Exportar a Excel
  const exportarExcel = () => {
    // Crear hoja de resumen
    const resumen = [
      ['Carnexpress - Informe de Ventas'],
      ['Generado:', new Date().toLocaleDateString('es-CO')],
      [],
      ['Resumen General'],
      ['Total de Ventas:', `$${estadisticas.totalVentas.toLocaleString('es-CO')} COP`],
      ['Total de Pedidos:', estadisticas.totalPedidos],
      ['Pedidos Entregados:', estadisticas.pedidosPorEstado.entregado || 0],
      ['Pedidos Pendientes:', (estadisticas.pedidosPorEstado.solicitado || 0) + (estadisticas.pedidosPorEstado.despachado || 0)],
      []
    ];

    // Crear hoja de productos más vendidos
    const productosData = [
      ['Posición', 'Producto', 'Cantidad Vendida', 'Total Generado'],
      ...estadisticas.productosVendidos.map((producto, index) => [
        index + 1,
        producto.nombre,
        producto.cantidad,
        producto.total
      ])
    ];

    // Crear hoja de pedidos por estado
    const estadosData = [
      ['Estado', 'Cantidad', 'Porcentaje'],
      ...Object.entries(estadisticas.pedidosPorEstado).map(([estado, cantidad]) => [
        estado.charAt(0).toUpperCase() + estado.slice(1),
        cantidad,
        `${((cantidad / estadisticas.totalPedidos) * 100).toFixed(1)}%`
      ])
    ];

    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    const wsResumen = XLSX.utils.aoa_to_sheet(resumen);
    const wsProductos = XLSX.utils.aoa_to_sheet(productosData);
    const wsEstados = XLSX.utils.aoa_to_sheet(estadosData);
    
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos');
    XLSX.utils.book_append_sheet(wb, wsEstados, 'Estados');
    
    // Guardar
    XLSX.writeFile(wb, `informe-carnexpress-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const COLORS = {
    solicitado: '#ffc107',
    despachado: '#17a2b8',
    entregado: '#28a745',
    cancelado: '#dc3545'
  };

  const dataPedidosEstado = Object.entries(estadisticas.pedidosPorEstado).map(([estado, cantidad]) => ({
    name: estado.charAt(0).toUpperCase() + estado.slice(1),
    value: cantidad,
    cantidad: cantidad
  }));

  const dataProductosVendidos = estadisticas.productosVendidos.slice(0, 5).map(producto => ({
    nombre: producto.nombre.length > 20 ? producto.nombre.substring(0, 20) + '...' : producto.nombre,
    cantidad: producto.cantidad
  }));

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
        <h2>Cargando estadísticas...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white', margin: 0 }}>
          📊 Informes y Estadísticas
        </h1>
        
        {/* Botones de Exportación */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={exportarPDF}
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📄 Exportar PDF
          </button>
          <button
            onClick={exportarExcel}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📊 Exportar Excel
          </button>
        </div>
      </div>

      {/* Cards de Resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>💰 Total de Ventas</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            ${estadisticas.totalVentas.toLocaleString('es-CO')}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            (Pedidos entregados)
          </p>
        </div>

        <div style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📦 Total de Pedidos</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            {estadisticas.totalPedidos}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            Todos los estados
          </p>
        </div>

        <div style={{
          backgroundColor: '#17a2b8',
          color: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>✅ Pedidos Entregados</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            {estadisticas.pedidosPorEstado.entregado || 0}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            Completados exitosamente
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffc107',
          color: '#000',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>⏳ Pedidos Pendientes</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            {(estadisticas.pedidosPorEstado.solicitado || 0) + (estadisticas.pedidosPorEstado.despachado || 0)}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            En proceso
          </p>
        </div>
      </div>

      {/* Gráficas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0 }}>📋 Distribución de Pedidos por Estado</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPedidosEstado}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataPedidosEstado.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[Object.keys(estadisticas.pedidosPorEstado)[index]]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0 }}>🏆 Top 5 Productos Más Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataProductosVendidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#dc3545" name="Cantidad Vendida" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Productos Más Vendidos */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>📊 Detalle de Productos Más Vendidos</h2>
        {estadisticas.productosVendidos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Posición</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Producto</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Cantidad Vendida</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Total Generado</th>
                </tr>
              </thead>
              <tbody>
                {estadisticas.productosVendidos.slice(0, 10).map((producto, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '1px solid #dee2e6',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                  }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '18px' }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </td>
                    <td style={{ padding: '12px' }}>{producto.nombre}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                      {producto.cantidad} unidades
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                      ${producto.total.toLocaleString('es-CO')} COP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No hay productos vendidos aún
          </p>
        )}
      </div>
    </div>
  );
}

export default Informes;
