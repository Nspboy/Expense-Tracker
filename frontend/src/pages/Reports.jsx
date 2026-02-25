import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  BarChart3, 
  Download, 
  Calendar,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

const Reports = () => {
    const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('summary/');
                setSummary(res.data[0] || res.data); // FinanceSummaryViewSet list returns an object or array
            } catch (err) {
                console.error('Error fetching summary');
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const exportToCSV = () => {
        // Mock CSV export logic
        const csvContent = "data:text/csv;charset=utf-8,Date,Source/Title,Amount,Type\n" 
            + "2024-03-25,Salary,5000,Income\n"
            + "2024-03-24,Rent,1200,Expense";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "financial_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Generating financial reports...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Financial Reports</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Analyze your monthly performance and export data</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={exportToCSV}
                      style={{ 
                        padding: '10px 16px', 
                        background: 'white', 
                        border: '1px solid var(--border)', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}>
                        <FileSpreadsheet size={18} /> Export CSV
                    </button>
                    <button style={{ 
                        padding: '10px 16px', 
                        background: 'white', 
                        border: '1px solid var(--border)', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}>
                        <FileText size={18} /> Export PDF
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Income</p>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--success)' }}>${summary.total_income.toLocaleString()}</h2>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Expenses</p>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--danger)' }}>${summary.total_expense.toLocaleString()}</h2>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Net Savings</p>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>${summary.balance.toLocaleString()}</h2>
                </div>
            </div>

            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
                <BarChart3 size={48} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '16px' }} />
                <h3>Monthly Trend Analysis</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Your spending increased by 12% compared to last month.</p>
                <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '20px' }}>
                    {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                        <div key={i} style={{ 
                            width: '40px', 
                            height: `${h}%`, 
                            background: i === 5 ? 'var(--primary)' : '#E0E0E0', 
                            borderRadius: '8px 8px 0 0' 
                        }} />
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(m => <span key={m} style={{ width: '40px' }}>{m}</span>)}
                </div>
            </div>
        </div>
    );
};

export default Reports;
