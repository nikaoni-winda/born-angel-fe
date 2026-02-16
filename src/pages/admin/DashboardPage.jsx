import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';
import { withMinDelay } from '../../utils/loadingUtils';
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Consistent delay for premium feel
      const stats = await withMinDelay(adminService.getStats());
      setData(stats);
    } catch (error) {
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
          <p className="text-text-primary/30 text-[0.85rem] italic font-medium">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `IDR ${data?.stats.total_revenue?.toLocaleString() || 0}`,
      icon: <DollarSign size={24} />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      trend: 'Direct Growth',
      superOnly: true
    },
    {
      label: 'Total Bookings',
      value: data?.stats.total_bookings,
      icon: <ShoppingBag size={24} />,
      color: 'text-frost-byte',
      bg: 'bg-frozen/20',
      trend: `${data?.stats.confirmed_bookings} confirmed`
    },
    {
      label: 'Active Users',
      value: data?.stats.total_users,
      icon: <Users size={24} />,
      color: 'text-polar-night',
      bg: 'bg-polar-night/5',
      trend: 'Customers'
    },
    {
      label: 'Upcoming Classes',
      value: data?.stats.upcoming_classes,
      icon: <Calendar size={24} />,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      trend: 'Across Academy'
    }
  ].filter(card => !card.superOnly || isSuperAdmin);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[0.65rem] text-text-primary/40 font-black uppercase tracking-[0.2em]">
            {isSuperAdmin ? 'Real-time Operations' : 'Academic Management'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-polar-night">
          {isSuperAdmin ? 'Command' : 'Operational'}{' '}
          <span className="italic font-light text-frost-byte">Center</span>
        </h1>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isSuperAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 mb-10`}>
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-polar-night/5 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-inner`}>
              {stat.icon}
            </div>
            <p className="text-text-primary/40 text-[0.7rem] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-polar-night mb-2">{stat.value}</h3>
            <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-text-primary/30 uppercase tracking-wider">
              <TrendingUp size={12} className={stat.color} />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-polar-night/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-polar-night/5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-polar-night">Recent Transactions</h3>
              <p className="text-[0.75rem] text-text-primary/30 font-medium">The latest bookings across all services</p>
            </div>
            <Link to={ROUTES.ADMIN_BOOKINGS} className="p-2 border border-polar-night/5 rounded-xl hover:bg-frozen/50 transition-colors">
              <ArrowRight size={20} className="text-polar-night/30" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-frozen/20">
                <tr>
                  <th className="px-8 py-4 text-[0.65rem] font-black uppercase tracking-widest text-text-primary/30">User</th>
                  <th className="px-8 py-4 text-[0.65rem] font-black uppercase tracking-widest text-text-primary/30">Service</th>
                  <th className="px-8 py-4 text-[0.65rem] font-black uppercase tracking-widest text-text-primary/30">Amount</th>
                  <th className="px-8 py-4 text-[0.65rem] font-black uppercase tracking-widest text-text-primary/30">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-night/5">
                {data?.recent_bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-frozen/10 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-polar-night/5 flex items-center justify-center font-bold text-[0.7rem] text-polar-night shrink-0">
                          {booking.user?.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-polar-night truncate">{booking.user?.name}</p>
                          <p className="text-[0.65rem] text-text-primary/30 truncate">{booking.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-polar-night">{booking.schedule?.service?.name}</p>
                      <p className="text-[0.65rem] text-text-primary/30 italic">Target Session</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-polar-night">IDR {parseInt(booking.total_price).toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`
                                                px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest
                                                ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                            'bg-red-100 text-red-600'}
                                            `}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Performance / Popular Services - Super Admin Only */}
          {isSuperAdmin && (
            <div className="bg-polar-night rounded-[2.5rem] p-8 text-white shadow-xl shadow-polar-night/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-frost-byte" /> Best Performers
              </h3>
              <div className="space-y-6">
                {data?.popular_services?.map((service, idx) => (
                  <div key={idx} className="relative z-10">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-medium text-white/90 truncate pr-4">{service.name}</p>
                      <p className="text-[0.7rem] font-black text-frost-byte uppercase tracking-widest">{service.total_bookings} Bookings</p>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-frost-byte rounded-full"
                        style={{ width: `${(service.total_bookings / data?.popular_services[0].total_bookings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 bg-white/10 border border-white/10 hover:bg-white/20 rounded-2xl text-[0.75rem] font-bold transition-all flex items-center justify-center gap-2">
                View Performance Report <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Quick Access */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-polar-night/5 shadow-sm">
            <h3 className="text-lg font-bold text-polar-night mb-6">Quick Operations</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to={ROUTES.ADMIN_USERS_CREATE} className="p-4 bg-frozen/20 rounded-2xl flex flex-col gap-2 hover:bg-frost-byte group transition-all no-underline">
                <Users size={20} className="text-polar-night group-hover:text-white" />
                <span className="text-[0.7rem] font-bold text-polar-night group-hover:text-white">Create Staff</span>
              </Link>
              <Link to={ROUTES.ADMIN_SCHEDULES_CREATE} className="p-4 bg-frozen/20 rounded-2xl flex flex-col gap-2 hover:bg-frost-byte group transition-all no-underline">
                <Calendar size={20} className="text-polar-night group-hover:text-white" />
                <span className="text-[0.7rem] font-bold text-polar-night group-hover:text-white">New Schedule</span>
              </Link>
              <Link to={ROUTES.ADMIN_SERVICES_CREATE} className="p-4 bg-frozen/20 rounded-2xl flex flex-col gap-2 hover:bg-frost-byte group transition-all no-underline">
                <ShoppingBag size={20} className="text-polar-night group-hover:text-white" />
                <span className="text-[0.7rem] font-bold text-polar-night group-hover:text-white">Add Service</span>
              </Link>
              <Link to={ROUTES.ADMIN_INSTRUCTORS_CREATE} className="p-4 bg-frozen/20 rounded-2xl flex flex-col gap-2 hover:bg-frost-byte group transition-all no-underline">
                <Briefcase size={20} className="text-polar-night group-hover:text-white" />
                <span className="text-[0.7rem] font-bold text-polar-night group-hover:text-white">Add Instructor</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
