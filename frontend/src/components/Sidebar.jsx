import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet,
  Target,
  PieChart, 
  BarChart3, 
  Settings, 
  HelpCircle,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { handleLogout } = useAuth();
    const [isDark, setIsDark] = useState(false);

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Receipt size={20} />, label: 'Transactions', path: '/expenses' },
        { icon: <Wallet size={20} />, label: 'Wallet', path: '/wallet' },
        { icon: <Target size={20} />, label: 'Goals', path: '/goals' },
        { icon: <PieChart size={20} />, label: 'Budget', path: '/budgets' },
        { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside style={{
            width: '260px',
            background: 'white',
            borderRight: '1px solid var(--border)',
            height: '100vh',
            padding: '32px 20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '8px' }}>
                <div style={{ 
                    background: '#1C1C1E', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '20px'
                }}>
                    F
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
                    FinSet
                </h2>
            </div>

            {/* Main Nav */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            color: isActive ? 'white' : 'var(--text-main)',
                            background: isActive ? 'var(--primary)' : 'transparent',
                            fontWeight: isActive ? '700' : '500',
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            boxShadow: isActive ? '0 8px 16px rgba(94, 92, 230, 0.25)' : 'none'
                        })}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto', paddingTop: '20px' }}>
                <NavLink to="/help" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    color: 'var(--text-main)',
                    fontWeight: '500',
                    fontSize: '14px',
                }}>
                    <HelpCircle size={20} /> Help
                </NavLink>
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        textAlign: 'left'
                    }}
                >
                    <LogOut size={20} /> Log out
                </motion.button>

                {/* Theme Toggle Pill */}
                <div style={{ 
                    marginTop: '24px',
                    background: '#F2F2F7',
                    padding: '4px',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <button 
                        onClick={() => setIsDark(false)}
                        style={{ 
                            flex: 1, height: '32px', borderRadius: '20px', border: 'none',
                            background: !isDark ? 'white' : 'transparent',
                            boxShadow: !isDark ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Sun size={16} color={!isDark ? 'var(--primary)' : 'var(--text-muted)'} />
                    </button>
                    <button 
                        onClick={() => setIsDark(true)}
                        style={{ 
                            flex: 1, height: '32px', borderRadius: '20px', border: 'none',
                            background: isDark ? 'white' : 'transparent',
                            boxShadow: isDark ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Moon size={16} color={isDark ? 'var(--primary)' : 'var(--text-muted)'} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
