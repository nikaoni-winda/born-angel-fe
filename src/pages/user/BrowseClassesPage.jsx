import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/layout/UserLayout';
import scheduleService from '../../services/scheduleService';
import serviceService from '../../services/serviceService';
import Pagination from '../../components/Pagination';
import { withMinDelay } from '../../utils/loadingUtils';
import {
    Calendar,
    Clock,
    User,
    ShoppingBag,
    ChevronRight,
    Info,
    Filter,
    CalendarDays,
    ArrowUpDown,
    Check,
    ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const BrowseClassesPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });

    // Filter States
    const [selectedServiceId, setSelectedServiceId] = useState('all');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, this-week, next-week
    const [sortOrder, setSortOrder] = useState('soonest'); // soonest, latest, price-low, price-high

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async (page = 1) => {
        try {
            setLoading(true);
            const [schedulesData, servicesData] = await withMinDelay(Promise.all([
                scheduleService.getAll({ page, per_page: 15 }),
                serviceService.getAll({ per_page: 100 })
            ]));
            setSchedules(schedulesData.data || []);
            setPagination({
                current_page: schedulesData.current_page,
                last_page: schedulesData.last_page,
                total: schedulesData.total,
                from: schedulesData.from,
                to: schedulesData.to,
            });
            setServices(servicesData.data || []);
        } catch (error) {
            toast.error("Failed to load classes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredSchedules = schedules.filter(schedule => {
        // ... (Filter logic remains same)
        // 1. Filter by Class
        if (selectedServiceId !== 'all' && schedule.service_id.toString() !== selectedServiceId) {
            return false;
        }

        // 2. Filter by Date Range
        const start = new Date(schedule.start_time);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') {
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            return start >= today && start <= endOfDay;
        }

        if (dateFilter === 'this-week') {
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            return start >= today && start <= nextWeek;
        }

        if (dateFilter === 'next-week') {
            const nextWeekStart = new Date(today);
            nextWeekStart.setDate(today.getDate() + 7);
            const nextWeekEnd = new Date(nextWeekStart);
            nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
            return start >= nextWeekStart && start <= nextWeekEnd;
        }

        return true;
    }).sort((a, b) => {
        // 3. Sorting Logic
        if (sortOrder === 'soonest') return new Date(a.start_time) - new Date(b.start_time);
        if (sortOrder === 'latest') return new Date(b.start_time) - new Date(a.start_time);
        if (sortOrder === 'price-low') return a.service?.price - b.service?.price;
        if (sortOrder === 'price-high') return b.service?.price - a.service?.price;
        return 0;
    });

    return (
        <UserLayout>
            <div className="max-w-6xl mx-auto py-4">
                <div className="mb-10">
                    <h1 className="text-3xl text-polar-night font-bold mb-2">
                        Browse <span className="italic font-light text-frost-byte">Available Classes</span>
                    </h1>
                    <p className="text-text-primary/50 font-normal text-[0.95rem]">
                        Select your preferred schedule and level up your beauty artistry skills.
                    </p>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {/* Filter by Class */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-text-primary/30 mb-2 ml-1">
                            <Filter size={10} /> Filter by Class
                        </label>
                        <div className="relative group">
                            <select
                                value={selectedServiceId}
                                onChange={(e) => setSelectedServiceId(e.target.value)}
                                className="w-full h-12 bg-white border border-polar-night/5 rounded-xl px-4 pr-10 text-[0.85rem] font-bold text-polar-night outline-none focus:border-frost-byte/30 shadow-sm appearance-none cursor-pointer transition-all"
                            >
                                <option value="all">All Available Classes</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-polar-night/20 group-hover:text-frost-byte pointer-events-none transition-colors" />
                        </div>
                    </div>

                    {/* Filter by Date Range */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-text-primary/30 mb-2 ml-1">
                            <CalendarDays size={10} /> Time Period
                        </label>
                        <div className="relative group">
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full h-12 bg-white border border-polar-night/5 rounded-xl px-4 pr-10 text-[0.85rem] font-bold text-polar-night outline-none focus:border-frost-byte/30 shadow-sm appearance-none cursor-pointer transition-all"
                            >
                                <option value="all">Any Upcoming Date</option>
                                <option value="today">Today Only</option>
                                <option value="this-week">This Week (7 Days)</option>
                                <option value="next-week">Next Week</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-polar-night/20 group-hover:text-frost-byte pointer-events-none transition-colors" />
                        </div>
                    </div>

                    {/* Sort Order */}
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-text-primary/30 mb-2 ml-1">
                            <ArrowUpDown size={10} /> Sort Results
                        </label>
                        <div className="relative group">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full h-12 bg-white border border-polar-night/5 rounded-xl px-4 pr-10 text-[0.85rem] font-bold text-polar-night outline-none focus:border-frost-byte/30 shadow-sm appearance-none cursor-pointer transition-all"
                            >
                                <option value="soonest">Soonest Start Time</option>
                                <option value="latest">Latest Start Time</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-polar-night/20 group-hover:text-frost-byte pointer-events-none transition-colors" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 min-h-[40vh]">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
                        <p className="text-text-primary/30 text-[0.85rem] italic">Loading...</p>
                    </div>
                ) : filteredSchedules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSchedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 overflow-hidden shrink-0">
                                    <img
                                        src={schedule.service?.image}
                                        alt={schedule.service?.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[0.7rem] font-bold text-polar-night shadow-sm">
                                        IDR {parseFloat(schedule.service?.price).toLocaleString('id-ID')}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-[0.65rem] text-frost-byte font-black uppercase tracking-widest mb-3">
                                        <Calendar size={12} />
                                        <span>{new Date(schedule.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span>
                                    </div>

                                    <h3 className="text-lg text-polar-night font-bold mb-1 truncate group-hover:text-frost-byte transition-colors">
                                        {schedule.service?.name}
                                    </h3>

                                    <div className="flex items-center gap-1.5 text-[0.8rem] text-text-primary/50 mb-6">
                                        <User size={14} className="text-text-primary/30" />
                                        <span>Instr. {schedule.instructor?.user?.name}</span>
                                    </div>

                                    <div className="mt-auto space-y-4 pt-4 border-t border-polar-night/5">
                                        <div className="flex items-center justify-between text-[0.8rem]">
                                            <div className="flex items-center gap-2 text-text-primary/60">
                                                <Clock size={14} />
                                                <span>{new Date(schedule.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</span>
                                            </div>
                                            <div className={`font-bold ${schedule.remaining_slots < 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                {schedule.remaining_slots} slots left
                                            </div>
                                        </div>

                                        <Link
                                            to={`${ROUTES.CREATE_BOOKING}?schedule_id=${schedule.id}`}
                                            className="w-full py-3 bg-polar-night text-white rounded-xl font-bold text-[0.85rem] flex items-center justify-center gap-2 no-underline hover:bg-frost-byte transition-all"
                                        >
                                            Book Session <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border border-polar-night/5 shadow-sm">
                        <div className="w-16 h-16 bg-frozen/20 rounded-2xl flex items-center justify-center text-frost-byte mb-4">
                            <ShoppingBag size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-polar-night mb-2">No Matches Found</h3>
                        <p className="max-w-md mx-auto text-[0.9rem] text-text-primary/40 font-light italic mb-8">
                            We couldn't find any sessions matching your filter criteria. Try adjusting your search or contact support.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedServiceId('all');
                                setDateFilter('all');
                                setSortOrder('soonest');
                            }}
                            className="px-8 py-3 bg-polar-night text-white rounded-xl font-bold no-underline hover:bg-frost-byte transition-all text-[0.85rem]"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {!loading && schedules.length > 0 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={pagination.current_page}
                            lastPage={pagination.last_page}
                            total={pagination.total}
                            from={pagination.from}
                            to={pagination.to}
                            onPageChange={(page) => fetchInitialData(page)}
                        />
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-12 p-6 bg-polar-night rounded-[2rem] text-white/90 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Info size={24} className="text-frost-byte" />
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">Can't find the perfect schedule?</h4>
                        <p className="text-[0.85rem] font-light text-white/60">
                            Our schedules are updated weekly. Check back soon for new slots from your favorite instructors.
                        </p>
                    </div>
                </div>
            </div>
        </UserLayout >
    );
};

export default BrowseClassesPage;
