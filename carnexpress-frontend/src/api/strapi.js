import axios from 'axios';

// URL base de tu API de Strapi
const API_URL = 'http://localhost:1337/api';

// Crear una instancia de axios con configuración base
const strapiAPI = axios.create({
  baseURL: API_URL,
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

// Función para obtener un producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await strapiAPI.get(`/productos/${id}?populate=*`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const registrarUsuario = async (userData) => {
  try {
    const response = await strapiAPI.post('/auth/local/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// Función para iniciar sesión
export const loginUsuario = async (identifier, password) => {
  try {
    const response = await strapiAPI.post('/auth/local', {
      identifier, // puede ser email o username
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Función para crear un pedido (requiere autenticación)
export const crearPedido = async (pedidoData, token) => {
  try {
    const response = await strapiAPI.post('/pedidos', pedidoData, {
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

export default strapiAPI;
