import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import bookingService from '../../../services/bookingService';
import serviceService from '../../../services/serviceService';
import Pagination from '../../../components/Pagination';
import { withMinDelay } from '../../../utils/loadingUtils';
import { Search, Calendar, User, ShoppingBag, XCircle, CheckCircle, AlertCircle, Clock, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminFilterDropdown from '../../../components/admin/AdminFilterDropdown';
import ConfirmModal from '../../../components/common/ConfirmModal';

const BookingsListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });

  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const [bookingsData, servicesData] = await withMinDelay(Promise.all([
        bookingService.getAll({ page, per_page: 15 }),
        serviceService.getAll({ per_page: 100 })
      ]));
      setBookings(bookingsData.data);
      setPagination({
        current_page: bookingsData.current_page,
        last_page: bookingsData.last_page,
        total: bookingsData.total,
        from: bookingsData.from,
        to: bookingsData.to,
      });
      setServices(servicesData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await bookingService.cancel(cancelId);
      toast.success('Booking cancelled successfully');
      fetchData(pagination.current_page);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      const message = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
    } finally {
      setCancelId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.schedule?.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_code?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesService = filterService === 'all' || booking.schedule?.service?.id.toString() === filterService;

    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-600';
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const serviceOptions = [
    { label: 'All Classes', value: 'all' },
    ...services.map(s => ({ label: s.name, value: s.id.toString() }))
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-polar-night mb-2">Booking Management</h1>
            <p className="text-text-primary/60 text-sm">Monitor and manage class reservations</p>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-polar-night/5 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            <AdminFilterDropdown
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filter Status"
              className="w-full md:w-auto"
            />

            <AdminFilterDropdown
              options={serviceOptions}
              value={filterService}
              onChange={setFilterService}
              placeholder="Filter Class"
              className="w-full md:w-auto"
            />
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/40" size={20} />
            <input
              type="text"
              placeholder="Search user, service, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 w-full"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 min-h-[40vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
          <p className="text-text-primary/40 text-[0.85rem] italic font-medium">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-frozen/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Booking Info</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-night/5">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-frozen/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-polar-night text-sm">{booking.schedule?.service?.name}</span>
                          <span className="text-xs text-text-primary/40 font-mono">{booking.booking_code}</span>
                          <div className="flex items-center gap-1 text-xs text-text-primary/60 mt-1">
                            <Calendar size={10} />
                            <span>{new Date(booking.schedule?.start_time).toLocaleDateString(undefined, { timeZone: 'UTC' })}</span>
                            <Clock size={10} className="ml-1" />
                            <span>{new Date(booking.schedule?.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-polar-night/5 flex items-center justify-center text-[10px] font-bold text-polar-night overflow-hidden">
                            {booking.user?.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-polar-night">{booking.user?.name}</span>
                            <span className="text-[10px] text-text-primary/40">{booking.user?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-polar-night">
                          IDR {parseInt(booking.total_price).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => setCancelId(booking.id)}
                            className="p-2 hover:bg-red-50 text-text-primary/40 hover:text-red-500 rounded-lg transition-colors flex items-center gap-1 ml-auto group" // Added group
                            title="Cancel Booking"
                          >
                            <XCircle size={18} />
                            <span className="text-xs font-medium hidden group-hover:inline">Cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-text-primary/40">
                      <p>No bookings found matching filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            onPageChange={(page) => fetchData(page)}
          />
        </div>
      )}
      <ConfirmModal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you certain? This will refund the slot to the schedule."
        confirmText="Yes, Cancel"
      />
    </AdminLayout>
  );
};

export default BookingsListPage;
