import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://buildtrack-backend-0lvc.onrender.com/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🏗️</div>
          <h1 style={styles.logoText}>BuildTrack</h1>
          <p style={styles.logoSub}>Construction Material Management</p>
        </div>

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@buildco.in"
              style={styles.input}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.input}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </div>

        {/* Demo accounts */}
        <div style={styles.demo}>
          <p style={styles.demoTitle}>Demo Accounts:</p>
          {[
            { email: 'raja@buildco.in', role: 'Super Admin' },
            { email: 'ravi@buildco.in', role: 'Site Manager' },
            { email: 'priya@buildco.in', role: 'Accountant' },
          ].map(acc => (
            <div key={acc.email} style={styles.demoItem}
              onClick={() => { setEmail(acc.email); setPassword('admin123'); }}>
              <span style={styles.demoEmail}>{acc.email}</span>
              <span style={styles.demoRole}>{acc.role}</span>
            </div>
          ))}
          <p style={styles.demoNote}>Click any account to auto-fill • Password: admin123</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0d1117 0%, #1a2332 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: '#111827',
    border: '1px solid #374151',
    borderRadius: 20,
    padding: 40,
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
  },
  logo: { textAlign: 'center', marginBottom: 32 },
  logoIcon: { fontSize: 48, marginBottom: 8 },
  logoText: { color: '#f9fafb', fontSize: 28, fontWeight: 800, margin: 0 },
  logoSub: { color: '#6b7280', fontSize: 13, margin: '6px 0 0' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#9ca3af', fontSize: 13, fontWeight: 500 },
  input: {
    background: '#1f2937',
    border: '1px solid #374151',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#f9fafb',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'Arial, sans-serif'
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#ef4444',
    fontSize: 13
  },
  button: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#000',
    border: 'none',
    borderRadius: 10,
    padding: '14px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8
  },
  demo: {
    marginTop: 24,
    padding: 16,
    background: '#1f2937',
    borderRadius: 12,
    border: '1px solid #374151'
  },
  demoTitle: { color: '#6b7280', fontSize: 12, margin: '0 0 10px', fontWeight: 600, textTransform: 'uppercase' },
  demoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    background: '#111827',
    borderRadius: 8,
    marginBottom: 6,
    cursor: 'pointer',
    border: '1px solid #374151'
  },
  demoEmail: { color: '#f9fafb', fontSize: 12 },
  demoRole: { color: '#f59e0b', fontSize: 11, fontWeight: 600 },
  demoNote: { color: '#4b5563', fontSize: 11, margin: '8px 0 0', textAlign: 'center' }
};

export default Login;