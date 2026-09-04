import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  BarChart3, 
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
    const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('summary/');
                setSummary(res.data[0] || res.data);
            } catch (err) {
                console.error('Error fetching summary');
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const chartData = {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'Expenses',
                data: [1200, 1900, 1500, 2100, 1400, 2200, 1800],
                backgroundColor: 'rgba(94, 92, 230, 0.8)',
                borderRadius: 8,
                barThickness: 32,
            },
            {
                label: 'Income',
                data: [3000, 3200, 2800, 3500, 3100, 4000, 3800],
                backgroundColor: 'rgba(52, 199, 89, 0.8)',
                borderRadius: 8,
                barThickness: 32,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { family: 'Inter', weight: '600' }
                }
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#1C1C1E',
                bodyColor: '#1C1C1E',
                borderColor: '#E5E5EA',
                borderWidth: 1,
                padding: 12,
                boxPadding: 8,
                usePointStyle: true,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false }
            },
            y: {
                grid: { color: '#F2F2F7' },
                border: { display: false }
            }
        }
    };

    if (loading) return (
        <div style={{ padding: '80px', textAlign: 'center' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '4px solid var(--primary-soft)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }}
            />
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Compiling your reports...</p>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: '1100px', margin: '0 auto' }}
        >
            <div className="dashboard-header" style={{ marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Financial Reports</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Analyze performance and export raw data.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button 
                        whileHover={{ y: -2 }}
                        className="btn" 
                        style={{ width: 'auto', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', color: 'var(--text-main)', fontWeight: '700' }}
                    >
                        <FileSpreadsheet size={18} /> Export CSV
                    </motion.button>
                    <motion.button 
                        whileHover={{ y: -2 }}
                        className="btn btn-primary" 
                        style={{ width: 'auto' }}
                    >
                        <Download size={18} /> Download All
                    </motion.button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '48px' }}>
                {[
                    { label: 'Total Income', value: summary.total_income, color: 'var(--success)', icon: <TrendingUp size={18} /> },
                    { label: 'Total Expenses', value: summary.total_expense, color: 'var(--danger)', icon: <TrendingDown size={18} /> },
                    { label: 'Net Savings', value: summary.balance, color: 'var(--primary)', icon: <ArrowUpRight size={18} /> },
                ].map((item, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flux-card"
                    >
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>{item.label}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '900', color: item.color }}>${item.value.toLocaleString()}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flux-card" 
                style={{ padding: '40px' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Trend Comparison</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Monthly income vs. expense flow</p>
                    </div>
                    <div style={{ background: '#F2F2F7', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                        <Calendar size={18} color="var(--text-muted)" /> Last 6 Months
                    </div>
                </div>
                
                <div style={{ height: '400px' }}>
                    <Bar data={chartData} options={options} />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Reports;
