import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPedidos, actualizarEstadoPedido } from '../api/strapi';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState('pedidos');

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const data = await getAllPedidos(token);
      if (data && data.data) {
        console.log('📦 Pedidos cargados:', data.data);
        console.log('📦 Primer pedido completo:', data.data[0]);
        console.log('🆔 Estructura de IDs:', {
          id: data.data[0]?.id,
          documentId: data.data[0]?.documentId
        });
        setPedidos(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (pedido, nuevoEstado) => {
    try {
      console.log('📦 Pedido completo:', pedido);
      console.log('🔄 ID a actualizar:', pedido.id);
      console.log('🔄 DocumentId:', pedido.documentId);
      console.log('🔄 Nuevo estado:', nuevoEstado);
      
      // Usar documentId si existe, sino usar id
      const idParaActualizar = pedido.documentId || pedido.id;
      console.log('🎯 Usando ID:', idParaActualizar);
      
      await actualizarEstadoPedido(idParaActualizar, nuevoEstado, token);
      alert('Estado actualizado correctamente');
      cargarPedidos();
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
      alert(`Error: ${error.response?.data?.error?.message || 'No se pudo actualizar el estado'}`);
    }
  };

  const calcularEstadisticas = () => {
    const totalPedidos = pedidos.length;
    const totalIngresos = pedidos.reduce((sum, p) => sum + (p.total || 0), 0);
    const pedidosPendientes = pedidos.filter(p => p.estado === 'solicitado').length;
    
    return { totalPedidos, totalIngresos, pedidosPendientes };
  };

  const getEstadoClass = (estado) => {
    const clases = {
      solicitado: 'estado-solicitado',
      despachado: 'estado-despachado',
      entregado: 'estado-entregado',
      cancelado: 'estado-cancelado'
    };
    return `estado-badge ${clases[estado] || ''}`;
  };

  const stats = calcularEstadisticas();

  if (loading) {
    return (
      <div className="admin-container">
        <h1 className="admin-title">Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 className="admin-title">👑 Panel de Administración</h1>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/admin/informes')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            📊 Ver Gráficas e Informes
          </button>
          
          <button
            onClick={() => navigate('/admin/productos')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            📦 Gestión de Productos
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${tabActiva === 'pedidos' ? 'active' : ''}`}
          onClick={() => setTabActiva('pedidos')}
        >
          📦 Pedidos
        </button>
        <button
          className={`tab-button ${tabActiva === 'estadisticas' ? 'active' : ''}`}
          onClick={() => setTabActiva('estadisticas')}
        >
          📊 Estadísticas
        </button>
      </div>

      {/* Contenido según tab activa */}
      {tabActiva === 'pedidos' && (
        <div className="pedidos-table-container">
          {pedidos.length === 0 ? (
            <div style={{ 
              padding: '60px 20px', 
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
              <h3 style={{ color: '#666', marginBottom: '10px' }}>No hay pedidos aún</h3>
              <p style={{ color: '#999' }}>Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
            </div>
          ) : (
            <table className="pedidos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.documentId || pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>{pedido.cliente?.username || 'N/A'}</td>
                    <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                      ${pedido.total?.toLocaleString()}
                    </td>
                    <td>
                      <span className={getEstadoClass(pedido.estado)}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td>{pedido.direccion_entrega || 'N/A'}</td>
                    <td>{pedido.telefono_contacto || 'N/A'}</td>
                    <td>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={pedido.estado}
                        onChange={(e) => handleCambiarEstado(pedido, e.target.value)}
                        className="btn-cambiar-estado"
                      >
                        <option value="solicitado">Solicitado</option>
                        <option value="despachado">Despachado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tabActiva === 'estadisticas' && (
        <>
          <div className="stats-grid">
            <div className="stat-card orders">
              <h3>Total Pedidos</h3>
              <div className="stat-value">{stats.totalPedidos}</div>
            </div>
            <div className="stat-card revenue">
              <h3>Ingresos Totales</h3>
              <div className="stat-value">${stats.totalIngresos.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <h3>Pedidos Pendientes</h3>
              <div className="stat-value">{stats.pedidosPendientes}</div>
            </div>
          </div>

          <div style={{ 
            marginTop: '30px', 
            padding: '30px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '15px' }}>📊 Ver Gráficas Detalladas</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Accede a gráficas interactivas, exportación de reportes en PDF y Excel
            </p>
            <button
              onClick={() => navigate('/admin/informes')}
              style={{
                padding: '15px 40px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Ir a Informes Completos →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
