import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Filter, 
  Search, 
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('expenses/');
            setExpenses(res.data);
        } catch (err) {
            console.error('Error fetching expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            try {
                await api.delete(`expenses/${id}/`);
                setExpenses(expenses.filter(e => e.id !== id));
            } catch (err) {
                alert('Failed to delete');
            }
        }
    };

    const filteredExpenses = expenses.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div style={{ padding: '80px', textAlign: 'center' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '4px solid var(--primary-soft)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }}
            />
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Retrieving your records...</p>
        </div>
    );

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
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Expenses</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Monitor your spending habits.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/add-transaction')} 
                    className="btn btn-primary" 
                    style={{ width: 'auto' }}
                >
                    <Plus size={20} /> Add New
                </motion.button>
            </div>

            <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: 'var(--radius-lg)', 
                boxShadow: 'var(--shadow-md)',
                marginBottom: '32px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                border: '1px solid rgba(0,0,0,0.02)'
            }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by title or category..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 18px 14px 48px',
                            background: '#F9F9FB',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            outline: 'none',
                            fontSize: '15px'
                        }}
                    />
                </div>
                <button style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '14px 24px', 
                    background: 'white', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '15px'
                }}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredExpenses.map((exp) => (
                    <motion.div 
                        key={exp.id} 
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
                                background: 'var(--danger-soft)', 
                                color: 'var(--danger)',
                                borderRadius: '18px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyHeight: 'center',
                                justifyContent: 'center'
                            }}>
                                <Receipt size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '800', fontSize: '17px', marginBottom: '6px' }}>{exp.title}</h4>
                                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Tag size={14} /> {exp.category_name}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} /> {exp.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: '900', color: 'var(--danger)', fontSize: '20px', letterSpacing: '-0.5px' }}>-${exp.amount.toFixed(2)}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{exp.payment_method}</p>
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
                                    onClick={() => handleDelete(exp.id)}
                                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredExpenses.length === 0 && (
                <div style={{ padding: '80px', textAlign: 'center' }}>
                    <div style={{ background: '#F9F9FB', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Receipt size={32} color="var(--text-muted)" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No records found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>We couldn't find any expenses matching your search.</p>
                </div>
            )}
        </motion.div>
    );
};

export default Expenses;
