import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPedidos, actualizarEstadoPedido, getDetallesPedido } from '../api/strapi';

function AdminPanel() {
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [loadingDetalles, setLoadingDetalles] = useState(false);

  // Verificar que sea admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Cargar todos los pedidos
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getAllPedidos(token);
        if (data && data.data) {
          setPedidos(data.data);
          setPedidosFiltrados(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        setLoading(false);
      }
    };

    if (token) {
      fetchPedidos();
    }
  }, [token]);

  // Filtrar pedidos por estado
  useEffect(() => {
    if (filtroEstado === 'todos') {
      setPedidosFiltrados(pedidos);
    } else {
      setPedidosFiltrados(pedidos.filter(p => p.estado === filtroEstado));
    }
  }, [filtroEstado, pedidos]);

  // Cambiar estado de un pedido
  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(pedidoId, nuevoEstado, token);
      
      // Actualizar la lista de pedidos
      setPedidos(prevPedidos =>
        prevPedidos.map(p =>
          p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
        )
      );

      alert(`✅ Estado actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('❌ Error al actualizar el estado');
    }
  };

  // Ver detalles de un pedido
  const handleVerDetalles = async (pedido) => {
    setPedidoSeleccionado(pedido);
    setLoadingDetalles(true);
    
    try {
      const detalles = await getDetallesPedido(pedido.id, token);
      if (detalles && detalles.data) {
        setDetallesPedido(detalles.data);
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    } finally {
      setLoadingDetalles(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      solicitado: '#ffc107',
      despachado: '#17a2b8',
      entregado: '#28a745',
      cancelado: '#dc3545'
    };
    return colores[estado] || '#6c757d';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      solicitado: '📋 Solicitado',
      despachado: '🚚 Despachado',
      entregado: '✅ Entregado',
      cancelado: '❌ Cancelado'
    };
    return textos[estado] || estado;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
        <h2>Cargando pedidos...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ color: 'white', marginBottom: '20px' }}>
        👑 Panel de Administración - Gestión de Pedidos
      </h1>

      {/* Botones de Navegación */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/admin/informes')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          📊 Ver Informes y Estadísticas
        </button>
        
        <button
          onClick={() => navigate('/admin/productos')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          📦 Gestionar Productos
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 'bold' }}>Filtrar por estado:</span>
          <button
            onClick={() => setFiltroEstado('todos')}
            style={{
              padding: '8px 16px',
              backgroundColor: filtroEstado === 'todos' ? '#007bff' : '#e9ecef',
              color: filtroEstado === 'todos' ? 'white' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Todos ({pedidos.length})
          </button>
          {['solicitado', 'despachado', 'entregado', 'cancelado'].map(estado => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              style={{
                padding: '8px 16px',
                backgroundColor: filtroEstado === estado ? getEstadoColor(estado) : '#e9ecef',
                color: filtroEstado === estado ? 'white' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {getEstadoTexto(estado).split(' ')[0]} {estado.charAt(0).toUpperCase() + estado.slice(1)}
              ({pedidos.filter(p => p.estado === estado).length})
            </button>
          ))}
        </div>

        <p style={{ marginTop: '15px', color: '#666' }}>
          Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
        </p>
      </div>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>No hay pedidos con este filtro</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: `5px solid ${getEstadoColor(pedido.estado)}`
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '20px', alignItems: 'center' }}>
                {/* Info del Pedido */}
                <div>
                  <h3 style={{ margin: '0 0 10px 0' }}>Pedido #{pedido.id}</h3>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    📅 {new Date(pedido.createdAt).toLocaleString('es-CO')}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    👤 Cliente: {pedido.cliente?.username || 'N/A'}
                  </p>
                </div>

                {/* Estado */}
                <div>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: 'bold',
                    color: getEstadoColor(pedido.estado),
                    fontSize: '16px'
                  }}>
                    {getEstadoTexto(pedido.estado)}
                  </p>
                  <select
                    value={pedido.estado}
                    onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
                    style={{
                      marginTop: '10px',
                      padding: '5px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
                    }}
                  >
                    <option value="solicitado">Solicitado</option>
                    <option value="despachado">Despachado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                {/* Total */}
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                    Total:
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: '#28a745'
                  }}>
                    ${pedido.total?.toLocaleString('es-CO')} COP
                  </p>
                </div>

                {/* Botón Ver Detalles */}
                <button
                  onClick={() => handleVerDetalles(pedido)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Ver Detalles
                </button>
              </div>

              {/* Mostrar detalles si está seleccionado */}
              {pedidoSeleccionado?.id === pedido.id && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '2px solid #eee'
                }}>
                  <h4>Detalles del Pedido</h4>
                  
                  {/* Información de Entrega */}
                  <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>📍 Dirección:</strong> {pedido.direccion_entrega || 'N/A'}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>📞 Teléfono:</strong> {pedido.telefono_contacto || 'N/A'}
                      </p>
                    </div>
                    {pedido.notas && (
                      <div>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                          <strong>📝 Notas:</strong> {pedido.notas}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Productos del Pedido */}
                  <h5>Productos:</h5>
                  {loadingDetalles ? (
                    <p>Cargando productos...</p>
                  ) : detallesPedido.length > 0 ? (
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {detallesPedido.map((detalle) => (
                        <div key={detalle.id} style={{
                          backgroundColor: '#f8f9fa',
                          padding: '15px',
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                              {detalle.producto?.nombre || 'Producto N/A'}
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                              Cantidad: {detalle.cantidad}
                            </p>
                          </div>
                          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>
                            ${detalle.subtotal?.toLocaleString('es-CO')} COP
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No se encontraron productos para este pedido</p>
                  )}

                  <button
                    onClick={() => setPedidoSeleccionado(null)}
                    style={{
                      marginTop: '15px',
                      padding: '8px 16px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cerrar Detalles
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
