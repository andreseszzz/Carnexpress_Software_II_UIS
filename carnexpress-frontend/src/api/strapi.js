import axios from 'axios';

// Configuración base de Axios para Strapi
const strapiAPI = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await strapiAPI.get('/productos?populate=*');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

// Función para iniciar sesión
export const loginUsuario = async (identifier, password) => {
  try {
    const response = await strapiAPI.post('/auth/local', {
      identifier,
      password,
    });
    
    const token = response.data.jwt;
    const userId = response.data.user.id;
    
    // Obtener información completa del usuario incluyendo el rol
    try {
      const userWithRole = await strapiAPI.get(`/users/${userId}?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Usuario completo con rol:', userWithRole.data);
      
      // Retornar con la información completa
      return {
        jwt: token,
        user: userWithRole.data
      };
    } catch (roleError) {
      console.warn('No se pudo obtener el rol, usando datos básicos:', roleError);
      // Si falla, retornar los datos básicos
      return response.data;
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const registrarUsuario = async (userData) => {
  try {
    // Paso 1: Registrar con solo los campos básicos que Strapi acepta
    const response = await strapiAPI.post('/auth/local/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });

    // Paso 2: Si hay campos adicionales, actualizarlos usando el endpoint /users/me
    if (userData.nombre || userData.telefono || userData.direccion) {
      const token = response.data.jwt;

      try {
        await strapiAPI.put('/users/me', {
          nombre: userData.nombre || '',
          telefono: userData.telefono || '',
          direccion: userData.direccion || '',
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Obtener los datos actualizados del usuario
        const updatedUser = await strapiAPI.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Retornar con los datos actualizados
        return {
          ...response.data,
          user: updatedUser.data
        };
      } catch (updateError) {
        console.warn('No se pudieron actualizar los campos adicionales:', updateError);
        return response.data;
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// Función para crear un pedido
export const crearPedido = async (pedidoData, token) => {
  try {
    console.log('Datos del pedido a enviar:', pedidoData);
    const response = await strapiAPI.post('/pedidos', {
      data: pedidoData
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    console.error('Detalles del error:', error.response?.data);
    console.error('Error completo:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};

// Función para crear detalles de pedido
export const crearDetallePedido = async (detalleData, token) => {
  try {
    console.log('Datos del detalle a enviar:', detalleData);
    const response = await strapiAPI.post('/detalle-pedidos', {
      data: detalleData
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear detalle de pedido:', error);
    console.error('Detalles del error:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};

// Función para obtener los pedidos de un usuario
export const getPedidosUsuario = async (userId, token) => {
  try {
    const response = await strapiAPI.get(`/pedidos?filters[cliente][id][$eq]=${userId}&populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

// Función para obtener todos los pedidos (Admin)
export const getAllPedidos = async (token) => {
  try {
    const response = await strapiAPI.get('/pedidos?populate=*&sort=createdAt:desc', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    throw error;
  }
};

// Función para actualizar el estado de un pedido (Admin)
export const actualizarEstadoPedido = async (pedidoId, nuevoEstado, token) => {
  try {
    const response = await strapiAPI.put(`/pedidos/${pedidoId}`, {
      data: {
        estado: nuevoEstado
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};

// Función para obtener detalles de un pedido específico con sus items
export const getPedidoDetalle = async (pedidoId, token) => {
  try {
    const response = await strapiAPI.get(`/pedidos/${pedidoId}?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalle del pedido:', error);
    throw error;
  }
};

// Función para obtener los items de un pedido
export const getDetallesPedido = async (pedidoId, token) => {
  try {
    const response = await strapiAPI.get(`/detalle-pedidos?filters[pedido][id][$eq]=${pedidoId}&populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error);
    throw error;
  }
};

export default strapiAPI;
