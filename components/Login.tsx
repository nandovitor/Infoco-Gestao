import React, { useState } from 'react';
import { Icons } from '../lib/icons';

interface LoginProps {
  onLogin: (email: string, pass: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!onLogin(email, password)) {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon-wrapper">
            <Icons.building className="w-8 h-8"/>
          </div>
          <h1>INFOCO</h1>
          <p>Gestão Pública</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="login-error">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <Icons.email className="input-icon" />
              <input 
                type="email" 
                id="email" 
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-group">
              <Icons.lock className="input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password" 
                placeholder="Sua senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn" aria-label="Toggle password visibility">
                {showPassword ? <Icons.eyeOff className="w-5 h-5" /> : <Icons.eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="login-options">
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>
          <button type="submit" className="btn btn-primary login-btn">Entrar no Sistema</button>
        </form>
        <footer className="login-footer">
          <p>&copy; 2025 Infoco Gestão Pública. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
