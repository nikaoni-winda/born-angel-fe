import React, { useState, useEffect, useCallback } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import reportService from '../../services/reportService';
import { withMinDelay } from '../../utils/loadingUtils';
import {
    TrendingUp, Users, DollarSign, Activity,
    PieChart as PieIcon, Trophy,
    ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminFilterDropdown from '../../components/admin/AdminFilterDropdown';

// ─── CONSTANTS ──────────────────────────────────────────────────
const PIE_COLORS = ['#cf6a86', '#5b1824', '#e4b6d0', '#8884d8', '#82ca9d'];
const BAR_COLORS = ['#f59e0b', '#cf6a86', '#5b1824', '#8884d8', '#82ca9d'];

const TABS = [
    { key: 'financial', label: 'Financial Overview', icon: <DollarSign size={16} /> },
    { key: 'instructors', label: 'Instructor Performance', icon: <Trophy size={16} /> },
    { key: 'services', label: 'Services & Classes', icon: <PieIcon size={16} /> },
];

// ─── CUSTOM BAR TOOLTIP ─────────────────────────────────────────
const InstructorTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-polar-night/5 min-w-[200px]">
            <p className="font-bold text-polar-night text-sm mb-2">{d.name}</p>
            <div className="space-y-1 text-xs text-text-primary/60">
                <p>Revenue: <span className="font-bold text-polar-night">IDR {d.totalRevenue?.toLocaleString()}</span></p>
                <p>Bookings: <span className="font-bold text-polar-night">{d.totalBookings}</span></p>
                <p>Classes: <span className="font-bold text-polar-night">{d.totalClasses}</span></p>
                <p>Occupancy: <span className="font-bold text-polar-night">{d.occupancyRate}%</span></p>
            </div>
        </div>
    );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────
