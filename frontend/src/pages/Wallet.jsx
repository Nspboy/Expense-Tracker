import React from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';

const Wallet = () => {
    const cards = [
        { type: 'Visa', number: '**** 3456', balance: 12500, color: 'var(--primary)' },
        { type: 'Mastercard', number: '**** 8821', balance: 8400, color: '#1C1C1E' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Your Wallets</h2>
                <button style={{ padding: '12px 20px', borderRadius: '14px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Add new card
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {cards.map((card, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -4 }}
                        style={{ 
                            background: card.color, 
                            padding: '32px', 
                            borderRadius: '32px', 
                            color: 'white', 
                            height: '220px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '14px', opacity: 0.8, fontWeight: '600' }}>{card.type}</p>
                                <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>{card.number}</h3>
                            </div>
                            <WalletIcon size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', opacity: 0.8, fontWeight: '600', marginBottom: '4px' }}>Balance</p>
                            <h2 style={{ fontSize: '32px', fontWeight: '900' }}>${card.balance.toLocaleString()}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flux-card">
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                        { title: 'Payment for groceries', amount: -64.20, date: 'Today', isExp: true },
                        { title: 'Salary Deposit', amount: 4500.00, date: 'Yesterday', isExp: false },
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F9F9FB', borderRadius: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: item.isExp ? 'var(--danger-soft)' : 'var(--success-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.isExp ? <ArrowDownRight size={20} color="var(--danger-text)" /> : <ArrowUpRight size={20} color="var(--success-text)" />}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '700', fontSize: '14px' }}>{item.title}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{item.date}</p>
                                </div>
                            </div>
                            <span style={{ fontWeight: '800', color: item.isExp ? 'var(--danger-text)' : 'var(--success-text)' }}>
                                {item.isExp ? '-' : '+'}${Math.abs(item.amount).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Wallet;
