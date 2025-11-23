import { useState, useEffect } from 'react';
import { getProductos } from '../api/strapi';
import { useCart } from '../context/CartContext';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [precioMaximo, setPrecioMaximo] = useState(100000);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        if (data && data.data) {
          setProductos(data.data);
          
          const cats = [...new Set(data.data.map(p => p.categoria))];
          setCategorias(cats);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleAgregarAlCarrito = (producto) => {
    addToCart(producto);
    alert(`✅ ${producto.nombre} agregado al carrito`);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaSeleccionada('todas');
    setPrecioMaximo(100000);
    setPaginaActual(1);
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleCategoria = categoriaSeleccionada === 'todas' || producto.categoria === categoriaSeleccionada;
    const cumplePrecio = producto.precio <= precioMaximo;
    
    return cumpleBusqueda && cumpleCategoria && cumplePrecio;
  });

  // Calcular paginación
  const indexUltimo = paginaActual * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  // Cambiar de página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaSeleccionada, precioMaximo]);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
        <h2>Cargando productos...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ color: 'white', marginBottom: '20px' }}>
        🥩 Carnexpress - Catálogo de Productos
      </h1>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>🔍 Filtros</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Buscar:
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto..."
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                borderRadius: '4px',
                border: '2px solid #ddd',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Categoría:
            </label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                borderRadius: '4px',
                border: '2px solid #ddd'
              }}
            >
              <option value="todas">Todas</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Precio máximo: ${precioMaximo.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={precioMaximo}
              onChange={(e) => setPrecioMaximo(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div>
          <button
            onClick={limpiarFiltros}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            Limpiar Filtros
          </button>
          <span style={{ color: '#666' }}>
            Mostrando {productosFiltrados.length} productos
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {productosPaginados.length > 0 ? (
          productosPaginados.map((producto) => (
            <div
              key={producto.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '100%',
                height: '220px',
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
                  <span style={{ fontSize: '64px' }}>🥩</span>
                )}
              </div>

              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>
                  {producto.nombre}
                </h3>
                
                <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>
                  📦 {producto.categoria}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px'
                }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#28a745'
                  }}>
                    ${producto.precio.toLocaleString()}
                  </span>

                  <button
                    onClick={() => handleAgregarAlCarrito(producto)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    🛒 Agregar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <h3>😕 No se encontraron productos</h3>
            <p style={{ color: '#666' }}>Intenta ajustar los filtros</p>
            <button
              onClick={limpiarFiltros}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
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
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '30px'
        }}>
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            style={{
              padding: '10px 20px',
              backgroundColor: paginaActual === 1 ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Anterior
          </button>

          <span style={{ color: 'white', fontWeight: 'bold' }}>
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            style={{
              padding: '10px 20px',
              backgroundColor: paginaActual === totalPaginas ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

export default Catalogo;
