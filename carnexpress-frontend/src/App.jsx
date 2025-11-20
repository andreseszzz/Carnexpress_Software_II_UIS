import { useState, useEffect } from 'react';
import { getProductos } from './api/strapi';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        console.log('Datos recibidos:', data); // Para ver qué estamos recibiendo
        
        // Validar que data.data existe y es un array
        if (data && data.data && Array.isArray(data.data)) {
          setProductos(data.data);
        } else {
          setError('No se encontraron productos');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar productos: ' + error.message);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: 'white' }}>Cargando productos...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (productos.length === 0) {
    return <div style={{ padding: '20px', color: 'white' }}>No hay productos disponibles</div>;
  }

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Productos de Carnexpress</h1>
      <div className="productos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {productos.map((producto) => {
          // Validar que producto.attributes existe antes de acceder a él
          if (!producto.attributes) {
            console.warn('Producto sin attributes:', producto);
            return null;
          }

          return (
            <div key={producto.id} className="producto-card" style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: 'white'
            }}>
              <h3>{producto.attributes.nombre}</h3>
              <p><strong>Precio:</strong> ${producto.attributes.precio.toLocaleString('es-CO')}</p>
              <p><strong>Categoría:</strong> {producto.attributes.categoria}</p>
              <p><strong>Stock:</strong> {producto.attributes.stock ? '✅ Disponible' : '❌ Agotado'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
