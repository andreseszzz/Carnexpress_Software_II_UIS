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
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (producto) => {
    setCartItems((prevItems) => {
      // Verificar si el producto ya está en el carrito
      const existingItem = prevItems.find((item) => item.id === producto.id);

      if (existingItem) {
        // Si ya existe, aumentar la cantidad
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
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productoId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productoId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productoId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productoId ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  // Vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  // Obtener cantidad total de items
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.cantidad, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
