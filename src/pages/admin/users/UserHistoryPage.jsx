import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import adminService from '../../../services/adminService';
import bookingService from '../../../services/bookingService';
import reviewService from '../../../services/reviewService';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, Clock, Star, MapPin, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../utils/constants';
import AdminFilterDropdown from '../../../components/admin/AdminFilterDropdown';
import ConfirmModal from '../../../components/common/ConfirmModal';

const UserHistoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [deleteReviewId, setDeleteReviewId] = useState(null);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'reviews'
    const [bookingFilter, setBookingFilter] = useState('all'); // 'upcoming', 'past', 'all'
    const [classFilter, setClassFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userData, bookingsData] = await Promise.all([
                    adminService.getUser(id),
                    bookingService.getAll({ user_id: id })
                ]);
                setUser(userData);
                setBookings(bookingsData);
            } catch (error) {
                console.error("Error fetching user history:", error);
                toast.error("Failed to load user history");
                navigate(ROUTES.ADMIN_USERS || '/admin/users');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleDeleteReview = async () => {
        try {
            await reviewService.delete(deleteReviewId);
            toast.success('Review deleted successfully');
            setBookings(prev => prev.map(b => b.review?.id === deleteReviewId ? { ...b, review: null } : b));
        } catch (error) {
            console.error("Error deleting review:", error);
            toast.error('Failed to delete review');
        } finally {
            setDeleteReviewId(null);
        }
    };

    const formatDateTime = (dateString, timeString) => {
        return new Date(timeString).toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', timeZone: 'UTC'
        });
    };

    const getFilteredBookings = () => {
        // Filter out bookings with missing schedule data (orphaned)
        const validBookings = bookings.filter(b => b.schedule);

        let result = validBookings;

        // Class Filter
        if (classFilter !== 'all') {
            result = result.filter(b => b.schedule?.service?.id.toString() === classFilter);
        }

        // Time Filter
        if (bookingFilter !== 'all') {
            const now = new Date();
            result = result.filter(booking => {
                const startTime = new Date(booking.schedule.start_time);
                return bookingFilter === 'upcoming' ? startTime >= now : startTime < now;
            });
        }

        return result;
    };

    const getReviews = () => {
        return bookings
            .filter(b => b.review && b.schedule && b.schedule.service && b.schedule.instructor && b.schedule.instructor.user)
            .map(b => ({
                ...b.review,
                serviceName: b.schedule.service.name,
                instructorName: b.schedule.instructor.user.name,
                date: b.schedule.start_time,
                originalBookingId: b.id // Keep ref if needed
            }));
    };

    // Extract unique classes for filter
    const uniqueClasses = Array.from(new Set(bookings
        .filter(b => b.schedule?.service)
        .map(b => JSON.stringify({ id: b.schedule.service.id, name: b.schedule.service.name }))
    )).map(str => JSON.parse(str));

    const classOptions = [
        { label: 'All Classes', value: 'all' },
        ...uniqueClasses.map(c => ({ label: c.name, value: c.id.toString() }))
    ];

    const timeOptions = [
        { label: 'All Bookings', value: 'all' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Past', value: 'past' },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!user) return null;

    const filteredBookings = getFilteredBookings();
    const reviews = getReviews();

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate(ROUTES.ADMIN_USERS || '/admin/users')}
                        className="p-2 hover:bg-frozen/20 rounded-xl transition-colors text-polar-night/60 hover:text-polar-night"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-polar-night">User History</h1>
                        <p className="text-text-primary/60 text-sm">View details for {user.name}</p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-polar-night/5 flex items-center justify-center text-polar-night font-bold text-3xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 space-y-2">
                            <h2 className="text-2xl font-bold text-polar-night">{user.name}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-text-primary/70">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} />
                                    <span>{user.phone_number || 'No phone'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>Joined {new Date(user.created_at).toLocaleDateString(undefined, { timeZone: 'UTC' })}</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-frost-byte/10 text-frost-byte rounded-xl font-bold text-sm capitalize">
                            {user.role}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-polar-night/5">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'bookings' ? 'text-polar-night' : 'text-text-primary/40 hover:text-polar-night'
                            }`}
                    >
                        Bookings History
                        {activeTab === 'bookings' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-polar-night rounded-t-full"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'reviews' ? 'text-polar-night' : 'text-text-primary/40 hover:text-polar-night'
                            }`}
                    >
                        Reviews ({reviews.length})
                        {activeTab === 'reviews' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-polar-night rounded-t-full"></div>
                        )}
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'bookings' ? (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            <AdminFilterDropdown
                                options={classOptions}
                                value={classFilter}
                                onChange={setClassFilter}
                                placeholder="Filter Class"
                            />
                            <AdminFilterDropdown
                                options={timeOptions}
                                value={bookingFilter}
                                onChange={setBookingFilter}
                                placeholder="Filter Time"
                            />
                        </div>

                        {filteredBookings.length > 0 ? (
                            <div className="grid gap-4">
                                {filteredBookings.map(booking => (
                                    <div key={booking.id} className="bg-white p-6 rounded-2xl border border-polar-night/5 shadow-sm hover:border-frost-byte/30 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-polar-night text-lg">{booking.schedule.service.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-text-primary/60 mt-1">
                                                    <User size={12} />
                                                    <span>Instructor: {booking.schedule.instructor.user.name}</span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-text-primary/80 pt-4 border-t border-polar-night/5">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-frost-byte" />
                                                <span className="font-medium">{formatDateTime(booking.booking_date, booking.schedule.start_time)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-amber-500" />
                                                <span>{booking.schedule.service.duration} mins</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-rose-400" />
                                                <span>{booking.schedule.location || 'Studio'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-text-primary/40">
                                <div className="flex flex-col items-center gap-2">
                                    <AlertCircle size={32} className="opacity-20" />
                                    <p>No bookings found matching filters.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            <div className="grid gap-4">
                                {reviews.map((review, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-polar-night/5 shadow-sm relative group">
                                        {/* Action: Delete Review */}
                                        <button
                                            onClick={() => setDeleteReviewId(review.id)}
                                            className="absolute top-4 right-4 p-2 text-text-primary/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Review (Admin)"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="flex justify-between items-start mb-2 pr-10">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-text-primary/40">
                                                {new Date(review.created_at).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                                            </span>
                                        </div>
                                        <p className="text-polar-night text-sm italic mb-4">"{review.comment}"</p>
                                        <div className="text-xs text-text-primary/60 pt-4 border-t border-polar-night/5">
                                            Review for <span className="font-bold text-polar-night">{review.serviceName}</span> with {review.instructorName}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-text-primary/40">
                                <p>No reviews made by this user yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <ConfirmModal
                isOpen={!!deleteReviewId}
                onClose={() => setDeleteReviewId(null)}
                onConfirm={handleDeleteReview}
                title="Delete Review"
                message="Are you sure? This action cannot be undone."
            />
        </AdminLayout>
    );
};

export default UserHistoryPage;
