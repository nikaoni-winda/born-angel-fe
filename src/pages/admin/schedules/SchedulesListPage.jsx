import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import scheduleService from '../../../services/scheduleService';
import serviceService from '../../../services/serviceService';
import Pagination from '../../../components/Pagination';
import { withMinDelay } from '../../../utils/loadingUtils';
import { Search, Trash2, Edit, Plus, Calendar, MapPin, AlertCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import AdminFilterDropdown from '../../../components/admin/AdminFilterDropdown';
import ConfirmModal from '../../../components/common/ConfirmModal';

const SchedulesListPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });

  // Filters
  const [filterTime, setFilterTime] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [filterService, setFilterService] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const [schedulesData, servicesData] = await withMinDelay(Promise.all([
        scheduleService.getAll({ page, per_page: 15 }),
        serviceService.getAll({ per_page: 100 })
      ]));
      setSchedules(schedulesData.data);
      setPagination({
        current_page: schedulesData.current_page,
        last_page: schedulesData.last_page,
        total: schedulesData.total,
        from: schedulesData.from,
        to: schedulesData.to,
      });
      setServices(servicesData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await scheduleService.delete(deleteId);
      toast.success('Schedule deleted successfully');
      fetchData(pagination.current_page);
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error('Failed to delete schedule');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    // 1. Search Filter
    const matchesSearch =
      schedule.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.instructor?.user?.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Service Filter
    const matchesService = filterService === 'all' || schedule.service?.id.toString() === filterService;

    // 3. Time Filter
    let matchesTime = true;
    const now = new Date();
    const startTime = new Date(schedule.start_time);

    if (filterTime === 'upcoming') {
      matchesTime = startTime >= now;
    } else if (filterTime === 'past') {
      matchesTime = startTime < now;
    }

    return matchesSearch && matchesService && matchesTime;
  });

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZone: 'UTC'
    });
  };

  const serviceOptions = [
    { label: 'All Services', value: 'all' },
    ...services.map(s => ({ label: s.name, value: s.id.toString() }))
  ];

  const timeOptions = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Past', value: 'past' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-polar-night mb-2">Schedule Management</h1>
            <p className="text-text-primary/60 text-sm">Organize class timetables</p>
          </div>

          <Link
            to={ROUTES.ADMIN_SCHEDULES_CREATE}
            className="bg-polar-night text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-polar-night/90 transition-colors font-medium text-sm no-underline"
          >
            <Plus size={18} />
            <span>Add Schedule</span>
          </Link>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-polar-night/5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <AdminFilterDropdown
              options={timeOptions}
              value={filterTime}
              onChange={setFilterTime}
              placeholder="Filter Time"
              className="w-full md:w-auto"
            />

            <AdminFilterDropdown
              options={serviceOptions}
              value={filterService}
              onChange={setFilterService}
              placeholder="Filter Service"
              className="w-full md:w-auto"
            />
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/40" size={20} />
            <input
              type="text"
              placeholder="Search schedules..."
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
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Class Info</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Timing</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-night/5">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule) => {
                    const totalCapacity = schedule.total_capacity || 0;
                    const remainingSlots = schedule.remaining_slots || 0;
                    const occupied = totalCapacity - remainingSlots;
                    const fillPercentage = totalCapacity > 0 ? (occupied / totalCapacity) * 100 : 0;

                    return (
                      <tr key={schedule.id} className="hover:bg-frozen/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-polar-night text-sm">{schedule.service?.name}</span>
                            <div className="flex items-center gap-1 text-xs text-text-primary/40 mt-1">
                              <MapPin size={10} />
                              <span>Born Angel Studio</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-polar-night/5 flex items-center justify-center text-[10px] font-bold text-polar-night overflow-hidden">
                              {schedule.instructor?.user?.name.charAt(0)}
                            </div>
                            <span className="text-sm text-text-primary/70">{schedule.instructor?.user?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-sm text-text-primary/70">
                            <span className="flex items-center gap-1.5 font-medium text-polar-night">
                              <Calendar size={12} className="text-frost-byte" />
                              {formatDateTime(schedule.start_time)}
                            </span>
                            <span className="text-xs opacity-60 ml-4">
                              Duration: {schedule.service?.duration_minutes}m
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 w-32">
                            <div className="flex items-center justify-between text-xs text-text-primary/60 font-medium">
                              <span>{occupied} / {totalCapacity}</span>
                              <span className={remainingSlots > 0 ? 'text-emerald-500' : 'text-red-500'}>
                                {remainingSlots > 0 ? 'Available' : 'Full'}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${remainingSlots === 0 ? 'bg-red-500' : 'bg-frost-byte'}`}
                                style={{ width: `${fillPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={ROUTES.ADMIN_SCHEDULES_EDIT.replace(':id', schedule.id)}
                              className="p-2 hover:bg-frozen/20 text-text-primary/60 hover:text-polar-night rounded-lg transition-colors"
                              title="Edit Schedule"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => setDeleteId(schedule.id)}
                              className="p-2 hover:bg-red-50 text-text-primary/40 hover:text-red-500 rounded-lg transition-colors"
                              title="Delete Schedule"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-text-primary/40">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={32} className="opacity-20" />
                        <p>No schedules found matching your filters.</p>
                      </div>
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
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Schedule"
        message="Are you sure? Bookings may be affected."
      />
    </AdminLayout>
  );
};

export default SchedulesListPage;
