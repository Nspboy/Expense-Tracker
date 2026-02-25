import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  TrendingUp, 
  Plus, 
  DollarSign,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Tag,
  CreditCard,
  ChevronDown,
  X,
  Hash,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { TableRowSkeleton } from '../components/SkeletonLoader';

const IncomePage = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [categories, setCategories] = useState([]);
    const [quickForm, setQuickForm] = useState({
        source: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'Bank Transfer',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        fetchIncome();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchIncome = async () => {
        try {
            const res = await api.get('income/');
            setIncomes(res.data);
        } catch (err) {
            console.error('Error fetching income');
            addToast('Failed to load income records', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('categories/');
            setCategories(res.data.filter(c => c.type === 'Income'));
        } catch {
            console.error('Failed to fetch categories');
        }
    };

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post('income/', quickForm);
            setIncomes(prev => [res.data, ...prev]);
            setQuickForm({
                source: '',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                payment_method: 'Bank Transfer',
                notes: ''
            });
            setShowQuickAdd(false);
            addToast('Income added successfully!', 'success');
        } catch {
            addToast('Failed to add income. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this income record?')) {
            try {
                await api.delete(`income/${id}/`);
                setIncomes(prev => prev.filter(i => i.id !== id));
                addToast('Income record deleted', 'success');
            } catch (err) {
                addToast('Failed to delete income record', 'error');
            }
        }
    };

    if (loading) return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ marginBottom: '40px' }}>
                <div style={{ width: '200px', height: '40px', background: '#F2F2F7', borderRadius: '8px' }} />
                <div style={{ width: '120px', height: '44px', background: '#F2F2F7', borderRadius: '12px' }} />
            </div>
            <div style={{ height: '180px', background: '#F2F2F7', borderRadius: '24px', marginBottom: '48px' }} />
            {[1,2,3,4].map(i => <TableRowSkeleton key={i} />)}
        </div>
    );

    const totalIncome = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const highestIncome = incomes.length > 0 ? Math.max(...incomes.map(i => parseFloat(i.amount))) : 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
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
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Income</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Monitor your financial growth.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setShowQuickAdd(v => !v)} 
                        className="btn btn-primary" 
                        style={{ 
                            width: 'auto', 
                            background: showQuickAdd ? 'var(--text-muted)' : 'var(--success)',
                            boxShadow: showQuickAdd ? 'none' : '0 4px 12px rgba(52,199,89,0.3)'
                        }}
                    >
                        {showQuickAdd ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Quick Add</>}
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/add-transaction')} 
                        className="btn btn-primary" 
                        style={{ width: 'auto', background: 'var(--success)', boxShadow: '0 4px 12px rgba(52,199,89,0.3)' }}
                    >
                        <Plus size={20} /> Full Form
                    </motion.button>
                </div>
            </div>

            {/* Output Summary Bar */}
            <motion.div 
                variants={itemVariants}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px' }}
            >
                {[
                    { 
                        icon: <TrendingUp size={20} />, 
                        label: 'Total Income', 
                        value: `$${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        color: 'var(--success)',
                        bg: 'var(--success-soft)'
                    },
                    { 
                        icon: <Hash size={20} />, 
                        label: 'Income Sources', 
                        value: incomes.length,
                        color: 'var(--primary)',
                        bg: 'var(--primary-soft)'
                    },
                    { 
                        icon: <Award size={20} />, 
                        label: 'Highest Single', 
                        value: `$${highestIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        color: '#FF9500',
                        bg: 'rgba(255,149,0,0.1)'
                    }
                ].map((stat, i) => (
                    <div key={i} style={{ 
                        background: 'white', borderRadius: 'var(--radius-md)', padding: '20px 24px', 
                        boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '16px',
                        border: '1px solid rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ 
                            width: '44px', height: '44px', borderRadius: '14px', 
                            background: stat.bg, color: stat.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{stat.label}</p>
                            <p style={{ fontSize: '20px', fontWeight: '900', color: stat.color, letterSpacing: '-0.5px' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Quick Add Form */}
            <AnimatePresence>
                {showQuickAdd && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{ 
                            background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px',
                            marginBottom: '28px', boxShadow: 'var(--shadow-md)',
                            border: '2px solid var(--success-soft)'
                        }}
                    >
                        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '32px', height: '32px', background: 'var(--success-soft)', color: 'var(--success)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DollarSign size={16} />
                            </span>
                            Quick Add Income
                        </h3>
                        <form onSubmit={handleQuickAdd}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                {/* Source */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Income Source</label>
                                    <div style={{ position: 'relative' }}>
                                        <Tag style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={16} />
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            style={{ paddingLeft: '42px' }}
                                            placeholder="e.g. Monthly Salary"
                                            value={quickForm.source}
                                            onChange={e => setQuickForm({ ...quickForm, source: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Amount */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--success)' }} size={16} />
                                        <input 
                                            type="number" 
                                            className="form-input" 
                                            style={{ paddingLeft: '42px', fontWeight: '800' }}
                                            placeholder="0.00"
                                            value={quickForm.amount}
                                            onChange={e => setQuickForm({ ...quickForm, amount: e.target.value })}
                                            required
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                {/* Date */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={16} />
                                        <input 
                                            type="date" 
                                            className="form-input" 
                                            style={{ paddingLeft: '42px' }}
                                            value={quickForm.date}
                                            onChange={e => setQuickForm({ ...quickForm, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                {/* Category */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                                    <div style={{ position: 'relative' }}>
                                        <select 
                                            className="form-input"
                                            style={{ appearance: 'none' }}
                                            value={quickForm.category}
                                            onChange={e => setQuickForm({ ...quickForm, category: e.target.value })}
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                        <ChevronDown style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none', color: 'var(--text-muted)' }} size={16} />
                                    </div>
                                </div>
                                {/* Payment Method */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Received Via</label>
                                    <div style={{ position: 'relative' }}>
                                        <CreditCard style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={16} />
                                        <select 
                                            className="form-input"
                                            style={{ paddingLeft: '42px', appearance: 'none' }}
                                            value={quickForm.payment_method}
                                            onChange={e => setQuickForm({ ...quickForm, payment_method: e.target.value })}
                                        >
                                            <option value="Cash">💵 Cash</option>
                                            <option value="Card">💳 Card</option>
                                            <option value="Bank Transfer">🏦 Bank Transfer</option>
                                            <option value="UPI">📱 UPI / GPAY</option>
                                        </select>
                                        <ChevronDown style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none', color: 'var(--text-muted)' }} size={16} />
                                    </div>
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                disabled={submitting}
                                style={{ 
                                    width: '100%', padding: '14px', border: 'none', borderRadius: 'var(--radius-md)',
                                    background: 'var(--success)', color: 'white', fontWeight: '800', fontSize: '15px',
                                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(52,199,89,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                {submitting ? 'Adding...' : <><Plus size={18} /> Add Income — {quickForm.amount ? `$${parseFloat(quickForm.amount).toFixed(2)}` : '$0.00'}</>}
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Banner */}
            <motion.div 
                variants={itemVariants}
                style={{ 
                    background: 'var(--success)', padding: '40px', borderRadius: 'var(--radius-xl)', 
                    color: 'white', marginBottom: '48px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 20px 48px rgba(52, 199, 89, 0.15)',
                    position: 'relative', overflow: 'hidden'
                }}
            >
                <div>
                    <p style={{ opacity: 0.9, fontSize: '15px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Deposits</p>
                    <h2 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-1px' }}>${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '20px' }}>
                    <TrendingUp size={48} />
                </div>
                <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            </motion.div>

            {/* Incomes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', paddingLeft: '8px' }}>Recent Deposits</h3>
                <AnimatePresence mode="popLayout">
                    {incomes.map((inc) => (
                        <motion.div 
                            key={inc.id} layout
                            variants={itemVariants}
                            exit={{ opacity: 0, x: -20, scale: 0.95 }}
                            whileHover={{ x: 4 }}
                            style={{ 
                                background: 'white', padding: '20px 24px', 
                                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                border: '1px solid rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ 
                                    width: '56px', height: '56px', background: 'var(--success-soft)', color: 'var(--success)',
                                    borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
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
                </AnimatePresence>
            </div>

            {incomes.length === 0 && (
                <div style={{ padding: '80px', textAlign: 'center' }}>
                    <div style={{ background: '#F9F9FB', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <DollarSign size={32} color="var(--text-muted)" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No records found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>You haven't added any income records yet.</p>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setShowQuickAdd(true)}
                        style={{ padding: '12px 28px', borderRadius: 'var(--radius-md)', background: 'var(--success)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> Add your first income
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
};

export default IncomePage;
