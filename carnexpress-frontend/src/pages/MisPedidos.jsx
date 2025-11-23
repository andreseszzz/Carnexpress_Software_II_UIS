import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPedidosUsuario as getMisPedidos, getDetallesPedido } from '../api/strapi';
import '../styles/MisPedidos.css';

function MisPedidos() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [loadingDetalles, setLoadingDetalles] = useState(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getMisPedidos(user.id, token);
        if (data && data.data) {
          setPedidos(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        setLoading(false);
      }
    };

    if (token && user) {
      fetchPedidos();
    }
  }, [token, user]);

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

  const getEstadoClass = (estado) => {
    const clases = {
      solicitado: 'estado-solicitado',
      despachado: 'estado-despachado',
      entregado: 'estado-entregado',
      cancelado: 'estado-cancelado'
    };
    return `pedido-estado ${clases[estado] || ''}`;
  };

  const getEstadoEmoji = (estado) => {
    const emojis = {
      solicitado: '📋',
      despachado: '🚚',
      entregado: '✅',
      cancelado: '❌'
    };
    return emojis[estado] || '📦';
  };

  if (loading) {
    return (
      <div className="loading-message">
        <h2>Cargando tus pedidos...</h2>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="empty-message">
        <div className="empty-icon">📦</div>
        <h2>No tienes pedidos aún</h2>
        <p style={{ marginTop: '10px', fontSize: '16px' }}>
          ¡Realiza tu primer pedido y aparecerá aquí!
        </p>
        <button onClick={() => navigate('/')} className="btn-ir-catalogo">
          Ir al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="mis-pedidos-container">
      <h1 className="mis-pedidos-title">📦 Mis Pedidos</h1>

      <div className="pedidos-list">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="pedido-card">
            <div className="pedido-header">
              <div>
                <h3 className="pedido-id">Pedido #{pedido.id}</h3>
                <p className="pedido-fecha">
                  📅 {new Date(pedido.createdAt).toLocaleString('es-CO')}
                </p>
              </div>
              <div className={getEstadoClass(pedido.estado)}>
                {getEstadoEmoji(pedido.estado)} {pedido.estado}
              </div>
            </div>

            <div className="pedido-body">
              <div className="pedido-info">
                <h4>Información de Entrega</h4>
                <p>📍 {pedido.direccion_entrega}</p>
                <p>📞 {pedido.telefono_contacto}</p>
                {pedido.notas && <p>📝 {pedido.notas}</p>}
              </div>

              <div className="pedido-total">
                <p className="total-label">Total:</p>
                <p className="total-amount">
                  ${pedido.total?.toLocaleString('es-CO')}
                </p>
                <button
                  onClick={() => handleVerDetalles(pedido)}
                  className="btn-ver-detalles"
                >
                  Ver Detalles
                </button>
              </div>
            </div>

            {pedidoSeleccionado?.id === pedido.id && (
              <div className="pedido-detalles">
                <div className="detalles-header">
                  <h4>Productos del Pedido</h4>
                  <button
                    onClick={() => setPedidoSeleccionado(null)}
                    className="btn-cerrar-detalles"
                  >
                    Cerrar
                  </button>
                </div>

                {loadingDetalles ? (
                  <p>Cargando productos...</p>
                ) : detallesPedido.length > 0 ? (
                  <div className="detalles-productos">
                    {detallesPedido.map((detalle) => (
                      <div key={detalle.id} className="detalle-item">
                        <div className="detalle-producto-info">
                          <p>{detalle.producto?.nombre || 'Producto N/A'}</p>
                          <p className="detalle-cantidad">
                            Cantidad: {detalle.cantidad}
                          </p>
                        </div>
                        <p className="detalle-precio">
                          ${detalle.subtotal?.toLocaleString('es-CO')} COP
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No se encontraron productos para este pedido</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisPedidos;
