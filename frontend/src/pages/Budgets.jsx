import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  PieChart, 
  Plus,
  AlertCircle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

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

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading budgets...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Budgeting</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Set limits and control your spending habits</p>
                </div>
                <button className="btn btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> New Budget
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {budgets.map((budget) => {
                    const percent = Math.min((budget.consumed_amount / budget.limit_amount) * 100, 100);
                    const isOver = budget.consumed_amount > budget.limit_amount;

                    return (
                        <div key={budget.id} style={{ 
                            background: 'white', 
                            padding: '24px', 
                            borderRadius: '16px', 
                            boxShadow: 'var(--shadow)',
                            border: isOver ? '1px solid var(--danger)' : '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '18px' }}>{budget.category_name}</h3>
                                {isOver ? <AlertCircle color="var(--danger)" size={20} /> : <CheckCircle2 color="var(--success)" size={20} />}
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Spent</span>
                                    <span style={{ fontWeight: '600' }}>${budget.consumed_amount} of ${budget.limit_amount}</span>
                                </div>
                                <div style={{ height: '8px', background: '#F2F4F7', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${percent}%`, 
                                        height: '100%', 
                                        background: isOver ? 'var(--danger)' : 'var(--primary)',
                                        transition: 'width 0.5s ease-in-out'
                                    }} />
                                </div>
                            </div>

                            <p style={{ fontSize: '12px', color: isOver ? 'var(--danger)' : 'var(--text-muted)' }}>
                                {isOver ? `Over budget by $${budget.consumed_amount - budget.limit_amount}` : `$${budget.limit_amount - budget.consumed_amount} remaining`}
                            </p>
                        </div>
                    );
                })}
                {budgets.length === 0 && (
                    <div style={{ 
                        gridColumn: '1 / -1', 
                        padding: '60px', 
                        textAlign: 'center', 
                        background: 'white', 
                        borderRadius: '16px',
                        border: '2px dashed var(--border)'
                    }}>
                        <PieChart size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                        <h3>No Budgets Set</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Start by setting a monthly limit for your spending categories.</p>
                        <button className="btn btn-primary" style={{ width: 'auto' }}>Create First Budget</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Budgets;
