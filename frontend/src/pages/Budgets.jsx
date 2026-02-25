import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Plus,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ShoppingCart,
  Car,
  Utensils,
  Home,
  Zap,
  Coffee
} from 'lucide-react';
import { motion } from 'framer-motion';

const categoryIcons = {
    'Food': <Utensils size={20} />,
    'Shopping': <ShoppingCart size={20} />,
    'Travel': <Car size={20} />,
    'Rent': <Home size={20} />,
    'Bills': <Zap size={20} />,
    'Groceries': <Coffee size={20} />,
    'default': <TrendingUp size={20} />
};

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const res = await api.get('budgets/');
            setBudgets(res.data);
        } catch (err) {
            console.error('Error fetching budgets');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '80px', textAlign: 'center' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '4px solid var(--primary-soft)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }}
            />
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Calculating limits...</p>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ maxWidth: '1000px', margin: '0 auto' }}
        >
            <div className="dashboard-header" style={{ marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Budgets</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Stay within your financial boundaries.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary" 
                    style={{ width: 'auto' }}
                >
                    <Plus size={20} /> Create New
                </motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {budgets.map((budget) => {
                    const percent = Math.min((budget.consumed_amount / budget.limit_amount) * 100, 100);
                    const isOver = budget.consumed_amount > budget.limit_amount;
                    const icon = categoryIcons[budget.category_name] || categoryIcons['default'];

                    return (
                        <motion.div 
                            key={budget.id} 
                            variants={itemVariants}
                            whileHover={{ y: -4 }}
                            className="flux-card"
                            style={{ 
                                border: isOver ? '1px solid var(--danger-soft)' : '1px solid rgba(0,0,0,0.02)',
                                background: isOver ? 'linear-gradient(to bottom right, white, #FFF5F5)' : 'white'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    background: isOver ? 'var(--danger-soft)' : 'var(--primary-soft)', 
                                    color: isOver ? 'var(--danger)' : 'var(--primary)',
                                    borderRadius: '14px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center'
                                }}>
                                    {icon}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {isOver ? (
                                        <div style={{ color: 'var(--danger)', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertCircle size={16} /> OVER
                                        </div>
                                    ) : (
                                        <div style={{ color: 'var(--success)', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle2 size={16} /> TRACK
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '8px' }}>{budget.category_name}</h3>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{percent.toFixed(0)}% Consumed</span>
                                    <span style={{ fontWeight: '800' }}>${budget.consumed_amount.toLocaleString()} <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>/ ${budget.limit_amount.toLocaleString()}</span></span>
                                </div>
                                <div style={{ height: '12px', background: '#F2F2F7', borderRadius: '6px', overflow: 'hidden' }}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        style={{ 
                                            height: '100%', 
                                            background: isOver ? 'var(--danger)' : 'var(--primary)',
                                            borderRadius: '6px',
                                            boxShadow: isOver ? '0 0 8px var(--danger-soft)' : '0 0 8px var(--primary-soft)'
                                        }} 
                                    />
                                </div>
                            </div>

                            <div style={{ 
                                padding: '16px', 
                                borderRadius: '14px', 
                                background: isOver ? 'var(--danger-soft)' : 'var(--primary-soft)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: isOver ? 'var(--danger)' : 'var(--primary)' }}>
                                    {isOver ? `Critical: Exceeded by $${(budget.consumed_amount - budget.limit_amount).toLocaleString()}` : `${((budget.limit_amount - budget.consumed_amount)).toLocaleString()} available`}
                                </span>
                                <ArrowUpRight size={16} color={isOver ? 'var(--danger)' : 'var(--primary)'} />
                            </div>
                        </motion.div>
                    );
                })}

                {budgets.length === 0 && (
                    <motion.div 
                        variants={itemVariants}
                        style={{ 
                            gridColumn: '1 / -1', 
                            padding: '100px 40px', 
                            textAlign: 'center', 
                            background: 'white', 
                            borderRadius: '32px',
                            border: '2px dashed var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ background: 'var(--primary-soft)', padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
                            <PieChart size={48} color="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '12px' }}>Define Your Limits</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '32px', fontWeight: '500' }}>Setting budgets helps you save money and understand where your income is going.</p>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary" 
                            style={{ width: 'auto' }}
                        >
                            Set Your First Budget
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Budgets;
