import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Moon, 
  Sun,
  DollarSign,
  ChevronRight,
  LogOut,
  Camera,
  Mail,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import api from '../api/client';

const Settings = () => {
    const { user, handleLogout } = useAuth();
    const { addToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('profile/me/');
                setProfile(res.data);
            } catch (_err) {
                console.error('Failed to fetch profile');
                addToast('Failed to load settings', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const updateProfile = async (updates) => {
        try {
            const res = await api.patch('profile/me/', updates);
            setProfile(res.data);
            addToast('Settings updated successfully', 'success');
        } catch (_err) {
            console.error('Failed to update profile');
            addToast('Failed to update settings', 'error');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading setttings...</div>;

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}
        >
            <div className="dashboard-header" style={{ marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Settings</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Manage your workspace preferences.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="btn" 
                    style={{ width: 'auto', background: 'var(--danger-soft)', color: 'var(--danger)', border: 'none', fontWeight: '700' }}
                >
                    <LogOut size={18} /> Sign Out
                </motion.button>
            </div>

            <div style={{ display: 'grid', gap: '32px' }}>
                {/* Profile Section */}
                <motion.section variants={itemVariants} className="flux-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={40} color="var(--primary)" />
                            </div>
                            <button style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '6px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
                                <Camera size={14} />
                            </button>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '22px', fontWeight: '900' }}>{user?.username || 'User Profile'}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>{profile?.profession || 'Member'}</p>
                        </div>
                        <motion.button 
                            whileHover={{ y: -2 }}
                            style={{ marginLeft: 'auto', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px', boxShadow: 'var(--shadow-sm)' }}
                        >
                            Edit Profile
                        </motion.button>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        {[
                            { icon: <Mail size={18} />, label: 'Email Address', value: user?.email || 'Not set' },
                            { icon: <Lock size={18} />, label: 'Security & Password', value: 'Last changed 2mo ago' },
                            { icon: <Shield size={18} />, label: 'Two-Factor Auth', value: 'Enabled' },
                        ].map((item, i) => (
                            <motion.div 
                                whileHover={{ background: '#F9F9FB' }}
                                key={i} 
                                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                <div style={{ color: 'var(--text-muted)', background: 'white', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}>{item.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: '700', fontSize: '15px' }}>{item.label}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{item.value}</p>
                                </div>
                                <ChevronRight size={16} style={{ color: '#D0D5DD' }} />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Preferences Section */}
                <motion.section variants={itemVariants} className="flux-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>App Preferences</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #F2F2F7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ padding: '10px', background: profile?.theme === 'dark' ? 'var(--primary-soft)' : '#F2F2F7', borderRadius: '10px' }}>
                                {profile?.theme === 'dark' ? <Moon size={20} color="var(--primary)" /> : <Sun size={20} color="var(--text-muted)" />}
                            </div>
                            <div>
                                <p style={{ fontWeight: '700', fontSize: '15px' }}>Interface Theme</p>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Toggle between light and dark mode</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => updateProfile({ theme: profile?.theme === 'light' ? 'dark' : 'light' })}
                            style={{ 
                                width: '56px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                background: profile?.theme === 'dark' ? 'var(--primary)' : '#E9E9EA',
                                position: 'relative', height: '32px', transition: 'background 0.3s'
                            }}
                        >
                            <motion.div 
                                animate={{ x: profile?.theme === 'dark' ? 26 : 4 }}
                                style={{ 
                                    width: '24px', height: '24px', borderRadius: '50%', background: 'white',
                                    position: 'absolute', top: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }} 
                            />
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                             <div style={{ padding: '10px', background: '#F2F2F7', borderRadius: '10px' }}>
                                <DollarSign size={20} color="var(--text-muted)" />
                            </div>
                            <div>
                                <p style={{ fontWeight: '700', fontSize: '15px' }}>Regional Currency</p>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Your default display currency</p>
                            </div>
                        </div>
                        <select 
                            value={profile?.currency || 'USD'} 
                            onChange={(e) => updateProfile({ currency: e.target.value })}
                            style={{ 
                                padding: '10px 16px', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border)', 
                                background: '#F9F9FB', 
                                fontWeight: '700',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="INR">INR (₹)</option>
                        </select>
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
};

export default Settings;
