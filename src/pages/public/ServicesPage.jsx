import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import serviceService from '../../services/serviceService';
import Pagination from '../../components/Pagination';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { Clock, Tag, ChevronRight } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });
  const { isAuthenticated } = useAuth();
  const authed = isAuthenticated();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async (page = 1) => {
    try {
      setLoading(true);
      const data = await serviceService.getAll({ page, per_page: 9 });
      setServices(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        from: data.from,
        to: data.to,
      });
    } catch (error) {
      console.error("Error fetching services:", error);
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
              Our Luxury <span className="text-frost-byte italic font-light">Classes</span>
            </h1>
            <p className="max-w-xl mx-auto text-sm text-text-primary/70 font-light leading-relaxed">
              Discover professional techniques designed to elevate your artistry.
              From everyday essentials to cinematic transformation.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(91,24,36,0.1)] flex flex-col h-full border border-white/50"
                >
                  {/* Image Container */}
                  <Link to={`/services/${service.id}`} className="relative h-[200px] overflow-hidden block">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-frost-byte font-heading font-semibold text-xs shadow-sm">
                      IDR {parseFloat(service.price).toLocaleString('id-ID')}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex-grow flex flex-col">
                    <Link to={`/services/${service.id}`}>
                      <h3 className="font-heading text-lg text-polar-night font-bold mb-2 group-hover:text-frost-byte transition-colors">
                        {service.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-text-primary/70 font-light leading-relaxed mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-polar-night/5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-text-primary/60 text-xs">
                        <Clock size={14} strokeWidth={1.5} />
                        <span>{service.duration_minutes} Mins</span>
                      </div>
                      <Link
                        to={authed ? `${ROUTES.SERVICES}/${service.id}` : ROUTES.LOGIN}
                        className="flex items-center gap-1 text-frost-byte font-semibold text-xs group-hover:gap-2 transition-all hover:text-polar-night"
                      >
                        Enrol Now <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && services.length > 0 && (
            <div className="mt-12">
              <Pagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                total={pagination.total}
                from={pagination.from}
                to={pagination.to}
                onPageChange={(page) => fetchServices(page)}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
