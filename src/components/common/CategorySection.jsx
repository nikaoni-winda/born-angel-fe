import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import instructorService from '../../services/instructorService';

const CategorySection = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await instructorService.getAll({ per_page: 100 });
                // Take first 4 instructors for home page
                setInstructors(response.data.slice(0, 4));
            } catch (error) {
                console.error("Error fetching instructors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-[#fff0f5] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
            </section>
        );
    }

    return (
        <section className="pt-12 pb-16 bg-[#fff0f5] w-full relative overflow-hidden">
            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block text-[1.2rem] text-frost-byte mb-3 font-heading italic font-medium tracking-wide">World-Class Talent</span>
                    <h2 className="font-heading text-[2.5rem] text-polar-night leading-[1.2] font-bold">Meet Our Instructors</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {instructors.map((instructor) => (
                        <Link
                            key={instructor.id}
                            to={`/instructors/${instructor.id}`}
                            className="group relative flex flex-col items-center no-underline"
                        >
                            {/* Oval Image with Border - Scaled down */}
                            <div className="relative w-[210px] h-[280px] lg:w-[220px] lg:h-[300px] border border-polar-night/30 rounded-[110px] p-2 mb-5 bg-transparent transition-all duration-300">
                                <div className="w-full h-full rounded-[100px] overflow-hidden relative bg-white">
                                    <img
                                        src={instructor.photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"}
                                        alt={instructor.user?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="text-center p-2 max-w-[240px]">
                                <h3 className="font-heading text-[1.2rem] text-polar-night font-semibold mb-1 transition-colors group-hover:text-frost-byte">
                                    {instructor.user?.name}
                                </h3>
                                <p className="text-[0.75rem] text-frost-byte font-medium uppercase tracking-widest mb-2">
                                    {instructor.service?.name || 'Vocal Master'}
                                </p>
                                <p className="text-[0.85rem] text-text-primary/70 leading-relaxed font-light line-clamp-3">
                                    {instructor.bio}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link to="/instructors" className="inline-block px-10 py-3 border border-polar-night text-polar-night font-body font-medium text-[0.9rem] rounded-full uppercase tracking-widest transition-all duration-300 no-underline relative overflow-hidden z-10 hover:bg-polar-night hover:text-white hover:border-polar-night hover:shadow-lg">
                        View All Instructors
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
