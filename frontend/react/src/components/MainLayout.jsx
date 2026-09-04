import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, Grid, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />
            
            <main style={{ 
                flex: 1, 
                marginLeft: '260px', 
                padding: '32px 48px',
                minWidth: 0
            }}>
                {/* Header Section */}
                <header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: '40px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>Welcome back, {user?.username || 'Nagaraj'}!</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>It is the best time to manage your finances</p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        {/* Search & Notif */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <motion.button whileHover={{ scale: 1.05 }} style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Search size={20} color="var(--text-main)" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                                <Bell size={20} color="var(--text-main)" />
                                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }} />
                            </motion.button>
                        </div>

                        {/* Profile Pill */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            background: 'white',
                            padding: '6px 16px 6px 6px',
                            borderRadius: '32px',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                             <div style={{ 
                                width: '36px', 
                                height: '36px', 
                                background: 'var(--primary-soft)', 
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)',
                                overflow: 'hidden'
                            }}>
                                <img src={`https://ui-avatars.com/api/?name=${user?.username || 'Nagaraj'}&background=5E5CE6&color=fff`} alt="avatar" style={{ width: '100%', height: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: '800', fontSize: '13px' }}>{user?.username || 'Nagaraj'}</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>{user?.email || 'nagaraj@example.com'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sub-Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                         <div style={{ background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '700' }}>
                            <div style={{ padding: '4px', background: '#F2F2F7', borderRadius: '6px' }}><Search size={14} /></div>
                            This month
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                            <Grid size={16} /> Manage widgets
                        </button>
                        <button style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(94, 92, 230, 0.3)' }}>
                            <Plus size={16} /> Add new widget
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default MainLayout;
