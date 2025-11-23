import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEstadisticas } from '../api/strapi';
import '../styles/Informes.css';

function Informes() {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await getEstadisticas(token);
      console.log('📊 Datos recibidos:', data);
      if (data && data.pedidos && data.pedidos.data) {
        setPedidos(data.pedidos.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setLoading(false);
    }
  };

  const calcularEstadisticas = () => {
    const totalVentas = pedidos.reduce((sum, p) => sum + (p.total || 0), 0);
    const totalPedidos = pedidos.length;
    const promedioVenta = totalPedidos > 0 ? totalVentas / totalPedidos : 0;
    const pedidosEntregados = pedidos.filter(p => p.estado === 'entregado').length;

    return {
      totalVentas,
      totalPedidos,
      promedioVenta,
      pedidosEntregados
    };
  };

  const stats = calcularEstadisticas();

  if (loading) {
    return (
      <div className="informes-container">
        <h1 className="informes-title">Cargando estadísticas...</h1>
      </div>
    );
  }

  return (
    <div className="informes-container">
      <div className="informes-header">
        <h1 className="informes-title">📊 Informes y Estadísticas</h1>
        <div className="export-buttons">
          <button onClick={() => alert('Exportar PDF (en desarrollo)')} className="btn-export pdf">
            📄 Exportar PDF
          </button>
          <button onClick={() => alert('Exportar Excel (en desarrollo)')} className="btn-export excel">
            📊 Exportar Excel
          </button>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="stats-cards">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Ventas</h3>
            <p className="stat-value">${stats.totalVentas.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Pedidos</h3>
            <p className="stat-value">{stats.totalPedidos}</p>
          </div>
        </div>

        <div className="stat-card average">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Promedio Venta</h3>
            <p className="stat-value">${stats.promedioVenta.toFixed(0).toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card delivered">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Entregados</h3>
            <p className="stat-value">{stats.pedidosEntregados}</p>
          </div>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="chart-card">
        <h3 className="chart-title">Lista de Pedidos</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Cliente</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>#{pedido.id}</td>
                  <td style={{ padding: '12px' }}>{pedido.cliente?.username || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>${(pedido.total || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: pedido.estado === 'entregado' ? '#d4edda' : '#fff3cd'
                    }}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
}

export default Informes;
