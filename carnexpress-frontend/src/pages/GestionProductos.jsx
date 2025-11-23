import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductos, crearProducto, actualizarProducto, eliminarProducto, subirImagen } from '../api/strapi';

function GestionProductos() {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    disponible: true,
    imagen: null
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      if (data && data.data) {
        setProductos(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImagenChange = (e) => {
    setFormulario({
      ...formulario,
      imagen: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imagenId = null;

      // Subir imagen si existe
      if (formulario.imagen && typeof formulario.imagen !== 'number') {
        setSubiendoImagen(true);
        const imagenSubida = await subirImagen(formulario.imagen, token);
        imagenId = imagenSubida[0].id;
        setSubiendoImagen(false);
      } else if (editando && editando.imagen) {
        imagenId = editando.imagen.id;
      }

      const productoData = {
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        precio: parseFloat(formulario.precio),
        categoria: formulario.categoria,
        disponible: formulario.disponible,
        imagen: imagenId
      };

      if (editando) {
        await actualizarProducto(editando.id, productoData, token);
        alert('✅ Producto actualizado exitosamente');
      } else {
        await crearProducto(productoData, token);
        alert('✅ Producto creado exitosamente');
      }

      // Resetear formulario
      setFormulario({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        disponible: true,
        imagen: null
      });
      setEditando(null);
      setMostrarFormulario(false);
      cargarProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('❌ Error al guardar el producto');
    }
  };

  const handleEditar = (producto) => {
    setEditando(producto);
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      categoria: producto.categoria,
      disponible: producto.disponible,
      imagen: producto.imagen?.id || null
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await eliminarProducto(id, token);
        alert('✅ Producto eliminado exitosamente');
        cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('❌ Error al eliminar el producto');
      }
    }
  };

  const handleCancelar = () => {
    setFormulario({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      disponible: true,
      imagen: null
    });
    setEditando(null);
    setMostrarFormulario(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
        <h2>Cargando productos...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'white', margin: 0 }}>
          📦 Gestión de Productos
        </h1>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
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
          {mostrarFormulario ? '❌ Cancelar' : '➕ Nuevo Producto'}
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0 }}>
            {editando ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Categoría *
                </label>
                <select
                  name="categoria"
                  value={formulario.categoria}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="">Seleccionar...</option>
                  <option value="res">Res</option>
                  <option value="cerdo">Cerdo</option>
                  <option value="pollo">Pollo</option>
                  <option value="pescado">Pescado</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Precio (COP) *
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formulario.precio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="1"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={formulario.disponible}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: 'bold' }}>Producto disponible</span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={subiendoImagen}
                style={{
                  padding: '12px 24px',
                  backgroundColor: subiendoImagen ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: subiendoImagen ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                {subiendoImagen ? 'Subiendo imagen...' : editando ? '💾 Guardar Cambios' : '➕ Crear Producto'}
              </button>
              <button
                type="button"
                onClick={handleCancelar}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Productos */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>Productos ({productos.length})</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Imagen</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Categoría</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Precio</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>
                    {producto.imagen?.url ? (
                      <img
                        src={`http://localhost:1337${producto.imagen.url}`}
                        alt={producto.nombre}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px'
                      }}>
                        🥩
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{producto.nombre}</td>
                  <td style={{ padding: '12px' }}>{producto.categoria}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                    ${producto.precio.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: producto.disponible ? '#d4edda' : '#f8d7da',
                      color: producto.disponible ? '#155724' : '#721c24'
                    }}>
                      {producto.disponible ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEditar(producto)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ffc107',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '5px',
                        fontWeight: 'bold'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(producto.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GestionProductos;
