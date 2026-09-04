import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChart, ArrowLeft, TrendingUp, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('expenses/');
                const categories = {};
                res.data.forEach(e => {
                    categories[e.category_name] = (categories[e.category_name] || 0) + parseFloat(e.amount);
                });

                setChartData({
                    labels: Object.keys(categories),
                    datasets: [{
                        data: Object.values(categories),
                        backgroundColor: ['#5E5CE6', '#34C759', '#FF3B30', '#FF9500', '#AF52DE', '#5856D6'],
                        hoverOffset: 12,
                        borderWidth: 0,
                    }]
                });
            } catch (err) {
                console.error('Failed to fetch analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const options = {
        cutout: '75%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 24,
                    font: {
                        family: 'Inter',
                        weight: '600',
                        size: 13
                    },
                    color: '#8E8E93'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1C1C1E',
                bodyColor: '#1C1C1E',
                borderColor: '#E5E5EA',
                borderWidth: 1,
                padding: 12,
                boxPadding: 8,
                usePointStyle: true,
                callbacks: {
                    label: (context) => ` $${context.parsed.toLocaleString()}`
                }
            }
        },
        maintainAspectRatio: false
    };

    if (loading) return (
        <div style={{ padding: '80px', textAlign: 'center' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '4px solid var(--primary-soft)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }}
            />
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Aggregating patterns...</p>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}
        >
            <div className="dashboard-header" style={{ marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Analytics</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Deep dive into your spending.</p>
                </div>
                <motion.button 
                    whileHover={{ x: -4 }}
                    onClick={() => navigate(-1)} 
                    style={{ 
                        background: 'white', 
                        border: '1px solid var(--border)', 
                        padding: '12px 20px', 
                        borderRadius: 'var(--radius-md)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer', 
                        color: 'var(--text-main)',
                        fontWeight: '700',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <ArrowLeft size={20} /> History
                </motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                <div className="flux-card" style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Spending Split</h3>
                        <Info size={18} color="var(--text-muted)" />
                    </div>
                    
                    <div style={{ height: '320px', position: 'relative' }}>
                        {chartData?.labels.length > 0 ? (
                            <Doughnut data={chartData} options={options} />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <PieChart size={48} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: '16px' }} />
                                <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Insufficient data</p>
                            </div>
                        )}
                        {chartData?.labels.length > 0 && (
                            <div style={{ 
                                position: 'absolute', 
                                top: '44%', 
                                left: '50%', 
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                pointerEvents: 'none'
                             }}>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total</p>
                                <p style={{ fontSize: '24px', fontWeight: '900' }}>
                                    ${chartData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="flux-card" style={{ background: 'var(--primary)', color: 'white' }}>
                        <TrendingUp size={32} style={{ marginBottom: '20px' }} />
                        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Optimization Path</h4>
                        <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.6' }}>Based on your last 30 days, reallocating 10% of "Entertainment" to "Savings" would increase your yearly wealth by $4,200.</p>
                    </div>

                    <div className="flux-card">
                        <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Category Breakdown</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {chartData?.labels.map((label, i) => {
                                const val = chartData.datasets[0].data[i];
                                const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
                                const perc = (val / total) * 100;
                                return (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
                                            <span style={{ color: 'var(--text-main)' }}>{label}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>{perc.toFixed(1)}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: '#F2F2F7', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${perc}%`, background: chartData.datasets[0].backgroundColor[i] }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
