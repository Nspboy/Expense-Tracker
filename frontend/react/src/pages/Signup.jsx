import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, ChevronRight, TrendingUp } from 'lucide-react';
import api from '../api/client';
import { motion } from 'framer-motion';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('register/', formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please check your details.');
        }
    };

    return (
        <div className="auth-container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="auth-card"
                style={{ maxWidth: '500px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ 
                        background: 'var(--success)', 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 20px',
                        boxShadow: '0 8px 24px rgba(52, 199, 89, 0.4)'
                    }}>
                        <TrendingUp size={28} color="white" />
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '8px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Join the Expense Tracker community today</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input name="first_name" type="text" className="form-input" placeholder="John" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input name="last_name" type="text" className="form-input" placeholder="Doe" onChange={onChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} size={20} />
                            <input name="username" type="text" className="form-input" style={{ paddingLeft: '48px' }} placeholder="johndoe" onChange={onChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} size={20} />
                            <input name="email" type="email" className="form-input" style={{ paddingLeft: '48px' }} placeholder="john@example.com" onChange={onChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} size={20} />
                            <input name="password" type="password" className="form-input" style={{ paddingLeft: '48px' }} placeholder="••••••••" onChange={onChange} required />
                        </div>
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
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
                        style={{ height: '56px', background: 'var(--success)', boxShadow: '0 8px 24px rgba(52, 199, 89, 0.3)' }}
                    >
                        Get Started <ChevronRight size={20} style={{ marginLeft: '8px' }} />
                    </motion.button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Log in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupForm;
