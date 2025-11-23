import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProductos } from '../api/strapi';

function Home() {
  const navigate = useNavigate();
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        if (data && data.data) {
          // Tomar solo 3 productos destacados
          setProductosDestacados(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        height: '500px',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', padding: '0 20px' }}>
          <h1 style={{
            fontSize: '48px',
            marginBottom: '20px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            🥩 Carne Premium de la Mejor Calidad
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '30px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Productos cárnicos frescos y de calidad premium entregados directamente a tu puerta
          </p>
          <button
            onClick={() => navigate('/productos')}
            style={{
              padding: '15px 40px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Ver todos los productos
          </button>
        </div>
      </section>

      {/* Productos Destacados */}
      <section style={{
        maxWidth: '1200px',
        margin: '60px auto',
        padding: '0 20px'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '36px',
          marginBottom: '40px',
          color: '#1a1a1a'
        }}>
          Productos Destacados
        </h2>

        {productosDestacados.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#666', fontSize: '18px' }}>
              No hay productos destacados disponibles en este momento.
            </p>
            <button
              onClick={() => navigate('/productos')}
              style={{
                marginTop: '20px',
                padding: '12px 30px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {productosDestacados.map((producto) => (
              <div
                key={producto.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                {/* Imagen */}
                <div style={{
                  width: '100%',
                  height: '250px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {producto.imagen?.url ? (
                    <img
                      src={`http://localhost:1337${producto.imagen.url}`}
                      alt={producto.nombre}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '80px' }}>🥩</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '20px' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#dc3545',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {producto.categoria}
                  </div>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '20px',
                    color: '#1a1a1a'
                  }}>
                    {producto.nombre}
                  </h3>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '15px'
                  }}>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#28a745'
                    }}>
                      ${producto.precio.toLocaleString()}
                    </span>
                    <button
                      onClick={() => navigate('/productos')}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
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
      <footer style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '60px 20px 30px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Columna 1 */}
          <div>
            <h3 style={{
              color: '#dc3545',
              marginBottom: '15px',
              fontSize: '18px'
            }}>
              CARNEXPRESS
            </h3>
            <p style={{
              color: '#ccc',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              Tu tienda de confianza para productos cárnicos de calidad premium.
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 style={{
              color: '#dc3545',
              marginBottom: '15px',
              fontSize: '16px'
            }}>
              Enlaces
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              color: '#ccc',
              fontSize: '14px'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/" style={{ color: '#ccc', textDecoration: 'none' }}>Inicio</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/productos" style={{ color: '#ccc', textDecoration: 'none' }}>Productos</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/ofertas" style={{ color: '#ccc', textDecoration: 'none' }}>Ofertas</a>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 style={{
              color: '#dc3545',
              marginBottom: '15px',
              fontSize: '16px'
            }}>
              Contacto
            </h4>
            <div style={{
              color: '#ccc',
              fontSize: '14px',
              lineHeight: '2'
            }}>
              <p style={{ margin: '5px 0' }}>📧 Email: info@carnexpress.com</p>
              <p style={{ margin: '5px 0' }}>📞 Teléfono: +57 300 123 4567</p>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #333',
          paddingTop: '20px',
          textAlign: 'center',
          color: '#999',
          fontSize: '14px'
        }}>
          © 2024 CARNEXPRESS. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Home;
