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

  // Verificar que sea admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Cargar estadísticas
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

  // Colores para las gráficas
  const COLORS = {
    solicitado: '#ffc107',
    despachado: '#17a2b8',
    entregado: '#28a745',
    cancelado: '#dc3545'
  };

  // Preparar datos para gráfica de pedidos por estado
  const dataPedidosEstado = Object.entries(estadisticas.pedidosPorEstado).map(([estado, cantidad]) => ({
    name: estado.charAt(0).toUpperCase() + estado.slice(1),
    value: cantidad,
    cantidad: cantidad
  }));

  // Preparar datos para gráfica de productos más vendidos (top 5)
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
      <h1 style={{ color: 'white', marginBottom: '30px' }}>
        📊 Informes y Estadísticas
      </h1>

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
        {/* Gráfica Circular - Pedidos por Estado */}
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

        {/* Gráfica de Barras - Productos Más Vendidos */}
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
