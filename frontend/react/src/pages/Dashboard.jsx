import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  Search,
  MoreVertical,
  ChevronRight,
  Youtube,
  Cloud,
  Coffee,
  Car,
  Home as HomeIcon,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { CardSkeleton, TableRowSkeleton } from '../components/SkeletonLoader';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [summary, setSummary] = useState({ balance: 0, total_income: 0, total_expense: 0 });
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { ease: 'easeOut', duration: 0.5 }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sumRes, expRes] = await Promise.all([
                    api.get('summary/'),
                    api.get('expenses/')
                ]);
                setSummary(sumRes.data);
                setRecentExpenses(expRes.data.slice(0, 3));
            } catch (err) {
                console.error('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { label: 'Total balance', value: summary.balance, trend: '+12.1%', isUp: true },
        { label: 'Income', value: summary.total_income, trend: '+6.1%', isUp: true },
        { label: 'Expense', value: summary.total_expense, trend: '-2.4%', isUp: false },
        { label: 'Total savings', value: summary.total_savings || 0, trend: '+12.1%', isUp: true },
    ];

    const moneyFlowData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Income',
                data: [10000, 11000, 10500, 13000, 12000, 11000, 10000],
                backgroundColor: '#5E5CE6',
                borderRadius: 4,
                barThickness: 12,
            },
            {
                label: 'Expense',
                data: [7000, 8000, 10000, 9000, 8500, 7000, 6000],
                backgroundColor: '#D1CFFE',
                borderRadius: 4,
                barThickness: 12,
            },
        ],
    };

    const budgetData = {
        labels: ['Cafe', 'Entertainment', 'Investments', 'Food', 'Health', 'Traveling'],
        datasets: [
            {
                data: [15, 10, 20, 30, 10, 15],
                backgroundColor: [
                    '#5E5CE6', '#7B79FF', '#A3A1FF', '#C7C6FF', '#E1E0FF', '#F2F2F7'
                ],
                borderWidth: 0,
                cutout: '75%',
            },
        ],
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="flux-grid">
                {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '6.5fr 3.5fr', gap: '24px' }}>
                <div className="flux-card" style={{ height: '380px' }}>
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                </div>
                <div className="flux-card" style={{ height: '380px' }}>
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                </div>
            </div>
        </div>
    );

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            {/* Top Stat Cards */}
            <div className="flux-grid">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx} 
                        variants={itemVariants}
                        className="flux-card"
                    >
                        <div className="flux-card-header">
                            <span className="flux-card-label" style={{ fontSize: '13px', textTransform: 'none' }}>{stat.label}</span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ArrowUpRight size={16} color="var(--text-main)" />
                            </div>
                        </div>
                        <h2 className="stat-value">${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                        <div style={{ marginTop: '16px' }}>
                            <span className={`trend-badge ${stat.isUp ? 'trend-up' : 'trend-down'}`}>
                                {stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {stat.trend}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px', fontWeight: '600' }}>vs last month</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Middle Row: Money Flow & Budget */}
            <div style={{ display: 'grid', gridTemplateColumns: '6.5fr 3.5fr', gap: '24px' }}>
                {/* Money Flow */}
                <div className="flux-card">
                    <div className="flux-card-header" style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Money flow</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5E5CE6' }} /> Income
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D1CFFE' }} /> Expense
                            </div>
                            <select style={{ border: 'none', background: '#F2F2F7', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                                <option>All accounts</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Bar 
                            data={moneyFlowData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { 
                                    x: { grid: { display: false }, border: { display: false } },
                                    y: { grid: { color: '#F2F2F7' }, border: { display: false }, ticks: { stepSize: 5000 } }
                                }
                            }} 
                        />
                    </div>
                </div>

                {/* Budget Donut */}
                <div className="flux-card">
                    <div className="flux-card-header" style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Budget</h3>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                    <div style={{ position: 'relative', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Doughnut 
                            data={budgetData}
                            options={{ plugins: { legend: { display: false } }, cutout: '75%' }}
                        />
                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Total for month</p>
                            <h3 style={{ fontSize: '24px', fontWeight: '900' }}>$5,950</h3>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                        {['Cafe', 'Entertainment', 'Food', 'Travel'].map((cat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: budgetData.datasets[0].backgroundColor[i] }} /> {cat}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Transactions & Goals */}
            <div style={{ display: 'grid', gridTemplateColumns: '6.5fr 3.5fr', gap: '24px' }}>
                {/* Recent Transactions */}
                <div className="flux-card">
                    <div className="flux-card-header" style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Recent transactions</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <select style={{ border: 'none', background: '#F2F2F7', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                <option>All accounts</option>
                            </select>
                            <button onClick={() => navigate('/expenses')} style={{ border: 'none', background: '#F2F2F7', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>See all</button>
                        </div>
                    </div>
                    <table className="flux-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Payment Name</th>
                                <th>Method</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentExpenses.length > 0 ? recentExpenses.map((exp) => (
                                <tr key={exp.id}>
                                    <td style={{ fontSize: '13px', fontWeight: '600' }}>{new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                                    <td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--danger-text)' }}>-${exp.amount}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '28px', height: '28px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                {exp.title.toLowerCase().includes('youtube') ? <Youtube size={16} color="#FF0000" /> : <Cloud size={16} color="var(--primary)" />}
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: '700' }}>{exp.title}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Mastercard **{Math.floor(Math.random() * 9000) + 1000}</td>
                                    <td>
                                        <span style={{ fontSize: '13px', fontWeight: '700' }}>{exp.category_name}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No recent transactions</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Saving Goals */}
                <div className="flux-card">
                    <div className="flux-card-header" style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Saving goals</h3>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {[
                            { label: 'MacBook Pro', current: 412, target: 1650, progress: 25 },
                            { label: 'New car', current: 25200, target: 60000, progress: 42 },
                            { label: 'New house', current: 4500, target: 150000, progress: 3 },
                        ].map((goal, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{goal.label}</span>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>${goal.target.toLocaleString()}</span>
                                </div>
                                <div style={{ width: '100%', height: '14px', background: '#F2F2F7', borderRadius: '10px', overflow: 'hidden' }}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goal.progress}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        style={{ height: '100%', background: 'var(--primary)', borderRadius: '10px' }}
                                    />
                                </div>
                                <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', marginTop: '6px' }}>{goal.progress}%</p>
                            </div>
                        ))}
                        <button style={{ marginTop: '12px', padding: '12px', borderRadius: '16px', border: '2px dashed var(--border)', background: 'transparent', color: 'var(--text-muted)', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Plus size={16} /> Add new goal
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
