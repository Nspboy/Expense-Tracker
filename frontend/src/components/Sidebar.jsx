import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { handleLogout } = useAuth();

    const navItems = [
        { icon: <LayoutDashboard size={22} />, label: 'Overview', path: '/' },
        { icon: <Receipt size={22} />, label: 'Expenses', path: '/expenses' },
        { icon: <TrendingUp size={22} />, label: 'Income', path: '/income' },
        { icon: <PieChart size={22} />, label: 'Budgets', path: '/budgets' },
        { icon: <BarChart3 size={22} />, label: 'Reports', path: '/reports' },
    ];

    return (
        <aside style={{
            width: '280px',
            background: 'white',
            borderRight: '1px solid var(--border)',
            height: '100vh',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px', paddingLeft: '8px' }}>
                <div style={{ 
                    background: 'var(--primary)', 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '14px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(94, 92, 230, 0.3)'
                }}>
                    <TrendingUp size={24} color="white" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '900', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
                    Expense <span style={{ color: 'var(--primary)' }}>Tracker</span>
                </h2>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '14px 18px',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            background: isActive ? 'var(--primary-soft)' : 'transparent',
                            fontWeight: isActive ? '700' : '600',
                            fontSize: '15px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        })}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
                <NavLink to="/settings" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--text-muted)',
                    fontWeight: '600',
                    fontSize: '15px',
                    marginBottom: '8px'
                }}>
                    <Settings size={22} /> Settings
                </NavLink>
                <motion.button 
                    whileHover={{ x: 4 }}
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '700'
                    }}
                >
                    <LogOut size={22} /> Logout
                </motion.button>
            </div>
        </aside>
    );
};

export default Sidebar;
