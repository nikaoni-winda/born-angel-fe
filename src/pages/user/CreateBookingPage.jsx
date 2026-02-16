import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import UserLayout from '../../components/layout/UserLayout';
import serviceService from '../../services/serviceService';
import scheduleService from '../../services/scheduleService';
import bookingService from '../../services/bookingService';
import {
    Calendar,
    Clock,
    User,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    ShoppingBag,
    Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '../../utils/constants';

const CreateBookingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const scheduleId = searchParams.get('schedule_id');
    const serviceId = searchParams.get('service_id');

    const [service, setService] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Accept either schedule_id (from Browse Classes) or service_id (from Services page)
        if (!scheduleId && !serviceId) {
            toast.error("No service or schedule selected");
            navigate(ROUTES.BROWSE_CLASSES);
            return;
        }
        fetchData();
    }, [scheduleId, serviceId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // If schedule_id is provided, fetch that specific schedule
            if (scheduleId) {
                const scheduleData = await scheduleService.getById(scheduleId);
                setService(scheduleData.service);
                setSchedules([scheduleData]);
                setSelectedSchedule(scheduleData); // Auto-select the schedule
            }
            // Otherwise, fetch all schedules for the service
            else if (serviceId) {
                const [serviceData, schedulesData] = await Promise.all([
                    serviceService.getById(serviceId),
                    scheduleService.getAll({ service_id: serviceId })
                ]);
                setService(serviceData);
                // Filter only upcoming and available schedules
                const upcomingAvailable = schedulesData.filter(s =>
                    new Date(s.start_time) > new Date() && s.remaining_slots > 0
                );
                setSchedules(upcomingAvailable);
            }
        } catch (error) {
            toast.error("Failed to load booking data");
            navigate(ROUTES.BROWSE_CLASSES);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedSchedule) {
            toast.error("Please select a schedule");
            return;
        }

        try {
            setSubmitting(true);
            await bookingService.create({ schedule_id: selectedSchedule.id });
            toast.success("Booking created successfully! Please proceed to payment.");
            navigate(ROUTES.MY_BOOKINGS);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create booking");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <UserLayout>
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-frost-byte"></div>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="max-w-4xl mx-auto">
                <Link to={ROUTES.BROWSE_CLASSES} className="inline-flex items-center gap-2 text-text-primary/60 hover:text-frost-byte transition-colors mb-8 no-underline font-medium">
                    <ArrowLeft size={18} /> Back to Classes
                </Link>

                <div className="bg-white rounded-3xl border border-polar-night/5 shadow-sm overflow-hidden mb-8">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-56 md:h-auto overflow-hidden">
                            <img src={service?.image} alt={service?.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-8 flex-grow">
                            <span className="inline-block px-3 py-1 bg-frost-byte/10 text-frost-byte rounded-full font-bold text-[0.65rem] uppercase tracking-widest mb-3">
                                Selected Class
                            </span>
                            <h1 className="font-heading text-3xl text-polar-night font-bold mb-3">{service?.name}</h1>
                            <div className="flex items-center gap-5 text-[0.95rem]">
                                <span className="text-polar-night font-bold">IDR {parseFloat(service?.price).toLocaleString('id-ID')}</span>
                                <span className="w-1 h-1 bg-polar-night/10 rounded-full"></span>
                                <span className="text-text-primary/40 font-light">{service?.duration_minutes} Minutes</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="font-heading text-xl text-polar-night font-bold mb-6 flex items-center gap-2">
                        <Calendar size={20} className="text-frost-byte" /> Select Schedule
                    </h3>

                    {schedules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {schedules.map((schedule) => (
                                <button
                                    key={schedule.id}
                                    onClick={() => setSelectedSchedule(schedule)}
                                    className={`
                                        p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden group
                                        ${selectedSchedule?.id === schedule.id
                                            ? 'border-frost-byte bg-frost-byte/5 shadow-sm'
                                            : 'border-white bg-white hover:border-frozen hover:bg-frozen/20'
                                        }
                                    `}
                                >
                                    {selectedSchedule?.id === schedule.id && (
                                        <div className="absolute top-4 right-4 text-frost-byte">
                                            <CheckCircle2 size={20} />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-polar-night/30 font-bold text-[0.6rem] uppercase tracking-[0.1em]">
                                            <Calendar size={12} />
                                            <span>{new Date(schedule.start_time).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })}</span>
                                        </div>
                                        <div className="text-lg font-heading font-bold text-polar-night">
                                            {new Date(schedule.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                                        </div>
                                        <div className="flex items-center gap-2 text-[0.85rem] text-text-primary/50 font-medium">
                                            <Clock size={14} />
                                            <span>
                                                {new Date(schedule.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                                            </span>
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-polar-night/5 flex items-center gap-2 text-frost-byte font-bold text-[0.8rem]">
                                            <User size={14} />
                                            <span>{schedule.instructor?.user?.name}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 bg-white rounded-[2.5rem] border border-white text-center">
                            <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
                            <h4 className="font-heading text-[1.2rem] text-polar-night font-bold mb-2">No Schedules Available</h4>
                            <p className="text-text-primary/60 font-light">There are no upcoming sessions for this class. Please check back later.</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center">
                    <button
                        onClick={handleBooking}
                        disabled={!selectedSchedule || submitting}
                        className={`
                            w-full md:w-auto px-16 py-5 rounded-full font-heading font-bold text-[1.1rem] transition-all flex items-center justify-center gap-3 border-none shadow-xl
                            ${!selectedSchedule || submitting
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-polar-night text-white shadow-polar-night/20 hover:bg-frost-byte hover:-translate-y-1 cursor-pointer'
                            }
                        `}
                    >
                        {buttonContent()}
                    </button>
                    <p className="mt-6 text-[0.85rem] text-text-primary/40 text-center max-w-sm">
                        By clicking confirm, you agree to our terms and conditions. Payment must be completed via Midtrans.
                    </p>
                </div>
            </div>
        </UserLayout>
    );

    function buttonContent() {
        if (submitting) return 'Processing...';
        return (
            <>
                <ShoppingBag size={20} /> Confirm My Booking
            </>
        );
    }
};

export default CreateBookingPage;
