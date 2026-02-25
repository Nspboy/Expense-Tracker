import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Filter, 
  Search, 
  ArrowUpDown, 
  MoreVertical, 
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

    const filteredExpenses = expenses.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading expenses...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Expense Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Track and control your spending</p>
                </div>
                <button 
                  onClick={() => navigate('/add-transaction')}
                  className="btn btn-primary" 
                  style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={20} /> Add Expense
                </button>
            </div>

            <div style={{ 
                background: 'white', 
                padding: '16px', 
                borderRadius: '12px', 
                boxShadow: 'var(--shadow)',
                marginBottom: '24px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search expenses..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 14px 10px 40px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            outline: 'none'
                        }}
                    />
                </div>
                <button style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '10px 16px', 
                    background: 'white', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500'
                }}>
                    <Filter size={18} /> Filter
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F9FAFB', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Transaction</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Category</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
                            <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Amount</th>
                            <th style={{ padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((exp) => (
                            <tr key={exp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{exp.title}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{exp.payment_method}</p>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{ 
                                      background: '#F4EBFF', 
                                      color: 'var(--primary)', 
                                      padding: '4px 12px', 
                                      borderRadius: '16px', 
                                      fontSize: '12px', 
                                      fontWeight: '600' 
                                    }}>
                                        {exp.category_name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                    {exp.date}
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '700', color: 'var(--danger)' }}>
                                    -${exp.amount}
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredExpenses.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No expenses found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Expenses;
