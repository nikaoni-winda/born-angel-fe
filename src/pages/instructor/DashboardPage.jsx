import React, { useState, useEffect } from 'react';
import InstructorLayout from '../../components/layout/InstructorLayout';
import scheduleService from '../../services/scheduleService';
import reviewService from '../../services/reviewService';
import { withMinDelay } from '../../utils/loadingUtils';
import { Calendar, Star, Users, Clock, MapPin, AlertCircle, ChevronDown, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminFilterDropdown from '../../components/admin/AdminFilterDropdown';

const InstructorDashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    upcomingClasses: 0,
    totalReviews: 0,
    averageRating: 0
  });
  const [schedules, setSchedules] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Tabs
  const [activeTab, setActiveTab] = useState('classes'); // 'classes', 'reviews'

  // Filters
  const [timeFilter, setTimeFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch context-aware data (backend automatically filters for current instructor)
        const [schedulesRes, reviewsRes] = await withMinDelay(Promise.all([
          scheduleService.getAll({ per_page: 100 }),
          reviewService.getAll({ per_page: 100 })
        ]));

        const schedulesData = schedulesRes.data;
        const reviewsData = reviewsRes.data;

        setSchedules(schedulesData);
        setReviews(reviewsData);

        // Calculate Stats
        const upcomingCount = schedulesData.filter(s => new Date(s.start_time) > new Date()).length;
        const avgRating = reviewsData.length > 0
          ? (reviewsData.reduce((acc, curr) => acc + curr.rating, 0) / reviewsData.length).toFixed(1)
          : 0;

        setStats({
          totalClasses: schedulesData.length,
          upcomingClasses: upcomingCount,
          totalReviews: reviewsData.length,
          averageRating: avgRating
        });

      } catch (error) {
        console.error("Error fetching instructor data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  // ... (remains same)
  const getFilteredSchedules = () => {
    const now = new Date();
    if (timeFilter === 'all') return schedules;

    return schedules.filter(schedule => {
      const startTime = new Date(schedule.start_time);
      return timeFilter === 'upcoming' ? startTime >= now : startTime < now;
    });
  };

  const filteredSchedules = getFilteredSchedules();
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const timeOptions = [
    { label: 'Upcoming Classes', value: 'upcoming' },
    { label: 'Past Classes', value: 'past' },
    { label: 'All History', value: 'all' },
  ];

  return (
    <InstructorLayout>
      {/* ... Header Stats ... */}
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ... stats cards ... */}
          <div className="bg-white p-6 rounded-2xl border border-polar-night/5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-text-primary/60 text-xs font-bold uppercase tracking-wider">Total Classes</p>
                <h3 className="text-3xl font-black text-polar-night mt-1">{stats.totalClasses}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-frost-byte/10 flex items-center justify-center text-frost-byte">
                <Calendar size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-polar-night/5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-text-primary/60 text-xs font-bold uppercase tracking-wider">Upcoming</p>
                <h3 className="text-3xl font-black text-polar-night mt-1">{stats.upcomingClasses}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <Clock size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-polar-night/5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-text-primary/60 text-xs font-bold uppercase tracking-wider">Reviews</p>
                <h3 className="text-3xl font-black text-polar-night mt-1">{stats.totalReviews}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Star size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-polar-night/5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-text-primary/60 text-xs font-bold uppercase tracking-wider">Avg Rating</p>
                <h3 className="text-3xl font-black text-polar-night mt-1">{stats.averageRating}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Star size={20} className="fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm overflow-hidden min-h-[500px]">
          {/* Tabs */}
          <div className="flex border-b border-polar-night/5">
            <button
              onClick={() => setActiveTab('classes')}
              className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === 'classes'
                ? 'text-polar-night bg-frozen/5'
                : 'text-text-primary/40 hover:text-polar-night hover:bg-frozen/5'
                }`}
            >
              My Classes
              {activeTab === 'classes' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-polar-night" />}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === 'reviews'
                ? 'text-polar-night bg-frozen/5'
                : 'text-text-primary/40 hover:text-polar-night hover:bg-frozen/5'
                }`}
            >
              Student Reviews
              {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-polar-night" />}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[40vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
                <p className="text-text-primary/40 text-[0.85rem] italic font-medium">Loading...</p>
              </div>
            ) : activeTab === 'classes' ? (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <AdminFilterDropdown
                    options={timeOptions}
                    value={timeFilter}
                    onChange={setTimeFilter}
                    placeholder="Filter Time"
                  />
                </div>

                {filteredSchedules.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSchedules.map(schedule => {
                      const startTime = new Date(schedule.start_time);
                      const isPast = startTime < new Date();
                      const booked = schedule.total_capacity - schedule.remaining_slots;

                      return (
                        <div key={schedule.id} className={`group relative p-6 rounded-2xl border transition-all ${isPast ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-white border-polar-night/5 hover:border-frost-byte/30 hover:shadow-lg hover:shadow-frost-byte/5'
                          }`}>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isPast ? 'bg-gray-200 text-gray-500' : 'bg-frost-byte/10 text-frost-byte'
                              }`}>
                              {isPast ? 'Completed' : 'Upcoming'}
                            </span>
                            <span className="flex items-center gap-1 text-xs font-bold text-polar-night">
                              <Users size={14} className="text-text-primary/40" />
                              {booked} / {schedule.total_capacity}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-polar-night mb-2 line-clamp-1">
                            {schedule.service?.name}
                          </h3>

                          <div className="space-y-2 text-sm text-text-primary/70">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-frost-byte" />
                              <span className="font-medium">
                                {startTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-amber-500" />
                              <span>
                                {startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                                {' - '}
                                {new Date(schedule.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-rose-400" />
                              <span>{schedule.location || 'Main Studio'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 text-text-primary/40">
                    <div className="flex flex-col items-center gap-4">
                      <Calendar size={48} className="opacity-20" />
                      <p>No classes found for this filter.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {sortedReviews.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {sortedReviews.map(review => (
                      <div key={review.id} className="bg-white p-6 rounded-2xl border border-polar-night/5 shadow-sm hover:border-frost-byte/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-polar-night/5 flex items-center justify-center font-bold text-polar-night">
                              {review.booking?.user?.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-polar-night">{review.booking?.user?.name}</p>
                              <p className="text-xs text-text-primary/40">Student</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-text-primary/40 mt-1">
                              {new Date(review.created_at).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                            </span>
                          </div>
                        </div>

                        <p className="text-polar-night text-sm italic mb-4 line-clamp-3">
                          "{review.comment}"
                        </p>

                        <div className="pt-4 border-t border-polar-night/5 flex items-center justify-between text-xs text-text-primary/60">
                          <span className="font-bold text-polar-night">
                            {review.booking?.schedule?.service?.name}
                          </span>
                          <span>
                            {new Date(review.booking?.schedule?.start_time).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-text-primary/40">
                    <div className="flex flex-col items-center gap-4">
                      <Star size={48} className="opacity-20" />
                      <p>No reviews recieved yet.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorDashboard;
