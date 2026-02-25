import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Wallet, TrendingUp, TrendingDown, Clock, Plus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [summary, setSummary] = useState({ balance: 0, total_income: 0, total_expense: 0 });
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sumRes, expRes] = await Promise.all([
                    api.get('summary/'),
                    api.get('expenses/')
                ]);
                setSummary(sumRes.data);
                setRecentExpenses(expRes.data.slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your financial overview...</div>;

    const cards = [
        { title: 'Total Balance', amount: summary.balance, icon: <Wallet size={20} />, color: 'var(--primary)', bg: '#F4EBFF' },
        { title: 'Monthly Income', amount: summary.total_income, icon: <TrendingUp size={20} />, color: 'var(--success)', bg: '#ECFDF3' },
        { title: 'Monthly Expenses', amount: summary.total_expense, icon: <TrendingDown size={20} />, color: 'var(--danger)', bg: '#FFF1F3' },
    ];

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Welcome Back!</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your money today.</p>
                </div>
                <button onClick={() => navigate('/add-transaction')} className="btn btn-primary" style={{ width: 'auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> Add Transaction
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {cards.map((card) => (
                    <div key={card.title} className="summary-card" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ background: card.bg, padding: '12px', borderRadius: '12px', color: card.color }}>
                                {card.icon}
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>{card.title}</p>
                        <h2 style={{ fontSize: '28px', fontWeight: '800' }}>${card.amount.toLocaleString()}</h2>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Expenses</h3>
                        <Link to="/expenses" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div>
                        {recentExpenses.map((exp) => (
                            <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ width: '44px', height: '44px', background: '#F9FAFB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock size={20} color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', fontSize: '15px' }}>{exp.title}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{exp.category_name} • {exp.date}</p>
                                    </div>
                                </div>
                                <p style={{ fontWeight: '700', color: 'var(--danger)', fontSize: '16px' }}>-${exp.amount}</p>
                            </div>
                        ))}
                        {recentExpenses.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No recent expenses found.</p>}
                    </div>
                </div>

                <div style={{ background: 'var(--primary)', borderRadius: '20px', padding: '32px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Pro Tip</h3>
                        <p style={{ opacity: 0.9, fontSize: '15px', lineHeight: '1.6' }}>You've spent 85% of your Dining budget this month. Try to cook at home more often to stay within your limits!</p>
                    </div>
                    <button onClick={() => navigate('/budgets')} style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '24px' }}>
                        Check Budgets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
