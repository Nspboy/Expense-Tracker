import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Plus, MoreVertical, Wallet as WalletIcon } from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';

const Wallet = () => {
    const { addToast } = useToast();
    const [summary, setSummary] = useState({ balance: 0, total_income: 0, total_expense: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sumRes, expRes] = await Promise.all([
                    api.get('summary/'),
                    api.get('expenses/')
                ]);
                setSummary(sumRes.data);
                setRecentTransactions(expRes.data.slice(0, 4));
            } catch (_err) {
                console.error('Failed to fetch wallet data');
                addToast('Failed to load wallet data', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading wallet...</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800' }}>My Wallet</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Manage your accounts and cards</p>
                </div>
                <button style={{ padding: '12px 20px', borderRadius: '14px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Add Account
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Virtual Card */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    style={{ 
                        background: 'linear-gradient(135deg, #1C1C1E 0%, #3A3A3C 100%)',
                        padding: '32px',
                        borderRadius: '24px',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}
                >
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(94, 92, 230, 0.2)', borderRadius: '50%', filter: 'blur(40px)' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                        <WalletIcon size={32} />
                        <CreditCard size={32} />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <p style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Total Balance</p>
                        <h1 style={{ fontSize: '36px', fontWeight: '900' }}>${summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
                    </div>

                    <div style={{ display: 'flex', gap: '40px' }}>
                        <div>
                            <p style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>CARD HOLDER</p>
                            <p style={{ fontSize: '14px', fontWeight: '700' }}>NAGARAJ</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>EXPIRES</p>
                            <p style={{ fontSize: '14px', fontWeight: '700' }}>12/28</p>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions / Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="flux-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowDownLeft size={24} color="var(--success)" />
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Total Income</p>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--success)' }}>+${summary.total_income.toLocaleString()}</h3>
                    </div>
                    <div className="flux-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--danger-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowUpRight size={24} color="var(--danger)" />
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Total Expenses</p>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--danger)' }}>-${summary.total_expense.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Transactions in Wallet */}
            <div className="flux-card">
                <div className="flux-card-header" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Recent Wallet Activity</h3>
                    <MoreVertical size={20} color="var(--text-muted)" />
                </div>
                {recentTransactions.map((tx, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i === recentTransactions.length - 1 ? 'none' : '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CreditCard size={18} color="var(--primary)" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{tx.title}</h4>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--danger)' }}>-${tx.amount.toLocaleString()}</h4>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Wallet;
