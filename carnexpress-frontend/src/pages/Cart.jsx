import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { items = [], total = 0, removeFromCart, updateQuantity } = useCart();

  const handleContinuarComprando = () => {
    navigate('/');
  };

  const handleProcederCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p style={{ marginTop: '20px', fontSize: '16px' }}>
          ¡Agrega productos desde nuestro catálogo!
        </p>
        <button onClick={handleContinuarComprando} className="btn-catalogo">
          Ir al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Mi Carrito</h1>

      <div className="cart-content">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              {item.imagen?.url ? (
                <img
                  src={`http://localhost:1337${item.imagen.url}`}
                  alt={item.nombre}
                  className="cart-item-image"
                />
              ) : (
                <div className="cart-item-placeholder">🥩</div>
              )}
              
              <div className="cart-item-details">
                <h3>{item.nombre}</h3>
                <p>${item.precio.toLocaleString('es-CO')} COP</p>
              </div>
            </div>

            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button
                  onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                  className="btn-quantity"
                >
                  -
                </button>
                
                <span className="quantity-display">{item.cantidad}</span>
                
                <button
                  onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                  className="btn-quantity increase"
                >
                  +
                </button>
              </div>

              <div className="cart-item-subtotal">
                <p>${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="btn-remove"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-info">
          <p>Total de productos: {items.reduce((sum, item) => sum + item.cantidad, 0)}</p>
          <p className="summary-total">
            TOTAL: <span className="summary-total-amount">${total.toLocaleString('es-CO')} COP</span>
          </p>
        </div>

        <div className="summary-actions">
          <button onClick={handleContinuarComprando} className="btn-continuar">
            Continuar Comprando
          </button>

          <button onClick={handleProcederCheckout} className="btn-checkout">
            Proceder al Pago →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
