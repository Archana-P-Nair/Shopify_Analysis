import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign } from 'lucide-react';

function Dashboard() {
    const [stats, setStats] = useState({ totalCustomers: 0, totalOrders: 0, totalRevenue: 0 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, chartRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/dashboard/orders-trend')
                ]);
                setStats(statsRes.data);
                setChartData(chartRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;

    if (!stats) {
        return (
            <div className="p-8">
                <h2 className="page-title">Dashboard</h2>
                <p>Please select a store from the <Link to="/stores" style={{ color: '#4f46e5' }}>Stores</Link> page.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="page-title">Dashboard</h2>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="icon-wrapper icon-blue">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="stat-label">Total Customers</p>
                        <p className="stat-value">{stats.totalCustomers}</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="icon-wrapper icon-green">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="stat-label">Total Orders</p>
                        <p className="stat-value">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="icon-wrapper icon-purple">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="stat-label">Total Revenue</p>
                        <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="card">
                <h3 className="section-title">Orders Trend</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