const SuperAdminDashboard = () => {
    // ── Shared State ──
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('financial');

    // ── KPI State (always loaded) ──
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [kpi, setKpi] = useState({
        occupancyRate: 0, cancellationRate: 0,
        totalInstructors: 0, totalUsers: 0, activeClassesToday: 0
    });

    // ── Financial Tab State ──
    const [revenueData, setRevenueData] = useState([]);
    const [revenuePeriod, setRevenuePeriod] = useState('monthly');

    // ── Instructor Tab State ──
    const [instructorData, setInstructorData] = useState([]);
    const [instructorLoading, setInstructorLoading] = useState(false);
    const [instructorLoaded, setInstructorLoaded] = useState(false);

    // ── Services Tab State ──
    const [servicePerformance, setServicePerformance] = useState([]);
    const [peakHoursData, setPeakHoursData] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [servicesLoaded, setServicesLoaded] = useState(false);

    // Period options for dropdown
    const periodOptions = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ];

    // Initial data load for KPIs
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                // Wrap the entire Promise.all with minDelay
                const [kpiData, totalRev] = await withMinDelay(Promise.all([
                    reportService.getKpiMetrics(),
                    reportService.getTotalRevenue()
                ]));

                setKpi(kpiData);
                setTotalRevenue(totalRev.totalRevenue);
            } catch (error) {
                toast.error('Failed to load initial dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch revenue data based on period
    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const data = await reportService.getRevenueTrend(revenuePeriod);
                setRevenueData(data);
            } catch (error) {
                toast.error('Failed to load revenue data.');
            }
        };
        fetchRevenueData();
    }, [revenuePeriod]);

    // Lazy-load Instructor data (only when tab clicked)
    const fetchInstructorData = useCallback(async () => {
        if (instructorLoaded) return;
        try {
            setInstructorLoading(true);
            const data = await reportService.getInstructorPerformance();
            setInstructorData(data);
            setInstructorLoaded(true);
        } catch (error) {
            toast.error('Failed to load instructor data.');
        } finally {
            setInstructorLoading(false);
        }
    }, [instructorLoaded]);

    // Lazy-load Services data (only when tab clicked)
    const fetchServicesData = useCallback(async () => {
        if (servicesLoaded) return;
        try {
            setServicesLoading(true);
            const [servData, peakData] = await Promise.all([
                reportService.getServicePerformance(),
                reportService.getPeakHours()
            ]);
            setServicePerformance(servData);
            setPeakHoursData(peakData);
            setServicesLoaded(true);
        } catch (error) {
            toast.error('Failed to load services data.');
        } finally {
            setServicesLoading(false);
        }
    }, [servicesLoaded]);

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        if (tabKey === 'instructors') {
            fetchInstructorData();
        } else if (tabKey === 'services') {
            fetchServicesData();
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
                    <p className="text-text-primary/40 text-[0.85rem] italic font-medium">Loading...</p>
                </div>
            </AdminLayout>
        );
    }
    return (
        <AdminLayout>
            {/* ── Header ────────────────────────────────────── */}
            <div className="mb-8">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Executive Overview</span>
                <h1 className="text-3xl font-black text-polar-night mt-1">Business Intelligence Dashboard</h1>
            </div>

            {/* ── STATIC AREA: KPI Cards ─────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-polar-night/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                            <ArrowUpRight size={14} /> +Growth
                        </span>
                    </div>
                    <p className="text-text-primary/40 text-xs font-bold uppercase tracking-widest">Total Revenue</p>
                    <h3 className="text-2xl font-black text-polar-night mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                        IDR {parseInt(totalRevenue).toLocaleString()}
                    </h3>
                </div>

                {/* Occupancy Rate */}
                <div className="bg-white p-6 rounded-[2rem] border border-polar-night/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-frost-byte/10 text-frost-byte flex items-center justify-center">
                            <Activity size={24} />
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${kpi.occupancyRate > 70 ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'}`}>
                            {kpi.occupancyRate}% Rate
                        </span>
                    </div>
                    <p className="text-text-primary/40 text-xs font-bold uppercase tracking-widest">Class Occupancy</p>
                    <h3 className="text-2xl font-black text-polar-night mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                        {kpi.occupancyRate}%
                    </h3>
                </div>

                {/* Active Users */}
                <div className="bg-white p-6 rounded-[2rem] border border-polar-night/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-polar-night/5 text-polar-night flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-polar-night bg-polar-night/5 px-2 py-1 rounded-lg">
                            {kpi.totalUsers} Total
                        </span>
                    </div>
                    <p className="text-text-primary/40 text-xs font-bold uppercase tracking-widest">Customer Base</p>
                    <h3 className="text-2xl font-black text-polar-night mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                        {kpi.totalUsers} Clients
                    </h3>
                </div>

                {/* Cancellation Rate */}
                <div className="bg-white p-6 rounded-[2rem] border border-polar-night/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                            <TrendingUp size={24} className="rotate-180" />
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${kpi.cancellationRate < 10 ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
                            {kpi.cancellationRate}% Rate
                        </span>
                    </div>
                    <p className="text-text-primary/40 text-xs font-bold uppercase tracking-widest">Cancellations</p>
                    <h3 className="text-2xl font-black text-polar-night mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                        {kpi.cancellationRate}%
                    </h3>
                </div>
            </div>

            {/* ── TAB NAVIGATION (Pills) ─────────────────────── */}
            <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-polar-night/5 shadow-sm w-full">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-none cursor-pointer
                            ${activeTab === tab.key
                                ? 'bg-polar-night text-white shadow-md'
                                : 'bg-transparent text-text-primary/40 hover:text-polar-night hover:bg-frozen/50'
                            }`}
                    >
                        {tab.icon}
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ═══════════════════════════════════════════════════ */}
            {/* DYNAMIC AREA: Content changes based on active tab  */}
            {/* ═══════════════════════════════════════════════════ */}

            {/* ── TAB: Financial Overview ─────────────────────── */}
            {activeTab === 'financial' && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-polar-night/5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-polar-night flex items-center gap-2">
                                <TrendingUp size={20} className="text-emerald-500" /> Revenue Trends
                            </h3>
                            <p className="text-xs text-text-primary/40 font-medium mt-1">Financial performance over time</p>
                        </div>
                        <AdminFilterDropdown
                            options={periodOptions}
                            value={revenuePeriod}
                            onChange={setRevenuePeriod}
                            placeholder="Select Period"
                        />
                    </div>

                    <div className="h-[380px] w-full">
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#cf6a86" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#cf6a86" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        tickFormatter={(value) => `IDR ${(value / 1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                        formatter={(value) => [`IDR ${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#cf6a86"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-text-primary/30 text-sm font-medium">
                                No revenue data available for this period.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── TAB: Instructor Performance ────────────────── */}
            {activeTab === 'instructors' && (
                <div className="space-y-8">
                    {instructorLoading ? (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-polar-night/5 shadow-sm flex items-center justify-center min-h-[400px]">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                                <p className="text-text-primary/40 text-sm font-medium">Loading instructor data...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Bar Chart: Top Instructors by Revenue */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-polar-night/5 shadow-sm">
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-polar-night flex items-center gap-2">
                                        <Trophy size={20} className="text-amber-500" /> Top Instructors by Revenue
                                    </h3>
                                    <p className="text-xs text-text-primary/40 font-medium mt-1">
                                        Revenue generated per instructor from confirmed bookings
                                    </p>
                                </div>

                                <div className="h-[380px] w-full">
                                    {instructorData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={instructorData.slice(0, 8)}
                                                layout="vertical"
                                                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                                <XAxis
                                                    type="number"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                                    tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#5b1824', fontSize: 13, fontWeight: 600 }}
                                                    width={120}
                                                />
                                                <Tooltip content={<InstructorTooltip />} cursor={{ fill: 'rgba(207,106,134,0.06)' }} />
                                                <Bar dataKey="totalRevenue" radius={[0, 12, 12, 0]} barSize={28}>
                                                    {instructorData.slice(0, 8).map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-text-primary/30 text-sm font-medium">
                                            No instructor performance data available.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Instructor Details Table */}
                            {instructorData.length > 0 && (
                                <div className="bg-white p-8 rounded-[2.5rem] border border-polar-night/5 shadow-sm">
                                    <h3 className="text-lg font-bold text-polar-night mb-6">Instructor Detail Breakdown</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                                            <thead>
                                                <tr className="border-b border-polar-night/10">
                                                    <th className="py-3 px-4 text-left text-xs font-bold text-text-primary/40 uppercase tracking-widest">Rank</th>
                                                    <th className="py-3 px-4 text-left text-xs font-bold text-text-primary/40 uppercase tracking-widest">Instructor</th>
                                                    <th className="py-3 px-4 text-right text-xs font-bold text-text-primary/40 uppercase tracking-widest">Revenue</th>
                                                    <th className="py-3 px-4 text-right text-xs font-bold text-text-primary/40 uppercase tracking-widest">Bookings</th>
                                                    <th className="py-3 px-4 text-right text-xs font-bold text-text-primary/40 uppercase tracking-widest">Classes</th>
                                                    <th className="py-3 px-4 text-right text-xs font-bold text-text-primary/40 uppercase tracking-widest">Occupancy</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {instructorData.map((inst, index) => (
                                                    <tr key={inst.id} className="border-b border-polar-night/5 hover:bg-frozen/20 transition-colors">
                                                        <td className="py-4 px-4">
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white 
                                                                ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-polar-night/20 text-polar-night'}`}>
                                                                {index + 1}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 font-bold text-polar-night">{inst.name}</td>
                                                        <td className="py-4 px-4 text-right font-bold text-emerald-600">IDR {inst.totalRevenue?.toLocaleString()}</td>
                                                        <td className="py-4 px-4 text-right text-text-primary/60">{inst.totalBookings}</td>
                                                        <td className="py-4 px-4 text-right text-text-primary/60">{inst.totalClasses}</td>
                                                        <td className="py-4 px-4 text-right">
                                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold 
                                                                ${inst.occupancyRate > 70 ? 'text-emerald-500 bg-emerald-50' : inst.occupancyRate > 30 ? 'text-amber-500 bg-amber-50' : 'text-rose-500 bg-rose-50'}`}>
                                                                {inst.occupancyRate}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ── TAB: Services & Classes ─────────────────────── */}
            {activeTab === 'services' && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-polar-night/5 shadow-sm">
                    {servicesLoading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte"></div>
                                <p className="text-text-primary/40 text-sm font-medium">Loading services data...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left Col: Service Distribution */}
                            <div className="flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-polar-night flex items-center gap-2">
                                        <PieIcon size={20} className="text-frost-byte" /> Revenue by Service
                                    </h3>
                                    <p className="text-xs text-text-primary/40 font-medium mt-1">Revenue share by class category</p>
                                </div>

                                <div className="h-[280px] w-full mb-6">
                                    {servicePerformance.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={servicePerformance}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {servicePerformance.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => `IDR ${value.toLocaleString()}`} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-text-primary/30 text-sm font-medium">
                                            No service data available.
                                        </div>
                                    )}
                                </div>

                                {/* Legend Compact */}
                                <div className="grid grid-cols-1 gap-2">
                                    {servicePerformance.slice(0, 4).map((entry, index) => (
                                        <div key={index} className="flex items-center justify-between text-xs px-3 py-2 bg-frozen/20 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                                                <span className="font-bold text-polar-night">{entry.name}</span>
                                            </div>
                                            <span className="font-bold text-polar-night">{totalRevenue > 0 ? ((entry.value / totalRevenue) * 100).toFixed(1) : 0}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Col: Weekly Traffic (Peak Hours) */}
                            <div className="flex flex-col h-full">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-polar-night flex items-center gap-2">
                                        <Activity size={20} className="text-amber-500" /> Weekly Traffic
                                    </h3>
                                    <p className="text-xs text-text-primary/40 font-medium mt-1">Peak hours analysis by day of week</p>
                                </div>

                                <div className="h-[350px] w-full bg-frozen/10 rounded-3xl p-4 flex-grow">
                                    {peakHoursData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={peakHoursData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="day"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'rgba(255,255,255,0.5)' }}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
                                                />
                                                <Bar dataKey="bookings" radius={[6, 6, 0, 0]} barSize={32}>
                                                    {peakHoursData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.bookings > 10 ? '#cf6a86' : '#e4b6d0'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-text-primary/30 text-sm font-medium">
                                            No traffic data available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── CTA: Export Banner ──────────────────────────── */}
            <div className="bg-polar-night rounded-[2.5rem] p-8 text-white relative overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2 text-white">Need a custom report?</h3>
                        <p className="text-white/70 text-sm max-w-lg">
                            We can generate detailed CSV exports for tax purposes or deeper analysis. Contact the IT support team to request specific data dumps.
                        </p>
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
};

export default SuperAdminDashboard;
