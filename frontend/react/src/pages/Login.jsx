import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="auth-card"
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ 
                        background: 'var(--primary)', 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 20px',
                        boxShadow: '0 8px 24px rgba(94, 92, 230, 0.4)'
                    }}>
                        <TrendingUp size={28} color="white" />
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '8px' }}>Welcome back</h2>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Manage your finances with precision</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                type="text" 
                                className="form-input" 
                                style={{ paddingLeft: '48px' }}
                                placeholder="Enter your username"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                type="password" 
                                className="form-input" 
                                style={{ paddingLeft: '48px' }}
                                placeholder="••••••••"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ color: 'var(--danger)', fontSize: '13px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="btn btn-primary"
                        style={{ height: '56px' }}
                    >
                        <LogIn size={20} style={{ marginRight: '8px' }} /> Sign in
                    </motion.button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Start for free</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginForm;
