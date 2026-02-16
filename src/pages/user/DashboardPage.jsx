import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/layout/UserLayout';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../services/bookingService';
import { withMinDelay } from '../../utils/loadingUtils';
import {
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Star,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Add consistent delay
        const response = await withMinDelay(bookingService.getAll({ per_page: 100 }));
        const items = response.data || [];
        setBookings(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Derived Data
  const upcomingBooking = bookings
    .filter(b => b.status === 'confirmed' && new Date(b.schedule?.start_time) > new Date())
    .sort((a, b) => new Date(a.schedule?.start_time) - new Date(b.schedule?.start_time))[0];

  const pendingReviews = bookings.filter(b =>
    b.status === 'confirmed' &&
    new Date(b.schedule?.end_time) < new Date() &&
    !b.review
  );

  const stats = [
    {
      label: 'Total Sessions',
      value: bookings.length,
      icon: <Calendar size={20} className="text-frost-byte" />,
      bg: 'bg-frost-byte/5',
      link: `${ROUTES.MY_BOOKINGS}?filter=all`
    },
    {
      label: 'Need Payment',
      value: bookings.filter(b => b.status === 'pending').length,
      icon: <CreditCard size={20} className="text-amber-500" />,
      bg: 'bg-amber-500/5',
      link: `${ROUTES.MY_BOOKINGS}?filter=pending`
    },
    {
      label: 'Confirmed',
      value: bookings.filter(b => b.status === 'confirmed').length,
      icon: <CheckCircle2 size={20} className="text-emerald-500" />,
      bg: 'bg-emerald-500/5',
      link: `${ROUTES.MY_BOOKINGS}?filter=confirmed`
    }
  ];

  if (loading) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
          <p className="text-text-primary/40 text-[0.85rem] italic font-medium">Loading...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto py-4">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl text-polar-night font-bold mb-1">
              Hello, <span className="text-frost-byte">{user?.name}</span>
            </h1>
            <p className="text-text-primary/50 font-normal text-[0.95rem]">
              Manage your bookings and beauty academy progress.
            </p>
          </div>
          <Link
            to={ROUTES.BROWSE_CLASSES}
            className="inline-flex items-center gap-2 px-7 py-3 bg-polar-night text-white rounded-xl font-bold no-underline shadow-sm hover:bg-frost-byte transition-all duration-300"
          >
            <ShoppingBag size={18} />
            Book a Class
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Link
              key={i}
              to={stat.link}
              className="bg-white p-6 rounded-2xl border border-polar-night/5 shadow-sm flex items-center gap-5 transition-all hover:shadow-md no-underline"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[0.65rem] text-text-primary/30 uppercase font-black tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-polar-night">{stat.value}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Upcoming Session Card */}
            <section className="bg-white p-7 rounded-3xl border border-polar-night/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-polar-night font-bold flex items-center gap-2">
                  <Clock size={18} className="text-frost-byte" /> Upcoming Session
                </h3>
                {upcomingBooking && (
                  <Link to={`${ROUTES.MY_BOOKINGS}?filter=confirmed`} className="text-[0.7rem] text-frost-byte font-black uppercase tracking-widest hover:underline no-underline">
                    View All
                  </Link>
                )}
              </div>

              {upcomingBooking ? (
                <div className="flex flex-col md:flex-row gap-6 p-5 bg-frozen/20 rounded-2xl border border-white/50 border-dashed">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm border border-white">
                    <img
                      src={upcomingBooking.schedule?.service?.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-[0.65rem] text-frost-byte font-black uppercase tracking-[0.15em] mb-1">
                      <span>{new Date(upcomingBooking.schedule?.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
                    </div>
                    <h4 className="text-xl font-bold text-polar-night mb-2">
                      {upcomingBooking.schedule?.service?.name}
                    </h4>
                    <div className="flex items-center gap-4 text-[0.8rem] text-text-primary/60">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{new Date(upcomingBooking.schedule?.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-frost-byte" />
                        <span>{upcomingBooking.schedule?.instructor?.user?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-frozen/10 rounded-2xl border border-dashed border-polar-night/10">
                  <Calendar size={32} strokeWidth={1} className="mb-3 opacity-10" />
                  <p className="font-light italic text-[0.9rem] text-text-primary/30">No sessions scheduled.</p>
                </div>
              )}
            </section>

            {/* Pending Reviews Card */}
            <section className="bg-white p-7 rounded-3xl border border-polar-night/5 shadow-sm">
              <h3 className="text-lg text-polar-night font-bold flex items-center gap-2 mb-6">
                <Star size={18} className="text-amber-400" /> Share Your Experience
              </h3>

              {pendingReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingReviews.slice(0, 2).map((b) => (
                    <div key={b.id} className="p-5 bg-frozen/20 rounded-2xl border border-white/50 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white shadow-sm">
                          <img src={b.schedule?.service?.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[0.9rem] font-bold text-polar-night truncate">{b.schedule?.service?.name}</h4>
                          <p className="text-[0.7rem] text-text-primary/40 font-medium">Attended on {new Date(b.schedule?.start_time).toLocaleDateString(undefined, { timeZone: 'UTC' })}</p>
                        </div>
                      </div>
                      <Link
                        to={`${ROUTES.MY_REVIEWS_CREATE}?booking_id=${b.id}`}
                        className="px-4 py-2 bg-polar-night text-white rounded-lg text-[0.7rem] font-bold no-underline hover:bg-frost-byte transition-all whitespace-nowrap"
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                  {pendingReviews.length > 2 && (
                    <Link to={ROUTES.MY_BOOKINGS} className="flex items-center justify-center p-5 bg-white border border-dashed border-polar-night/10 rounded-2xl text-[0.8rem] text-text-primary/40 font-medium no-underline hover:bg-frozen/20 transition-all">
                      View all sessions to review ({pendingReviews.length})
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-frozen/5 rounded-2xl border border-dashed border-polar-night/10">
                  <Star size={32} strokeWidth={1} className="mb-3 opacity-10" />
                  <p className="font-light italic text-[0.9rem] text-text-primary/30">All attended classes have been reviewed.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default DashboardPage;
