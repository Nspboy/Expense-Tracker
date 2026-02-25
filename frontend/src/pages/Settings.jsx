import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Moon, 
  Sun,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [theme, setTheme] = useState('light');
    const [currency, setCurrency] = useState('USD');

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Account Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your profile and application preferences</p>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
                <section style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={32} color="var(--primary)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{user?.username}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Member since March 2024</p>
                        </div>
                        <button style={{ marginLeft: 'auto', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Edit Profile</button>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        {[
                            { icon: <Shield size={18} />, label: 'Security & Password' },
                            { icon: <Bell size={18} />, label: 'Notifications' },
                            { icon: <Globe size={18} />, label: 'Language' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', borderBottom: i < 2 ? '1px solid #F2F4F7' : 'none' }}>
                                <div style={{ color: 'var(--text-muted)' }}>{item.icon}</div>
                                <span style={{ fontWeight: '500' }}>{item.label}</span>
                                <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#D0D5DD' }} />
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>App Preferences</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F2F4F7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Moon size={18} color="var(--text-muted)" />
                            <div>
                                <p style={{ fontWeight: '600' }}>Dark Mode</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Adjust the app appearance</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            style={{ 
                                width: '44px', hieght: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                background: theme === 'dark' ? 'var(--primary)' : '#E9E9EA',
                                position: 'relative', height: '24px'
                            }}
                        >
                            <div style={{ 
                                width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                                position: 'absolute', top: '3px', transition: 'left 0.2s',
                                left: theme === 'dark' ? '23px' : '3px'
                            }} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <DollarSign size={18} color="var(--text-muted)" />
                            <div>
                                <p style={{ fontWeight: '600' }}>Primary Currency</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Set your default display currency</p>
                            </div>
                        </div>
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#F9FAFB', fontWeight: '600' }}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="INR">INR (₹)</option>
                        </select>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
