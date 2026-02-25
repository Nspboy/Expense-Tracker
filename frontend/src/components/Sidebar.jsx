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

const Sidebar = () => {
    const { handleLogout } = useAuth();

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Receipt size={20} />, label: 'Expenses', path: '/expenses' },
        { icon: <TrendingUp size={20} />, label: 'Income', path: '/income' },
        { icon: <PieChart size={20} />, label: 'Budgets', path: '/budgets' },
        { icon: <BarChart3 size={20} />, label: 'Reports', path: '/reports' },
    ];

    return (
        <aside style={{
            width: '260px',
            background: 'white',
            borderRight: '1px solid var(--border)',
            height: '100vh',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                    <TrendingUp size={24} color="white" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Antigravity</h2>
            </div>

            <nav style={{ flex: 1 }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            background: isActive ? '#F4EBFF' : 'transparent',
                            marginBottom: '4px',
                            fontWeight: isActive ? '600' : '500',
                            transition: 'all 0.2s'
                        })}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <NavLink to="/settings" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: 'var(--text-muted)',
                    marginBottom: '4px'
                }}>
                    <Settings size={20} /> Settings
                </NavLink>
                <button 
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
