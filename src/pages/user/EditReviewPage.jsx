import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserLayout from '../../components/layout/UserLayout';
import reviewService from '../../services/reviewService';
import {
    Star,
    MessageSquare,
    ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '../../utils/constants';

const EditReviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchReview();
    }, [id]);

    const fetchReview = async () => {
        try {
            setLoading(true);
            const response = await reviewService.getAll({ per_page: 100 }); // Filter manually for simplicity
            const r = response.data.find(item => item.id == id);
            if (!r) throw new Error("Review not found");

            setReview(r);
            setRating(r.rating);
            setComment(r.comment);
        } catch (error) {
            toast.error("Failed to load review details");
            navigate(ROUTES.MY_REVIEWS);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await reviewService.update(id, {
                rating,
                comment
            });
            toast.success("Review updated successfully!");
            navigate(ROUTES.MY_REVIEWS);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update review");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <UserLayout>
                <div className="flex justify-center items-center py-20 min-h-[50vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte"></div>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="max-w-3xl mx-auto py-4">
                <Link to={ROUTES.MY_REVIEWS} className="inline-flex items-center gap-2 text-text-primary/60 hover:text-frost-byte transition-colors mb-8 no-underline font-medium text-[0.85rem]">
                    <ArrowLeft size={16} /> Back to My Reviews
                </Link>

                <div className="mb-10">
                    <h1 className="text-3xl text-polar-night font-bold mb-2">Edit Your Review</h1>
                    <p className="text-[0.95rem] text-text-primary/50 font-normal leading-relaxed">
                        Update your feedback for this class session.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-polar-night/5 p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
                    {/* Course Summary */}
                    <div className="flex items-center gap-5 p-5 bg-frozen/20 rounded-2xl border border-white/50 mb-8">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-white">
                            <img src={review?.booking?.schedule?.service?.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-bold text-polar-night text-[1.1rem] mb-1">{review?.booking?.schedule?.service?.name}</h4>
                            <p className="text-[0.7rem] text-frost-byte font-bold uppercase tracking-wider">
                                Class on {new Date(review?.booking?.schedule?.start_time).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                            </p>
                            <p className="text-[0.7rem] text-text-primary/30 font-medium mt-0.5">
                                Taught by {review?.booking?.schedule?.instructor?.user?.name}
                            </p>
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-10 text-center">
                        <p className="text-[0.7rem] text-text-primary/30 uppercase font-black tracking-[0.15em] mb-6">How would you rate this class?</p>

                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 border-none bg-transparent cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={40}
                                        fill={(hoverRating || rating) >= star ? '#DE95AD' : 'none'}
                                        className={(hoverRating || rating) >= star ? 'text-frost-byte' : 'text-polar-night/10'}
                                        strokeWidth={1.5}
                                    />
                                </button>
                            ))}
                        </div>

                        <p className="mt-8 font-bold text-frost-byte h-6 text-sm italic">
                            {(hoverRating || rating) === 1 && 'Needs Improvement'}
                            {(hoverRating || rating) === 2 && 'Fair Experience'}
                            {(hoverRating || rating) === 3 && 'Good Session'}
                            {(hoverRating || rating) === 4 && 'Great Artistry'}
                            {(hoverRating || rating) === 5 && 'Absolutely Stunning!'}
                        </p>
                    </div>

                    {/* Comment Area */}
                    <div className="mb-10">
                        <label className="text-[0.7rem] text-text-primary/30 uppercase font-black tracking-[0.15em] mb-4 block">
                            Update your experience
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            placeholder="What did you love about the class? How was the instructor's technique?"
                            className="w-full p-6 h-40 bg-frozen/5 border border-polar-night/5 rounded-2xl focus:bg-white focus:shadow-inner focus:border-frost-byte/30 transition-all outline-none text-[0.95rem] resize-none placeholder-text-primary/20"
                        ></textarea>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to={ROUTES.MY_REVIEWS}
                            className="flex-1 py-4 bg-frozen/50 text-polar-night rounded-xl font-bold text-[0.95rem] text-center no-underline hover:bg-frozen transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-[2] py-4 bg-polar-night text-white rounded-xl font-bold text-[0.95rem] shadow-lg shadow-polar-night/10 hover:bg-frost-byte transition-all flex items-center justify-center gap-3 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Updating...' : 'Update Review'}
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
};

export default EditReviewPage;
