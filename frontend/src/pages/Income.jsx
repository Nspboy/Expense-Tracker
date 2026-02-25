import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  TrendingUp, 
  Plus, 
  DollarSign,
  Calendar,
  Layers,
  Edit2,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const IncomePage = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchIncome();
    }, []);

    const fetchIncome = async () => {
        try {
            const res = await api.get('income/');
            setIncomes(res.data);
        } catch (err) {
            console.error('Error fetching income');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this income record?')) {
            try {
                await api.delete(`income/${id}/`);
                setIncomes(incomes.filter(i => i.id !== id));
            } catch (err) {
                alert('Failed to delete');
            }
        }
    };

    if (loading) return (
        <div style={{ padding: '80px', textAlign: 'center' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '4px solid var(--success-soft)', borderTopColor: 'var(--success)', borderRadius: '50%', margin: '0 auto 16px' }}
            />
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Loading your earnings...</p>
        </div>
    );

    const totalIncome = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
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
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Income</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Monitor your financial growth.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/add-transaction')} 
                    className="btn btn-primary" 
                    style={{ width: 'auto', background: 'var(--success)', boxShadow: '0 4px 12px rgba(52, 199, 89, 0.3)' }}
                >
                    <Plus size={20} /> Add Income
                </motion.button>
            </div>

            <motion.div 
                variants={itemVariants}
                style={{ 
                    background: 'var(--success)', 
                    padding: '40px', 
                    borderRadius: 'var(--radius-xl)', 
                    color: 'white',
                    marginBottom: '48px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 20px 48px rgba(52, 199, 89, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div>
                    <p style={{ opacity: 0.9, fontSize: '15px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Deposits</p>
                    <h2 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-1px' }}>${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '20px' }}>
                    <TrendingUp size={48} />
                </div>
                {/* Abstract background shape */}
                <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', paddingLeft: '8px' }}>Recent Deposits</h3>
                {incomes.map((inc) => (
                    <motion.div 
                        key={inc.id} 
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                        style={{ 
                            background: 'white', 
                            padding: '20px 24px', 
                            borderRadius: 'var(--radius-lg)', 
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ 
                                width: '56px', 
                                height: '56px', 
                                background: 'var(--success-soft)', 
                                color: 'var(--success)',
                                borderRadius: '18px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center'
                            }}>
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '800', fontSize: '17px', marginBottom: '6px' }}>{inc.source}</h4>
                                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Layers size={14} /> Deposit
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} /> {inc.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: '900', color: 'var(--success)', fontSize: '22px', letterSpacing: '-0.5px' }}>+${parseFloat(inc.amount).toFixed(2)}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Verified</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <motion.button 
                                    whileHover={{ scale: 1.1, background: '#F9F9FB' }}
                                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    <Edit2 size={16} />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.1, background: 'var(--danger-soft)', color: 'var(--danger)' }}
                                    onClick={() => handleDelete(inc.id)}
                                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {incomes.length === 0 && (
                <div style={{ padding: '80px', textAlign: 'center' }}>
                    <div style={{ background: '#F9F9FB', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <DollarSign size={32} color="var(--text-muted)" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No records found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>You haven't added any income records yet.</p>
                </div>
            )}
        </motion.div>
    );
};

export default IncomePage;
