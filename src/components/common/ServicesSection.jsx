import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import serviceService from '../../services/serviceService';

const ServicesSection = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await serviceService.getAll({ per_page: 100 });
                // Take only first 3 popular services for home page
                setServices(response.data.slice(0, 3));
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <secton className="py-24 w-full bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
            </secton>
        );
    }

    return (
        <section className="pt-24 pb-12 w-full bg-gradient-to-b from-white to-[#fff0f5] relative overflow-hidden">
            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block text-[1.2rem] text-frost-byte mb-3 font-heading italic font-medium tracking-wide">Our Popular Classes</span>
                    <h2 className="font-heading text-[2.5rem] text-polar-night leading-[1.2] font-bold">
                        Master the Techniques <br className="hidden sm:block" />
                        Used by Professionals
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.06)] relative group hover:shadow-[0_16px_36px_rgba(91,24,36,0.12)]">
                            <div className="w-full h-[280px] lg:h-[340px] overflow-hidden relative bg-icy-veil">
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-500" />
                                <div className="absolute inset-0 bg-polar-night/40 flex items-center justify-center opacity-0 transition-opacity duration-300 backdrop-blur-[2px] group-hover:opacity-100">
                                    <Link to={`/services/${service.id}`} className="px-7 py-3 bg-white text-polar-night font-heading font-semibold text-[0.95rem] rounded-full transition-all duration-300 no-underline shadow-lg hover:bg-polar-night hover:text-white">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                            <div className="py-5 px-6 text-center bg-white relative z-10">
                                <h3 className="font-heading text-[1.2rem] font-semibold text-polar-night mb-1">{service.name}</h3>
                                <p className="font-body text-[1rem] text-frost-byte font-medium tracking-wide m-0">IDR {parseFloat(service.price).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link to="/services" className="inline-block px-10 py-3 border border-polar-night text-polar-night font-body font-medium text-[0.9rem] rounded-full uppercase tracking-widest transition-all duration-300 no-underline relative overflow-hidden z-10 hover:bg-polar-night hover:text-white hover:border-polar-night hover:shadow-lg">
                        View All Classes
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
