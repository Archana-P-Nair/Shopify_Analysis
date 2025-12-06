import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="page-title" style={{ textAlign: 'center' }}>Register</h2>
                {error && <p className="text-error" style={{ textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}
                        required
                    />
                    <button type="submit" className="btn">Register</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: '#4f46e5' }}>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
