import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User } from 'lucide-react';

const MainLayout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '260px', padding: '0 0 40px 0' }}>
                <header style={{
                    height: '72px',
                    background: 'white',
                    borderBottom: '1px solid var(--border)',
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div style={{ position: 'relative', width: '320px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={18} />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            style={{
                                width: '100%',
                                padding: '10px 14px 10px 40px',
                                background: '#F9FAFB',
                                border: '1px solid var(--border)',
                                borderRadius: '10px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <Bell size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '14px', fontWeight: '600' }}>{user?.username}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pro Member</p>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="var(--primary)" />
                            </div>
                        </div>
                    </div>
                </header>
                <main style={{ padding: '32px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
