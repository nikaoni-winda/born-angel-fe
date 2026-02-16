import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import serviceService from '../../services/serviceService';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { Clock, Tag, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const authed = isAuthenticated();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await serviceService.getById(id);
        setService(data);
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-frozen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-frost-byte"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-frozen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl font-bold text-polar-night mb-4">Service Not Found</h2>
          <Link to={ROUTES.SERVICES} className="text-frost-byte hover:underline flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-frozen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <Link to={ROUTES.SERVICES} className="inline-flex items-center gap-2 text-text-primary/60 hover:text-frost-byte transition-colors mb-5 no-underline font-medium text-sm">
            <ArrowLeft size={18} strokeWidth={1.5} /> Back to All Classes
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Image */}
            <div className="aspect-[3/4] max-h-[480px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Box */}
            <div className="flex flex-col">
              <div className="mb-5">
                <span className="inline-block px-3 py-1 bg-frost-byte/10 text-frost-byte rounded-full font-heading font-semibold text-xs uppercase tracking-wider mb-4">
                  Course Specialty
                </span>
                <h1 className="font-heading text-2xl lg:text-3xl text-polar-night font-bold leading-tight mb-4">
                  {service.name}
                </h1>
                <div className="flex flex-wrap gap-6 items-center border-y border-polar-night/5 py-4">
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] text-text-primary/40 uppercase font-bold tracking-widest mb-1">Duration</span>
                    <div className="flex items-center gap-2 text-polar-night font-medium text-sm">
                      <Clock size={15} className="text-frost-byte" />
                      <span>{service.duration_minutes} Minutes Session</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] text-text-primary/40 uppercase font-bold tracking-widest mb-1">Investment</span>
                    <div className="flex items-center gap-2 text-polar-night font-bold text-base">
                      <Tag size={15} className="text-frost-byte" />
                      <span>IDR {parseFloat(service.price).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-heading text-base text-polar-night font-bold mb-3">Course Overview</h3>
                <p className="text-sm text-text-primary/70 font-light leading-relaxed mb-5">
                  {service.description}
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0">
                  {['Professional Certificate', 'Makeup Kit Provided', 'Live Demonstration', 'Hands-on Practice'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-primary/80 text-sm font-light">
                      <CheckCircle2 size={17} className="text-frost-byte shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={authed ? `${ROUTES.CREATE_BOOKING}?service_id=${service.id}` : ROUTES.LOGIN}
                  state={!authed ? { from: { pathname: `${ROUTES.CREATE_BOOKING}?service_id=${service.id}` } } : undefined}
                  className="flex-grow sm:flex-grow-0 px-8 py-3.5 bg-polar-night text-white rounded-full font-heading font-bold text-sm text-center no-underline shadow-lg hover:bg-frost-byte hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} /> Book This Class
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
