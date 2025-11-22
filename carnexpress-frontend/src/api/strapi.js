// Función para crear un pedido
export const crearPedido = async (pedidoData, token) => {
  try {
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
    throw error;
  }
};

// Función para crear detalles de pedido
export const crearDetallePedido = async (detalleData, token) => {
  try {
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
    throw error;
  }
};

// Función para obtener los pedidos de un usuario
export const getPedidosUsuario = async (userId, token) => {
  try {
    const response = await strapiAPI.get(`/pedidos?filters[usuario][id][$eq]=${userId}&populate=*`, {
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
