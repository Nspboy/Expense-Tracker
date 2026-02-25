import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/client';
import { 
  ArrowLeft, 
  Save, 
  DollarSign, 
  Calendar, 
  Tag, 
  CreditCard, 
  FileText,
  ChevronDown,
  Receipt,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const AddTransaction = () => {
    const { addToast } = useToast();
    const [type, setType] = useState('Expense');
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: new Date(),
        payment_method: 'Cash',
        notes: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('categories/');
                setCategories(res.data.filter(cat => cat.type === type));
            } catch {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, [type]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dateStr = formData.date.toISOString().split('T')[0];
            if (type === 'Expense') {
                const payload = {
                    title: formData.title,
                    amount: parseFloat(formData.amount),
                    category: formData.category,
                    date: dateStr,
                    payment_method: formData.payment_method,
                    notes: formData.notes,
                };
                await api.post('expenses/', payload);
            } else {
                const payload = {
                    source: formData.title,
                    amount: parseFloat(formData.amount),
                    date: dateStr,
                    notes: formData.notes,
                };
                await api.post('income/', payload);
            }
            addToast(`${type} added successfully!`, 'success');
            navigate(-1);
        } catch {
            addToast(`Failed to add ${type.toLowerCase()}. Please try again.`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const selectedCategory = categories.find(c => String(c.id) === String(formData.category));
    const isExpense = type === 'Expense';
    const accentColor = isExpense ? 'var(--danger)' : 'var(--success)';
    const accentSoft = isExpense ? 'var(--danger-soft)' : 'var(--success-soft)';

    const paymentIcons = {
        'Cash': '💵',
        'Card': '💳',
        'Bank Transfer': '🏦',
        'UPI': '📱'
    };

    const hasContent = formData.title || formData.amount;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}
        >
            <motion.button 
                whileHover={{ x: -4 }}
                onClick={() => navigate(-1)} 
                style={{ 
                    background: 'none', border: 'none', display: 'flex', alignItems: 'center', 
                    gap: '10px', cursor: 'pointer', color: 'var(--text-muted)', 
                    marginBottom: '32px', fontWeight: '700', fontSize: '15px'
                }}
            >
                <ArrowLeft size={20} /> Back to Overview
            </motion.button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>

                {/* ── LEFT: Form ── */}
                <div className="auth-card" style={{ maxWidth: 'none', padding: '48px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '8px' }}>Add Transaction</h1>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Record your financial movement</p>
                    </div>

                    {/* Segmented Control */}
                    <div style={{ 
                        display: 'flex', background: '#F2F2F7', padding: '6px', 
                        borderRadius: '20px', marginBottom: '40px', position: 'relative'
                    }}>
                        <motion.div 
                            initial={false}
                            animate={{ x: type === 'Expense' ? 0 : '100%' }}
                            style={{
                                position: 'absolute', width: '49%', height: 'calc(100% - 12px)',
                                background: 'white', borderRadius: '14px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', zIndex: 0
                            }}
                        />
                        <button 
                            onClick={() => setType('Expense')}
                            style={{
                                flex: 1, padding: '14px', border: 'none', borderRadius: '14px', cursor: 'pointer',
                                background: 'transparent',
                                color: type === 'Expense' ? 'var(--text-main)' : 'var(--text-muted)',
                                fontWeight: '700', fontSize: '15px', position: 'relative', zIndex: 1,
                                transition: 'color 0.2s'
                            }}
                        >Expense</button>
                        <button 
                            onClick={() => setType('Income')}
                            style={{
                                flex: 1, padding: '14px', border: 'none', borderRadius: '14px', cursor: 'pointer',
                                background: 'transparent',
                                color: type === 'Income' ? 'var(--text-main)' : 'var(--text-muted)',
                                fontWeight: '700', fontSize: '15px', position: 'relative', zIndex: 1,
                                transition: 'color 0.2s'
                            }}
                        >Income</button>
                    </div>

                    <form onSubmit={onSubmit}>
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            {/* Title */}
                            <motion.div variants={itemVariants} className="form-group">
                                <label className="form-label">{type === 'Expense' ? 'Transaction Name' : 'Income Source'}</label>
                                <div style={{ position: 'relative' }}>
                                    <Tag style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} size={20} />
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ paddingLeft: '48px' }}
                                        placeholder={type === 'Expense' ? 'e.g. Starbucks Coffee' : 'e.g. Monthly Salary'}
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                            </motion.div>

                            {/* Amount + Date */}
                            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="form-group">
                                    <label className="form-label">Amount ($)</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign style={{ position: 'absolute', left: '16px', top: '16px', color: accentColor }} size={20} />
                                        <input 
                                            type="number" 
                                            className="form-input" 
                                            style={{ paddingLeft: '48px', fontWeight: '800', fontSize: '18px' }}
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required step="0.01"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)', zIndex: 10 }} size={20} />
                                        <DatePicker 
                                            selected={formData.date} 
                                            onChange={(date) => setFormData({ ...formData, date: date })}
                                            className="form-input"
                                            style={{ paddingLeft: '48px' }}
                                            dateFormat="MMMM d, yyyy"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Category + Method */}
                            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <div style={{ position: 'relative' }}>
                                        <select 
                                            className="form-input"
                                            style={{ appearance: 'none' }}
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                        <ChevronDown style={{ position: 'absolute', right: '16px', top: '16px', pointerEvents: 'none', color: 'var(--text-muted)' }} size={20} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Method</label>
                                    <div style={{ position: 'relative' }}>
                                        <CreditCard style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} size={20} />
                                        <select 
                                            className="form-input"
                                            style={{ paddingLeft: '48px', appearance: 'none' }}
                                            value={formData.payment_method}
                                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                        >
                                            <option value="Cash">💵 Cash</option>
                                            <option value="Card">💳 Card</option>
                                            <option value="Bank Transfer">🏦 Bank</option>
                                            <option value="UPI">📱 UPI / GPAY</option>
                                        </select>
                                        <ChevronDown style={{ position: 'absolute', right: '16px', top: '16px', pointerEvents: 'none', color: 'var(--text-muted)' }} size={20} />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Notes */}
                            <motion.div variants={itemVariants} className="form-group">
                                <label className="form-label">Notes</label>
                                <div style={{ position: 'relative' }}>
                                    <FileText style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} size={20} />
                                    <textarea 
                                        className="form-input" 
                                        style={{ height: '100px', paddingTop: '16px', paddingLeft: '48px', resize: 'none' }}
                                        placeholder="Describe the transaction for future reference..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </motion.div>

                            {/* Submit */}
                            <motion.button 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={loading} 
                                style={{ 
                                    background: accentColor,
                                    boxShadow: isExpense ? '0 8px 20px rgba(94,92,230,0.3)' : '0 8px 20px rgba(52,199,89,0.3)',
                                    marginTop: '24px', height: '60px', width: '100%'
                                }}
                            >
                                {loading ? 'Processing...' : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Save size={20} /> Confirm {type}
                                    </div>
                                )}
                            </motion.button>
                        </motion.div>
                    </form>
                </div>

                {/* ── RIGHT: Live Preview ── */}
                <div style={{ position: 'sticky', top: '24px' }}>
                    {/* Label */}
                    <p style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingLeft: '4px' }}>
                        Live Preview
                    </p>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={type}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            style={{
                                background: 'white',
                                borderRadius: 'var(--radius-xl)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-lg)',
                                border: `2px solid ${accentSoft}`
                            }}
                        >
                            {/* Preview Header */}
                            <div style={{ 
                                background: accentColor, padding: '28px',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                {/* decorative circle */}
                                <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '140px', height: '140px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
                                <div style={{ position: 'absolute', right: '30px', bottom: '-40px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '14px' }}>
                                        <Receipt size={22} color="white" />
                                    </div>
                                    <span style={{ 
                                        background: 'rgba(255,255,255,0.25)', color: 'white',
                                        padding: '6px 14px', borderRadius: '20px',
                                        fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px'
                                    }}>
                                        {type}
                                    </span>
                                </div>

                                {/* Big Amount */}
                                <div style={{ position: 'relative' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</p>
                                    <h2 style={{ color: 'white', fontSize: '40px', fontWeight: '900', letterSpacing: '-1px' }}>
                                        {isExpense ? '-' : '+'}{formData.amount ? `$${parseFloat(formData.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$0.00'}
                                    </h2>
                                </div>
                            </div>

                            {/* Preview Body */}
                            <div style={{ padding: '24px 28px' }}>
                                {/* Title / Source */}
                                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                        {type === 'Expense' ? 'Transaction Name' : 'Income Source'}
                                    </p>
                                    <p style={{ fontSize: '18px', fontWeight: '800', color: hasContent && formData.title ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                        {formData.title || 'Untitled'}
                                    </p>
                                </div>

                                {/* Detail rows */}
                                {[
                                    {
                                        icon: <Calendar size={16} />,
                                        label: 'Date',
                                        value: formData.date instanceof Date
                                            ? formData.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                                            : '—'
                                    },
                                    {
                                        icon: <Tag size={16} />,
                                        label: 'Category',
                                        value: selectedCategory ? selectedCategory.name : '—'
                                    },
                                    {
                                        icon: <CreditCard size={16} />,
                                        label: 'Payment Method',
                                        value: `${paymentIcons[formData.payment_method] || ''} ${formData.payment_method}`
                                    },
                                    ...(formData.notes ? [{
                                        icon: <FileText size={16} />,
                                        label: 'Notes',
                                        value: formData.notes
                                    }] : [])
                                ].map((row, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                                        <div style={{ 
                                            width: '34px', height: '34px', borderRadius: '10px', 
                                            background: accentSoft, color: accentColor,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                        }}>
                                            {row.icon}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{row.label}</p>
                                            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', wordBreak: 'break-word' }}>{row.value}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Status badge */}
                                <div style={{ 
                                    marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', gap: '10px'
                                }}>
                                    {hasContent ? (
                                        <>
                                            <CheckCircle size={18} color="var(--success)" />
                                            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--success)' }}>Ready to confirm</p>
                                        </>
                                    ) : (
                                        <>
                                            <Clock size={18} color="var(--text-muted)" />
                                            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Awaiting input...</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Tip */}
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', marginTop: '16px' }}>
                        Preview updates as you type
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default AddTransaction;
