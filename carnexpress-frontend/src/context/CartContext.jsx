import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        setItems([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Agregar producto al carrito
  const addToCart = (producto) => {
    setItems((prevItems) => {
      const existeItem = prevItems.find((item) => item.id === producto.id);
      
      if (existeItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [...prevItems, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productoId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productoId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productoId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productoId ? { ...item, cantidad } : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  // Calcular total
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  // Calcular cantidad total de items
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

  const value = {
    items: items || [], // Asegurar que nunca sea undefined
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
