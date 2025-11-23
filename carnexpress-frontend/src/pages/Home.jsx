import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProductos } from '../api/strapi';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        if (data && data.data) {
          setProductosDestacados(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🥩 Carne Premium de la Mejor Calidad
          </h1>
          <p className="hero-subtitle">
            Productos cárnicos frescos y de calidad premium entregados directamente a tu puerta
          </p>
          <button
            onClick={() => navigate('/productos')}
            className="hero-button"
          >
            Ver todos los productos
          </button>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="productos-destacados-section">
        <h2 className="section-title">Productos Destacados</h2>

        {productosDestacados.length === 0 ? (
          <div className="no-productos">
            <p>No hay productos destacados disponibles en este momento.</p>
            <button onClick={() => navigate('/productos')} className="btn-productos">
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="productos-grid">
            {productosDestacados.map((producto) => (
              <div key={producto.id} className="producto-card">
                <div className="producto-imagen">
                  {producto.imagen?.url ? (
                    <img
                      src={`http://localhost:1337${producto.imagen.url}`}
                      alt={producto.nombre}
                    />
                  ) : (
                    <span className="producto-emoji">🥩</span>
                  )}
                </div>

                <div className="producto-info">
                  <div className="producto-categoria">
                    {producto.categoria}
                  </div>
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <div className="producto-footer">
                    <span className="producto-precio">
                      ${producto.precio.toLocaleString()}
                    </span>
                    <button
                      onClick={() => navigate('/productos')}
                      className="btn-ver-mas"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">CARNEXPRESS</h3>
            <p className="footer-text">
              Tu tienda de confianza para productos cárnicos de calidad premium.
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-subtitle">Enlaces</h4>
            <ul className="footer-links">
              <li><a href="/">Inicio</a></li>
              <li><a href="/productos">Productos</a></li>
              <li><a href="/ofertas">Ofertas</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-subtitle">Contacto</h4>
            <div className="footer-contacto">
              <p>📧 Email: info@carnexpress.com</p>
              <p>📞 Teléfono: +57 300 123 4567</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2025 CARNEXPRESS. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Home;
