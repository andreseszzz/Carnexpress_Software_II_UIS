import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario } from '../api/strapi';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

function Register() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const data = await registrarUsuario(formData);
      setAuth(data.jwt, data.user);
      navigate('/');
    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.response?.data?.error?.message || 'Error al registrar usuario. El email o usuario ya pueden estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">🥩</div>
          <h1 className="register-title">CARNEXPRESS</h1>
          <p className="register-subtitle">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Elige un nombre de usuario"
              className="form-input"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tucorreo@ejemplo.com"
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mínimo 6 caracteres"
                className="form-input"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Repite la contraseña"
                className="form-input"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'Creando cuenta...' : '✨ Crear Cuenta'}
          </button>
        </form>

        <div className="register-footer">
          <p>¿Ya tienes cuenta?</p>
          <Link to="/login" className="btn-login-link">
            Iniciar sesión →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
