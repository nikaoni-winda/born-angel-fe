import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/layout/UserLayout';
import reviewService from '../../services/reviewService';
import Pagination from '../../components/Pagination';
import {
    Star,
    MessageSquare,
    Quote,
    Trash2,
    Edit3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async (page = 1) => {
        try {
            setLoading(true);
            const data = await reviewService.getAll({ page, per_page: 15 });
            setReviews(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                total: data.total,
                from: data.from,
                to: data.to,
            });
        } catch (error) {
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await reviewService.delete(deleteId);
            toast.success("Review deleted successfully");
            fetchReviews(pagination.current_page);
        } catch (error) {
            toast.error("Failed to delete review");
        } finally {
            setDeleteId(null);
        }
    };

    /**
     * Renders 5 stars representing a 1-5 point scale
     */
    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        fill={i < rating ? "#DE95AD" : "none"}
                        className={i < rating ? "text-frost-byte" : "text-polar-night/10"}
                    />
                ))}
            </div>
        );
    };

    return (
        <UserLayout>
            <div className="max-w-6xl mx-auto py-4">
                <div className="mb-10">
                    <h1 className="text-3xl text-polar-night font-bold mb-1">My Reviews</h1>
                    <p className="text-text-primary/50 font-normal text-[0.95rem]">See what you've shared with our community.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 min-h-[40vh]">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte"></div>
                    </div>
                ) : reviews.length > 0 ? (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-[2rem] p-7 border border-polar-night/5 shadow-sm relative group hover:shadow-md transition-all duration-300"
                            >
                                <div className="absolute top-6 right-8 text-frozen/50 opacity-20 pointer-events-none">
                                    <Quote size={60} strokeWidth={1} />
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-5">
                                        {renderStars(review.rating)}
                                    </div>

                                    <div className="mb-6 flex-grow">
                                        <p className="text-[0.95rem] text-text-primary leading-relaxed font-light italic">
                                            "{review.comment}"
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-polar-night/5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-white">
                                                <img
                                                    src={review.booking?.schedule?.service?.image}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-polar-night text-[0.95rem] mb-0.5">
                                                    {review.booking?.schedule?.service?.name}
                                                </h4>
                                                <p className="text-[0.7rem] text-text-primary/30 font-medium mb-0.5">
                                                    {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                                                </p>
                                                <p className="text-[0.7rem] text-frost-byte font-bold uppercase tracking-wider">
                                                    Instr. {review.booking?.schedule?.instructor?.user?.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`${ROUTES.MY_REVIEWS_EDIT.replace(':id', review.id)}`}
                                                className="px-4 py-2 bg-frozen/50 text-polar-night rounded-xl text-[0.75rem] font-bold no-underline hover:bg-frozen transition-all flex items-center gap-2"
                                            >
                                                <Edit3 size={14} /> Edit
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(review.id)}
                                                className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[0.75rem] font-bold hover:bg-red-100 transition-all border-none cursor-pointer flex items-center gap-2"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
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
                            onPageChange={(page) => fetchReviews(page)}
                        />
                    </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-polar-night/5 shadow-sm">
                        <MessageSquare size={48} strokeWidth={1} className="mb-4 opacity-10" />
                        <h3 className="text-xl font-bold text-polar-night/30 mb-2">No Reviews Yet</h3>
                        <p className="text-[0.9rem] font-light italic text-text-primary/20 mb-8">After attending a class, your feedback will appear here.</p>
                        <Link to={ROUTES.MY_BOOKINGS} className="px-8 py-3.5 bg-polar-night text-white rounded-xl font-bold no-underline hover:bg-frost-byte transition-all">
                            View Bookings
                        </Link>
                    </div>
                )}
            </div>
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Review"
                message="Are you sure you want to delete this review?"
            />
        </UserLayout>
    );
};

export default MyReviewsPage;
