import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/client';
import { ArrowLeft, Save, Plus } from 'lucide-react';

const AddTransaction = () => {
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('categories/');
                setCategories(res.data.filter(cat => cat.type === type));
            } catch (err) {
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
            navigate('/');
        } catch (err) {
            console.error('Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ 
                background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '24px' 
            }}>
                <ArrowLeft size={20} /> Back
            </button>

            <div className="auth-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Add Transaction</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Log your financial activity</p>
                    </div>
                </div>

                <div style={{ display: 'flex', background: '#F2F4F7', padding: '4px', borderRadius: '10px', marginBottom: '24px' }}>
                    <button 
                        onClick={() => setType('Expense')}
                        style={{
                            flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                            background: type === 'Expense' ? 'white' : 'transparent',
                            color: type === 'Expense' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: '600', transition: 'all 0.2s'
                        }}
                    >Expense</button>
                    <button 
                        onClick={() => setType('Income')}
                        style={{
                            flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                            background: type === 'Income' ? 'white' : 'transparent',
                            color: type === 'Income' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: '600', transition: 'all 0.2s'
                        }}
                    >Income</button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">{type === 'Expense' ? 'Expense Title' : 'Income Source'}</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder={type === 'Expense' ? 'e.g. Grocery Shopping' : 'e.g. Freelance Pay'}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Amount ($)</label>
                            <input 
                                type="number" 
                                className="form-input" 
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <DatePicker 
                                selected={formData.date} 
                                onChange={(date) => setFormData({ ...formData, date: date })}
                                className="form-input"
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                    </div>

                    {type === 'Expense' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select 
                                    className="form-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Payment Method</label>
                                <select 
                                    className="form-input"
                                    value={formData.payment_method}
                                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="UPI">UPI / Google Pay</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Notes (Optional)</label>
                        <textarea 
                            className="form-input" 
                            style={{ height: '80px', paddingTop: '10px' }}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                        <Save size={18} /> {loading ? 'Saving...' : `Save ${type}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;
