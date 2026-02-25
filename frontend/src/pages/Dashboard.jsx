import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

    if (loading) return (
        <div style={{ padding: '80px', textAlign: 'center' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '4px solid var(--primary-soft)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }}
            />
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Structuring your finances...</p>
        </div>
    );

    const stats = [
        { label: 'Total Salary', value: summary.total_income, icon: <Wallet />, color: 'var(--primary)', bg: 'var(--primary-soft)' },
        { label: 'Total Expense', value: summary.total_expense, icon: <TrendingDown />, color: 'var(--danger)', bg: 'var(--danger-soft)' },
        { label: 'Savings', value: summary.balance, icon: <TrendingUp />, color: 'var(--success)', bg: 'var(--success-soft)' },
        { label: 'Monthly Goal', value: 400.00, icon: <LayoutDashboard />, color: 'var(--warning)', bg: 'rgba(255, 149, 0, 0.1)' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}
        >
            <div className="dashboard-header">
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Expense Tracker</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Analyze your financial growth.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/add-transaction')} 
                    className="btn btn-primary" 
                    style={{ width: 'auto' }}
                >
                    <Plus size={20} /> Add Income
                </motion.button>
            </div>

            <div className="flux-grid">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx} 
                        variants={itemVariants}
                        className="flux-card"
                    >
                        <div className="flux-card-icon" style={{ background: stat.bg, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <p className="flux-card-label">{stat.label}</p>
                        <h2 className="flux-card-value">${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', marginTop: '16px' }}>
                <motion.div variants={itemVariants} className="flux-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Latest Entries</h3>
                        <motion.button 
                            whileHover={{ x: 5 }}
                            onClick={() => navigate('/expenses')}
                            style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            See All <ArrowUpRight size={18} />
                        </motion.button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recentExpenses.map((exp) => (
                            <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#F9F9FB' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                        <Clock size={20} color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '15px' }}>{exp.title}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{exp.category_name} • {exp.date}</p>
                                    </div>
                                </div>
                                <p style={{ fontWeight: '800', color: 'var(--danger)', fontSize: '16px' }}>-${exp.amount}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flux-card" style={{ background: 'var(--primary)', color: 'white' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                            <TrendingUp size={24} />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Current Savings</h3>
                        <div style={{ fontSize: '40px', fontWeight: '900' }}>${summary.balance.toLocaleString()}</div>
                    </div>
                    
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '20px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', opacity: 0.9, marginBottom: '8px' }}>Pro Tip</p>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8 }}>You're on track to hit your savings goal this month. Keep it up!</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
