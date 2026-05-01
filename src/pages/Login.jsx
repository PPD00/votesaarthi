import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import './login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await signup(email, password);
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">VS</div>
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Login to access your personalized guide' : 'Join VoteSaarthi and get personalized election help'}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary full-width auth-submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)} className="btn-text">
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
