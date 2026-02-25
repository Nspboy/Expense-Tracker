import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />
            
            <main style={{ 
                flex: 1, 
                marginLeft: '280px', 
                padding: '40px 60px',
                minWidth: 0
            }}>
                <header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '48px'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px', 
                        background: 'white',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-xl)',
                        width: '400px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border)'
                    }}>
                        <Search size={20} color="var(--text-muted)" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                width: '100%',
                                fontSize: '15px',
                                fontWeight: '500'
                            }} 
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ 
                                width: '48px', 
                                height: '48px', 
                                background: 'white', 
                                border: '1px solid var(--border)', 
                                borderRadius: '16px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--text-main)'
                            }}
                        >
                            <Bell size={22} />
                        </motion.button>
                        
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            background: 'white',
                            padding: '6px 6px 6px 16px',
                            borderRadius: '20px',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <span style={{ fontWeight: '700', fontSize: '14px' }}>John Doe</span>
                            <div style={{ 
                                width: '36px', 
                                height: '36px', 
                                background: 'var(--primary)', 
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

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
