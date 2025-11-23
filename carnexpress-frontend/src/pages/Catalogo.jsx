import { useState, useEffect } from 'react';
import { getProductos } from '../api/strapi';
import { useCart } from '../context/CartContext';
import '../styles/Catalogo.css';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(100000);
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState('nombre');
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        if (data && data.data) {
          setProductos(data.data);
          setProductosFiltrados(data.data);
          
          const categoriasUnicas = [...new Set(data.data.map(p => p.categoria))];
          setCategorias(categoriasUnicas);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    let resultado = [...productos];

    if (busqueda.trim() !== '') {
      resultado = resultado.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (categoriaSeleccionada !== 'todas') {
      resultado = resultado.filter(p => p.categoria === categoriaSeleccionada);
    }

    resultado = resultado.filter(p => p.precio >= precioMin && p.precio <= precioMax);

    if (ordenar === 'precio-asc') {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (ordenar === 'precio-desc') {
      resultado.sort((a, b) => b.precio - a.precio);
    } else if (ordenar === 'nombre') {
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    setProductosFiltrados(resultado);
  }, [productos, categoriaSeleccionada, precioMin, precioMax, busqueda, ordenar]);

  const handleAgregarAlCarrito = (producto) => {
    addToCart(producto);
  };

  const limpiarFiltros = () => {
    setCategoriaSeleccionada('todas');
    setPrecioMin(0);
    setPrecioMax(100000);
    setBusqueda('');
    setOrdenar('nombre');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        <h2>Cargando productos...</h2>
      </div>
    );
  }

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <div className="catalogo-header-content">
          <h1 className="catalogo-title">Nuestros Productos</h1>
          <p className="catalogo-subtitle">
            Mostrando {productosFiltrados.length} de {productos.length} productos
          </p>
        </div>
      </div>

      <div className="catalogo-layout">
        <aside className="catalogo-sidebar">
          <h3 className="sidebar-title">Filtros</h3>

          <div className="filter-group">
            <label className="filter-label">Buscar</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Categoría</label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="filter-select"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Precio</label>
            
            <label className="price-range-label">
              Mínimo: ${precioMin.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={precioMin}
              onChange={(e) => setPrecioMin(Number(e.target.value))}
              className="price-slider"
            />

            <label className="price-range-label" style={{ marginTop: '10px' }}>
              Máximo: ${precioMax.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className="price-slider"
            />
          </div>

          <button onClick={limpiarFiltros} className="btn-limpiar">
            Limpiar Filtros
          </button>
        </aside>

        <main className="catalogo-main">
          <div className="sort-bar">
            <span className="results-count">
              {productosFiltrados.length} productos encontrados
            </span>
            
            <div className="sort-controls">
              <label className="sort-label">Ordenar por:</label>
              <select
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value)}
                className="sort-select"
              >
                <option value="nombre">Nombre</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">😕</div>
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
              <button onClick={limpiarFiltros} className="btn-ver-todos">
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="productos-grid">
              {productosFiltrados.map((producto) => (
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
                    
                    <div className="producto-badge">
                      {producto.categoria}
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
        </main>
      </div>
    </div>
  );
}

export default Catalogo;
