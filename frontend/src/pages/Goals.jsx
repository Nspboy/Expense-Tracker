import React from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, ChevronRight } from 'lucide-react';

const Goals = () => {
    const goals = [
        { label: 'MacBook Pro', current: 412, target: 1650, progress: 25, color: 'var(--primary)' },
        { label: 'New car', current: 25200, target: 60000, progress: 42, color: '#FF9500' },
        { label: 'New house', current: 4500, target: 150000, progress: 3, color: '#34C759' },
        { label: 'Holiday trip', current: 800, target: 1200, progress: 66, color: '#FF3B30' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Saving Goals</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Track your dreams and future plans</p>
                </div>
                <button style={{ padding: '12px 20px', borderRadius: '14px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> New Goal
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                {goals.map((goal, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -4 }}
                        className="flux-card"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Target size={24} color={goal.color} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{goal.label}</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>${goal.current.toLocaleString()} saved</p>
                                </div>
                            </div>
                            <h2 style={{ fontSize: '20px', fontWeight: '900' }}>{goal.progress}%</h2>
                        </div>

                        <div style={{ width: '100%', height: '12px', background: '#F2F2F7', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                style={{ height: '100%', background: goal.color, borderRadius: '10px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Target: ${goal.target.toLocaleString()}</p>
                            <button style={{ border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                Details <ChevronRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Goals;
