import { useState, useEffect } from 'react';
import { getProductos } from '../api/strapi';
import { useCart } from '../context/CartContext';
import '../styles/Catalogo.css';

function Ofertas() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        if (data && data.data) {
          const ofertas = data.data.filter(p => p.precio < 50000);
          setProductos(ofertas);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleAgregarAlCarrito = (producto) => {
    addToCart(producto);
  };

  if (loading) {
    return (
      <div className="catalogo-container">
        <div className="catalogo-header">
          <div className="catalogo-header-content">
            <h1 className="catalogo-title">Cargando ofertas...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <div className="catalogo-header-content">
          <h1 className="catalogo-title">🔥 Ofertas Especiales</h1>
          <p className="catalogo-subtitle">
            {productos.length} productos en oferta
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {productos.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">😕</div>
            <h3>No hay ofertas disponibles en este momento</h3>
            <p>Vuelve pronto para ver nuestras promociones</p>
            <button 
              onClick={() => window.location.href = '/productos'} 
              className="btn-ver-todos"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="productos-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="producto-card">
                <div className="producto-image-container">
                  {producto.imagen?.url ? (
                    <img
                      src={`http://localhost:1337${producto.imagen.url}`}
                      alt={producto.nombre}
                      className="producto-image"
                    />
                  ) : (
                    <span className="producto-emoji">🥩</span>
                  )}
                  
                  <div className="producto-badge" style={{ backgroundColor: '#dc3545' }}>
                    ¡OFERTA!
                  </div>
                </div>

                <div className="producto-info">
                  <h3 className="producto-nombre">{producto.nombre}</h3>

                  <div className="producto-footer">
                    <div className="producto-precio">
                      ${producto.precio.toLocaleString()}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAgregarAlCarrito(producto);
                      }}
                      className="btn-agregar"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ofertas;
