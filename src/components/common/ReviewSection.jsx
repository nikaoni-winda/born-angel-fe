import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import reviewService from '../../services/reviewService';

const ReviewSection = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await reviewService.getTestimonials({ per_page: 3 });
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <secton className="py-24 bg-[#fff0f5] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
            </secton>
        );
    }

    return (
        <section className="pt-8 pb-24 bg-[#fff0f5] w-full relative overflow-hidden">
            {/* Background Decorations - Removed for consistency */}

            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block text-[1.1rem] text-frost-byte mb-3 font-heading italic font-medium tracking-wide">Testimonials</span>
                    <h2 className="font-heading text-[2.5rem] lg:text-[3rem] text-polar-night font-bold leading-tight">
                        What Did They Say About Us?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 relative group">
                            <Quote className="absolute top-6 right-6 text-frost-byte/20 w-12 h-12 rotate-180" />

                            <div className="mb-4">
                                <h4 className="font-heading text-[1.2rem] text-polar-night font-bold leading-none mb-2">
                                    {review.booking?.user?.name || "Happy Customer"}
                                </h4>
                                <div className="flex gap-1 text-glacier-glow">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                                    ))}
                                </div>
                            </div>

                            <p className="text-[0.95rem] text-text-primary/80 leading-relaxed font-light italic">
                                "{review.comment}"
                            </p>
                            <p className="mt-4 text-[0.8rem] text-frost-byte/60 font-medium tracking-wide">
                                Class: {review.booking?.schedule?.service?.name}
                            </p>
                        </div>
                    ))}
                </div>

                {/* View All Reviews Button */}
                <div className="text-center mt-12">
                    <Link to="/reviews" className="inline-block px-10 py-3 border border-polar-night text-polar-night font-body font-medium text-[0.9rem] rounded-full uppercase tracking-widest transition-all duration-300 no-underline relative overflow-hidden z-10 hover:bg-polar-night hover:text-white hover:border-polar-night hover:shadow-lg">
                        View All Reviews
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;
