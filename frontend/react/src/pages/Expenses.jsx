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
  Receipt,
  DollarSign,
  CreditCard,
  ChevronDown,
  X,
  TrendingDown,
  BarChart2,
  Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { TableRowSkeleton } from '../components/SkeletonLoader';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [categories, setCategories] = useState([]);
    const [quickForm, setQuickForm] = useState({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('expenses/');
            setExpenses(res.data);
        } catch (_err) {
            console.error('Error fetching expenses');
            addToast('Failed to load expenses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('categories/');
            setCategories(res.data.filter(c => c.type === 'Expense'));
        } catch {
            console.error('Failed to fetch categories');
        }
    };

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post('expenses/', quickForm);
            setExpenses(prev => [res.data, ...prev]);
            setQuickForm({
                title: '',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                payment_method: 'Cash',
                notes: ''
            });
            setShowQuickAdd(false);
            addToast('Expense added successfully!', 'success');
        } catch {
            addToast('Failed to add expense. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            try {
                await api.delete(`expenses/${id}/`);
                setExpenses(prev => prev.filter(e => e.id !== id));
                addToast('Transaction deleted', 'success');
            } catch (err) {
                addToast('Failed to delete transaction', 'error');
            }
        }
    };

    const filteredExpenses = expenses.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Computed output stats
    const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const avgExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ marginBottom: '40px' }}>
                <div style={{ width: '200px', height: '40px', background: '#F2F2F7', borderRadius: '8px' }} />
                <div style={{ width: '120px', height: '44px', background: '#F2F2F7', borderRadius: '12px' }} />
            </div>
            {[1,2,3,4].map(i => <TableRowSkeleton key={i} />)}
        </div>
    );

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
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Expenses</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Monitor your spending habits.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowQuickAdd(v => !v)} 
                        className="btn btn-primary" 
                        style={{ 
                            width: 'auto', 
                            background: showQuickAdd ? 'var(--text-muted)' : 'var(--danger)',
                            boxShadow: showQuickAdd ? 'none' : '0 4px 12px rgba(255,59,48,0.25)'
                        }}
                    >
                        {showQuickAdd ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Quick Add</>}
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/add-transaction')} 
                        className="btn btn-primary" 
                        style={{ width: 'auto' }}
                    >
                        <Plus size={20} /> Full Form
                    </motion.button>
                </div>
            </div>

            {/* Output Summary Bar */}
            <motion.div 
                variants={itemVariants}
                style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '16px', 
                    marginBottom: '28px' 
                }}
            >
                {[
                    { 
                        icon: <TrendingDown size={20} />, 
                        label: 'Total Spent', 
                        value: `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        color: 'var(--danger)',
                        bg: 'var(--danger-soft)'
                    },
                    { 
                        icon: <Hash size={20} />, 
                        label: 'Transactions', 
                        value: expenses.length,
                        color: 'var(--primary)',
                        bg: 'var(--primary-soft)'
                    },
                    { 
                        icon: <BarChart2 size={20} />, 
                        label: 'Avg per Transaction', 
                        value: `$${avgExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        color: 'var(--warning)',
                        bg: 'rgba(255,149,0,0.1)'
                    }
                ].map((stat, i) => (
                    <div key={i} style={{ 
                        background: 'white', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '20px 24px', 
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        border: '1px solid rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ 
                            width: '44px', height: '44px', borderRadius: '14px', 
                            background: stat.bg, color: stat.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
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
                            background: 'white', 
                            borderRadius: 'var(--radius-lg)', 
                            padding: '28px',
                            marginBottom: '28px',
                            boxShadow: 'var(--shadow-md)',
                            border: '2px solid var(--danger-soft)'
                        }}
                    >
                        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '32px', height: '32px', background: 'var(--danger-soft)', color: 'var(--danger)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Receipt size={16} />
                            </span>
                            Quick Add Expense
                        </h3>
                        <form onSubmit={handleQuickAdd}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                {/* Title */}
                                <div style={{ position: 'relative' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</label>
                                    <div style={{ position: 'relative' }}>
                                        <Tag style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={16} />
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            style={{ paddingLeft: '42px' }}
                                            placeholder="e.g. Grocery shopping"
                                            value={quickForm.title}
                                            onChange={e => setQuickForm({ ...quickForm, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Amount */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--danger)' }} size={16} />
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
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                        <ChevronDown style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none', color: 'var(--text-muted)' }} size={16} />
                                    </div>
                                </div>
                                {/* Payment Method */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Method</label>
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
                                            <option value="Bank Transfer">🏦 Bank</option>
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
                                    background: 'var(--danger)', color: 'white', fontWeight: '800', fontSize: '15px',
                                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,59,48,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                {submitting ? 'Adding...' : <><Plus size={18} /> Add Expense — {quickForm.amount ? `$${parseFloat(quickForm.amount).toFixed(2)}` : '$0.00'}</>}
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search & Filter */}
            <div style={{ 
                background: 'white', padding: '20px', borderRadius: 'var(--radius-lg)', 
                boxShadow: 'var(--shadow-md)', marginBottom: '32px',
                display: 'flex', gap: '16px', alignItems: 'center',
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
                            width: '100%', padding: '14px 18px 14px 48px',
                            background: '#F9F9FB', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '15px'
                        }}
                    />
                </div>
                <button style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', 
                    background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', fontWeight: '700', fontSize: '15px'
                }}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            {/* Expense List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AnimatePresence mode="popLayout">
                    {filteredExpenses.map((exp) => (
                        <motion.div 
                            key={exp.id} layout
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
                                    width: '56px', height: '56px', background: 'var(--danger-soft)', color: 'var(--danger)',
                                    borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
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
                                    <p style={{ fontWeight: '900', color: 'var(--danger)', fontSize: '20px', letterSpacing: '-0.5px' }}>-${parseFloat(exp.amount).toFixed(2)}</p>
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
                </AnimatePresence>
            </div>

            {filteredExpenses.length === 0 && (
                <div style={{ padding: '80px', textAlign: 'center' }}>
                    <div style={{ background: '#F9F9FB', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Receipt size={32} color="var(--text-muted)" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No records found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        {searchTerm ? "We couldn't find any expenses matching your search." : "You haven't added any expenses yet."}
                    </p>
                    {!searchTerm && (
                        <motion.button 
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setShowQuickAdd(true)}
                            style={{ padding: '12px 28px', borderRadius: 'var(--radius-md)', background: 'var(--danger)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Plus size={18} /> Add your first expense
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default Expenses;
