import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  TrendingUp, 
  Download,
  Calendar,
  MoreVertical,
  Plus,
  DollarSign
} from 'lucide-react';

const IncomePage = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading income records...</div>;

    const totalIncome = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Income Overview</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Monitor your earnings and sources</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ 
                        padding: '10px 16px', 
                        background: 'white', 
                        border: '1px solid var(--border)', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <Download size={18} /> Export
                    </button>
                    <button className="btn btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={20} /> Add Income
                    </button>
                </div>
            </div>

            <div style={{ 
                background: 'var(--primary)', 
                padding: '32px', 
                borderRadius: '16px', 
                color: 'white',
                marginBottom: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <p style={{ opacity: 0.8, fontSize: '14px', marginBottom: '4px' }}>Total Earnings (All Time)</p>
                    <h2 style={{ fontSize: '32px', fontWeight: '800' }}>${totalIncome.toLocaleString()}</h2>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px' }}>
                    <TrendingUp size={32} />
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: '700' }}>Recent Deposits</h3>
                    <Calendar size={18} color="var(--text-muted)" />
                </div>
                {incomes.map((inc) => (
                    <div key={inc.id} style={{ 
                        padding: '16px 24px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: '#ECFDF3', padding: '10px', borderRadius: '10px' }}>
                                <DollarSign size={20} color="var(--success)" />
                            </div>
                            <div>
                                <p style={{ fontWeight: '600' }}>{inc.source}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inc.date}</p>
                            </div>
                        </div>
                        <p style={{ fontWeight: '700', color: 'var(--success)' }}>
                            +${inc.amount}
                        </p>
                    </div>
                ))}
                {incomes.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No income records found
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncomePage;
