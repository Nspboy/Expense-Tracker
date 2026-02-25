import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('transactions/');
                const expenses = res.data.filter(t => t.add_money === 'Expense');
                
                const categories = {};
                expenses.forEach(e => {
                    categories[e.Category] = (categories[e.Category] || 0) + parseFloat(e.quantity);
                });

                setChartData({
                    labels: Object.keys(categories),
                    datasets: [{
                        data: Object.values(categories),
                        backgroundColor: ['#7F56D9', '#12B76A', '#F04438', '#FDB022', '#667085', '#9E77ED'],
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

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Analyzing your spending...</div>;

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ 
                background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '24px' 
            }}>
                <ArrowLeft size={20} /> Back
            </button>

            <div className="auth-card" style={{ maxWidth: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <PieChart size={24} color="var(--primary)" />
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Spending Patterns</h2>
                </div>

                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    {chartData?.labels.length > 0 ? (
                        <Doughnut data={chartData} options={{ cutout: '70%' }} />
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No expense data to analyze</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
