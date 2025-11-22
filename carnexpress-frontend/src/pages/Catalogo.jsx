import { useState, useEffect } from 'react';
import { getProductos } from '../api/strapi';
import { useCart } from '../context/CartContext';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para los filtros
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState(100000);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState(false);

  // Hook del carrito
  const { addToCart } = useCart();

  // Cargar productos al iniciar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        if (data && data.data && Array.isArray(data.data)) {
          setProductos(data.data);
          setProductosFiltrados(data.data);
        } else {
          setError('No se encontraron productos');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar productos');
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    let resultado = [...productos];

    // Filtro por categoría
    if (filtroCategoria !== 'todos') {
      resultado = resultado.filter(p => p.categoria === filtroCategoria);
    }

    // Filtro por precio
    resultado = resultado.filter(p => p.precio <= filtroPrecioMax);

    // Filtro por disponibilidad
    if (filtroDisponibilidad) {
      resultado = resultado.filter(p => p.stock === true);
    }

    setProductosFiltrados(resultado);
  }, [productos, filtroCategoria, filtroPrecioMax, filtroDisponibilidad]);

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroCategoria('todos');
    setFiltroPrecioMax(100000);
    setFiltroDisponibilidad(false);
  };

  // Función para agregar al carrito
  const handleAddToCart = (producto) => {
    addToCart(producto);
    // Mostrar notificación simple
    alert(`✅ ${producto.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
        <h2>Cargando productos...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        color: 'white', 
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        🥩 Carnexpress - Catálogo de Productos
      </h1>

      {/* Panel de Filtros */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>Filtros</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {/* Filtro por Categoría */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Tipo de Carne:
            </label>
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            >
              <option value="todos">Todos</option>
              <option value="res">Res</option>
              <option value="cerdo">Cerdo</option>
              <option value="pollo">Pollo</option>
              <option value="pescado">Pescado</option>
              <option value="embutidos">Embutidos</option>
            </select>
          </div>

          {/* Filtro por Precio */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Precio máximo: ${filtroPrecioMax.toLocaleString('es-CO')}
            </label>
            <input 
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={filtroPrecioMax}
              onChange={(e) => setFiltroPrecioMax(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Filtro por Disponibilidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox"
              id="disponibilidad"
              checked={filtroDisponibilidad}
              onChange={(e) => setFiltroDisponibilidad(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="disponibilidad" style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Solo productos disponibles
            </label>
          </div>
        </div>

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
          Limpiar Filtros
        </button>

        <p style={{ marginTop: '15px', color: '#666' }}>
          Mostrando {productosFiltrados.length} de {productos.length} productos
        </p>
      </div>

      {/* Grid de Productos */}
      {productosFiltrados.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          <h3>No se encontraron productos con estos filtros</h3>
          <p>Intenta ajustar los criterios de búsqueda</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px'
        }}>
          {productosFiltrados.map((producto) => (
            <div key={producto.id} style={{ 
              border: '1px solid #ddd', 
              padding: '20px', 
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Imagen del producto */}
              <div style={{
                width: '100%',
                height: '180px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px',
                overflow: 'hidden'
              }}>
                {producto.imagen && producto.imagen.url ? (
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
                  <div style={{ fontSize: '48px' }}>🥩</div>
                )}
              </div>

              <h3 style={{ marginTop: 0, marginBottom: '10px' }}>{producto.nombre}</h3>
              
              <p style={{ 
                fontSize: '24px', 
                color: '#28a745', 
                fontWeight: 'bold',
                margin: '10px 0'
              }}>
                ${producto.precio.toLocaleString('es-CO')} COP
              </p>
              
              <p style={{ 
                color: '#666',
                textTransform: 'capitalize',
                marginBottom: '10px'
              }}>
                📦 Categoría: {producto.categoria}
              </p>
              
              <p style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 'bold',
                color: producto.stock ? '#28a745' : '#dc3545'
              }}>
                {producto.stock ? '✅ Disponible' : '❌ Agotado'}
              </p>

              <button 
                onClick={() => handleAddToCart(producto)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: producto.stock ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: producto.stock ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  marginTop: '10px'
                }}
                disabled={!producto.stock}
              >
                {producto.stock ? 'Agregar al Carrito' : 'No Disponible'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogo;
