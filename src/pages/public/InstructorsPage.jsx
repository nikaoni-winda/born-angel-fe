import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import instructorService from '../../services/instructorService';
import Pagination from '../../components/Pagination';
import { Instagram, Linkedin, Star } from 'lucide-react';

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async (page = 1) => {
    try {
      setLoading(true);
      const data = await instructorService.getAll({ page, per_page: 9 });
      setInstructors(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        from: data.from,
        to: data.to,
      });
    } catch (error) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-frozen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="font-heading text-2xl lg:text-3xl text-polar-night font-bold leading-tight mb-2">
              Master <span className="text-frost-byte italic font-light">Instructors</span>
            </h1>
            <p className="max-w-xl mx-auto text-sm text-text-primary/70 font-light leading-relaxed">
              Learn from the industry's most visionary artists who have defined
              modern beauty standards across the globe.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="group relative bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(91,24,36,0.1)] border border-white/50"
                >
                  {/* Profile Image */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 border-2 border-dashed border-frost-byte/30 rounded-full animate-spin-slow group-hover:border-solid transition-all duration-500"></div>
                    <div className="absolute inset-1.5 overflow-hidden rounded-full border-2 border-white shadow-md">
                      <img
                        src={instructor.photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"}
                        alt={instructor.user?.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Instructor Info */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-0.5 mb-1.5 text-glacier-glow">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                    <h3 className="font-heading text-lg text-polar-night font-bold mb-0.5 group-hover:text-frost-byte transition-colors">
                      {instructor.user?.name}
                    </h3>
                    <p className="text-[0.7rem] text-frost-byte font-medium uppercase tracking-[0.15em] mb-3">
                      {instructor.service?.name || 'Vocal Artist'}
                    </p>

                    <p className="text-xs text-text-primary/70 font-light leading-relaxed mb-4 h-16 line-clamp-4">
                      {instructor.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3 pt-4 border-t border-polar-night/5">
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-frozen text-polar-night/40 hover:text-frost-byte hover:bg-white transition-all shadow-sm">
                        <Instagram size={16} strokeWidth={1.5} />
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-frozen text-polar-night/40 hover:text-frost-byte hover:bg-white transition-all shadow-sm">
                        <Linkedin size={16} strokeWidth={1.5} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && instructors.length > 0 && (
            <div className="mt-12">
              <Pagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                total={pagination.total}
                from={pagination.from}
                to={pagination.to}
                onPageChange={(page) => fetchInstructors(page)}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InstructorsPage;
