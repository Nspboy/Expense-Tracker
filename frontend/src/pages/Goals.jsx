import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, ChevronRight, Trash2 } from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';

const Goals = () => {
    const { addToast } = useToast();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            const res = await api.get('goals/');
            setGoals(res.data);
        } catch (_err) {
            console.error('Failed to fetch goals');
            addToast('Failed to load goals', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`goals/${id}/`);
            addToast('Goal deleted', 'success');
            fetchGoals();
        } catch (_err) {
            addToast('Failed to delete goal', 'error');
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading goals...</div>;

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
                <AnimatePresence>
                    {goals.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <Target size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <h3 style={{ fontWeight: '800' }}>No goals set yet</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Start by adding your first saving goal!</p>
                        </div>
                    ) : (
                        goals.map((goal, idx) => (
                            <motion.div 
                                key={goal.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ y: -4 }}
                                className="flux-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Target size={24} color={'var(--primary)'} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{goal.name}</h3>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>${goal.current_amount.toLocaleString()} saved</p>
                                        </div>
                                    </div>
                                    <h2 style={{ fontSize: '20px', fontWeight: '900' }}>{goal.progress_percentage}%</h2>
                                </div>

                                <div style={{ width: '100%', height: '12px', background: '#F2F2F7', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goal.progress_percentage}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        style={{ height: '100%', background: 'var(--primary)', borderRadius: '10px' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Target: ${goal.target_amount.toLocaleString()}</p>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button 
                                            onClick={() => handleDelete(goal.id)}
                                            style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button style={{ border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            Details <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Goals;
