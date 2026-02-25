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
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
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
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
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
            const payload = {
                ...formData,
                date: formData.date.toISOString().split('T')[0],
                [type === 'Expense' ? 'title' : 'source']: formData.title
            };
            
            if (type === 'Expense') {
                await api.post('expenses/', payload);
            } else {
                await api.post('income/', payload);
            }
            addToast(`${type} added successfully!`, 'success');
            navigate(-1);
        } catch {
            addToast(`Failed to add ${type.toLowerCase()}. Please try again.`, 'error');
            console.error('Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}
        >
            <motion.button 
                whileHover={{ x: -4 }}
                onClick={() => navigate(-1)} 
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    cursor: 'pointer', 
                    color: 'var(--text-muted)', 
                    marginBottom: '32px',
                    fontWeight: '700',
                    fontSize: '15px'
                }}
            >
                <ArrowLeft size={20} /> Back to Overview
            </motion.button>

            <div className="auth-card" style={{ maxWidth: 'none', padding: '48px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '8px' }}>Add Transaction</h1>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Record your financial movement</p>
                </div>

                {/* Segmented Control */}
                <div style={{ 
                    display: 'flex', 
                    background: '#F2F2F7', 
                    padding: '6px', 
                    borderRadius: '20px', 
                    marginBottom: '40px',
                    position: 'relative'
                }}>
                    <motion.div 
                        initial={false}
                        animate={{ x: type === 'Expense' ? 0 : '100%' }}
                        style={{
                            position: 'absolute',
                            width: '49%',
                            height: 'calc(100% - 12px)',
                            background: 'white',
                            borderRadius: '14px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            zIndex: 0
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
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
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

                    <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Amount ($)</label>
                            <div style={{ position: 'relative' }}>
                                <DollarSign style={{ position: 'absolute', left: '16px', top: '16px', color: type === 'Expense' ? 'var(--danger)' : 'var(--success)' }} size={20} />
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    style={{ paddingLeft: '48px', fontWeight: '800', fontSize: '18px' }}
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                    step="0.01"
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

                    <motion.button 
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading} 
                        style={{ 
                            background: type === 'Expense' ? 'var(--primary)' : 'var(--success)',
                            boxShadow: type === 'Expense' ? '0 8px 20px rgba(94, 92, 230, 0.3)' : '0 8px 20px rgba(52, 199, 89, 0.3)',
                            marginTop: '24px',
                            height: '60px',
                            width: '100%'
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
        </motion.div>
    );
};

export default AddTransaction;
