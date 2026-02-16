import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import UserLayout from '../../components/layout/UserLayout';
import bookingService from '../../services/bookingService';
import paymentService from '../../services/paymentService';
import Pagination from '../../components/Pagination';
import { withMinDelay } from '../../utils/loadingUtils';
import {
  Calendar,
  Clock,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Star,
  User,
  ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const MyBookingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [cancelId, setCancelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const qFilter = searchParams.get('filter');
    if (qFilter) {
      setFilter(qFilter);
    }
  }, [searchParams]);

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const data = await withMinDelay(bookingService.getAll({ page, per_page: 15 }));
      const items = data.data || [];
      const sorted = items.sort((a, b) => new Date(b.schedule?.start_time) - new Date(a.schedule?.start_time));
      setBookings(sorted);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        from: data.from,
        to: data.to,
      });
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await bookingService.cancel(cancelId);
      toast.success("Booking cancelled successfully");
      fetchBookings(pagination.current_page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelId(null);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      toast.loading("Preparing payment...", { id: 'payment' });
      const { snap_token } = await paymentService.getSnapToken(bookingId);
      toast.dismiss('payment');

      if (window.snap) {
        window.snap.pay(snap_token, {
          onSuccess: (result) => {
            toast.success("Payment successful!");
            fetchBookings(pagination.current_page);
          },
          onPending: (result) => {
            toast.info("Waiting for your payment.");
            fetchBookings(pagination.current_page);
          },
          onError: (result) => {
            toast.error("Payment failed.");
          },
          onClose: () => {
            toast.error("Payment popup closed.");
          }
        });
      } else {
        toast.error("Payment system not ready. Please refresh.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.dismiss('payment');

      let message = "Failed to get payment token";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      toast.error(message);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'pending') return b.status === 'pending';
    if (filter === 'confirmed') return b.status === 'confirmed' && new Date(b.schedule?.end_time) > new Date();
    if (filter === 'finished') return b.status === 'confirmed' && new Date(b.schedule?.end_time) <= new Date();
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (booking) => {
    const now = new Date();
    const endTime = new Date(booking.schedule?.end_time);

    if (booking.status === 'cancelled') {
      return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5"><XCircle size={12} /> Cancelled</span>;
    }
    if (booking.status === 'pending') {
      return <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock size={12} /> Waiting Payment</span>;
    }
    if (booking.status === 'confirmed') {
      if (endTime < now) {
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 size={12} /> Completed</span>;
      }
      return <span className="px-3 py-1 bg-frost-byte/10 text-frost-byte rounded-full text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5"><Calendar size={12} /> Scheduled</span>;
    }
    return null;
  };

  const handleFilterChange = (f) => {
    setFilter(f);
    setSearchParams({ filter: f });
  };

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto py-4">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl text-polar-night font-bold mb-1">My Bookings</h1>
            <p className="text-text-primary/50 font-normal text-[0.95rem]">Manage your class schedules and payment status.</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-polar-night/5 overflow-x-auto no-scrollbar">
            {['all', 'pending', 'confirmed', 'finished', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`
                  px-5 py-2 rounded-lg text-[0.7rem] font-bold uppercase tracking-wider transition-all border-none cursor-pointer whitespace-nowrap
                  ${filter === f
                    ? 'bg-polar-night text-white shadow-sm'
                    : 'bg-transparent text-text-primary/30 hover:text-polar-night hover:bg-frozen/50'
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[40vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte"></div>
            <p className="text-text-primary/40 text-[0.9rem] italic mt-4">Loading...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <>
          <div className="grid grid-cols-1 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-56 h-48 md:h-auto md:max-h-64 overflow-hidden">
                    <img
                      src={booking.schedule?.service?.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {getStatusBadge(booking)}
                          <span className="text-[0.65rem] font-bold text-text-primary/20 tracking-widest uppercase">#{booking.booking_code}</span>
                        </div>
                        <h3 className="text-xl text-polar-night font-bold">
                          {booking.schedule?.service?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-[0.8rem] text-text-primary/60">
                          <User size={14} className="text-frost-byte" />
                          <span>Instr. {booking.schedule?.instructor?.user?.name}</span>
                        </div>
                      </div>

                      <div className="lg:text-right border-l-2 lg:border-l-0 lg:border-r-0 border-frost-byte/10 pl-4 lg:pl-0">
                        <div className="text-lg font-bold text-polar-night mb-1 text-nowrap">
                          IDR {parseFloat(booking.total_price).toLocaleString('id-ID')}
                        </div>
                        <div className={`text-[0.65rem] font-bold uppercase tracking-widest ${booking.payment?.transaction_status === 'settlement' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {booking.payment?.transaction_status || 'waiting payment'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-polar-night/5 gap-6">
                      <div className="flex flex-wrap gap-8">
                        <div className="space-y-1">
                          <span className="text-[0.65rem] text-text-primary/30 uppercase font-black tracking-widest block">Date</span>
                          <div className="flex items-center gap-2 text-[0.85rem] text-polar-night font-medium">
                            <Calendar size={14} className="text-frost-byte/60" />
                            <span>{new Date(booking.schedule?.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[0.65rem] text-text-primary/30 uppercase font-black tracking-widest block">Time</span>
                          <div className="flex items-center gap-2 text-[0.85rem] text-polar-night font-medium">
                            <Clock size={14} className="text-frost-byte/60" />
                            <span>
                              {new Date(booking.schedule?.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} -
                              {new Date(booking.schedule?.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handlePayment(booking.id)}
                            className="px-6 py-2.5 bg-polar-night text-white rounded-xl font-bold text-[0.8rem] shadow-sm hover:bg-frost-byte transition-all border-none cursor-pointer flex items-center gap-2"
                          >
                            <CreditCard size={16} /> Pay
                          </button>
                        )}

                        {booking.status === 'confirmed' && new Date(booking.schedule?.end_time) < new Date() && !booking.review && (
                          <Link to={`${ROUTES.MY_REVIEWS_CREATE}?booking_id=${booking.id}`} className="px-6 py-2.5 bg-frost-byte text-white rounded-xl font-bold text-[0.8rem] shadow-sm hover:bg-polar-night transition-all flex items-center gap-2 no-underline">
                            <Star size={16} /> Review
                          </Link>
                        )}

                        {booking.status !== 'cancelled' && new Date(booking.schedule?.start_time) > new Date() && (
                          <button
                            onClick={() => setCancelId(booking.id)}
                            className="px-4 py-2.5 text-red-500/60 text-[0.8rem] font-bold hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}

                        <Link to={`${ROUTES.SERVICES}/${booking.schedule?.service_id}`} className="p-2.5 bg-frozen/40 rounded-xl text-polar-night/20 hover:text-frost-byte transition-colors">
                          <ExternalLink size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              total={pagination.total}
              from={pagination.from}
              to={pagination.to}
              onPageChange={(page) => fetchBookings(page)}
            />
          </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-polar-night/5 shadow-sm">
            <ShoppingBag size={48} strokeWidth={1} className="mb-4 opacity-10" />
            <h3 className="text-xl font-bold text-polar-night/30 mb-2">No Bookings</h3>
            <p className="text-[0.9rem] font-light italic text-text-primary/20 mb-8">You haven't made any bookings in this category.</p>
            <Link to={ROUTES.BROWSE_CLASSES} className="px-8 py-3.5 bg-polar-night text-white rounded-xl font-bold no-underline hover:bg-frost-byte transition-all">
              Browse Classes
            </Link>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Yes, Cancel"
      />
    </UserLayout>
  );
};

export default MyBookingsPage;
