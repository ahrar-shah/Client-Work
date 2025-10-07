import { useState } from 'react';
import jwt from 'jsonwebtoken';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // generate fake token (normally backend karta hai)
      const token = jwt.sign({ role: 'admin' }, process.env.NEXT_PUBLIC_ADMIN_PASSWORD);
      localStorage.setItem('adminToken', token);
      window.location.href = '/admin';
    } else {
      setError('Wrong password');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Login</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter admin password"
        style={{ display: 'block', marginBottom: 12 }}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
