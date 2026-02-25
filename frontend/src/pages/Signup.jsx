import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../api/client';

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
            await api.post('register/', formData); // Needs backend register view or use standard endpoint
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ 
                        background: 'var(--success)', 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 16px' 
                    }}>
                        <UserPlus size={24} color="white" />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Create account</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Join the Antigravity community</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input name="username" type="text" className="form-input" onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input name="email" type="email" className="form-input" onChange={onChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input name="first_name" type="text" className="form-input" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input name="last_name" type="text" className="form-input" onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input name="password" type="password" className="form-input" onChange={onChange} required />
                    </div>

                    {error && <p style={{ color: 'var(--danger)', fontSize: '12px', marginBottom: '16px' }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ background: 'var(--success)' }}>Sign up</button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;
