import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import AdminFilterDropdown from '../../../components/admin/AdminFilterDropdown';
import scheduleService from '../../../services/scheduleService';
import instructorService from '../../../services/instructorService';
import serviceService from '../../../services/serviceService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Clock } from 'lucide-react';

const CreateSchedulePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [instructors, setInstructors] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        service_id: '',
        instructor_id: '',
        start_time: '',
        end_time: '',
        capacity: 10,
        location: 'Born Angel Studio'
    });

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const [instructorsRes, servicesRes] = await Promise.all([
                instructorService.getAll({ per_page: 100 }),
                serviceService.getAll({ per_page: 100 })
            ]);
            setInstructors(instructorsRes.data);
            setServices(servicesRes.data);
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("Failed to load instructors or services");
        }
    };

    // Format services for dropdown
    const serviceOptions = useMemo(() => {
        return services.map(s => ({
            label: s.duration ? `${s.name} (${s.duration} mins)` : s.name,
            value: s.id
        }));
    }, [services]);

    // Filter instructors based on selected service
    const filteredInstructorOptions = useMemo(() => {
        if (!formData.service_id) {
            return instructors.map(i => ({
                label: `${i.user?.name} - ${i.service?.name}`,
                value: i.id
            }));
        }

        // Only show instructors with matching service_id
        return instructors
            .filter(i => i.service_id === parseInt(formData.service_id))
            .map(i => ({
                label: i.user?.name,
                value: i.id
            }));
    }, [instructors, formData.service_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (value) => {
        const service = services.find(s => s.id === value);

        // Reset instructor when service changes
        setFormData(prev => ({ ...prev, service_id: value, instructor_id: '' }));

        // Auto-calculate end_time based on start_time and service duration if possible
        if (service && formData.start_time) {
            const start = new Date(formData.start_time);
            const end = new Date(start.getTime() + service.duration_minutes * 60000);

            // Format to HTML datetime-local string (YYYY-MM-DDTHH:mm)
            const offset = end.getTimezoneOffset() * 60000;
            const localEnd = new Date(end.getTime() - offset).toISOString().slice(0, 16);

            setFormData(prev => ({ ...prev, end_time: localEnd }));
        }
    };

    const handleInstructorChange = (value) => {
        setFormData(prev => ({ ...prev, instructor_id: value }));
    };

    const handleStartTimeChange = (e) => {
        const startTime = e.target.value;
        const service = services.find(s => s.id === formData.service_id);

        if (service && startTime) {
            const start = new Date(startTime);
            const end = new Date(start.getTime() + service.duration_minutes * 60000);
            const offset = end.getTimezoneOffset() * 60000;
            const localEnd = new Date(end.getTime() - offset).toISOString().slice(0, 16);

            setFormData(prev => ({ ...prev, start_time: startTime, end_time: localEnd }));
        } else {
            setFormData(prev => ({ ...prev, start_time: startTime }));
        }
    };

    const now = new Date();
    const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (new Date(formData.start_time) < new Date()) {
            toast.error('Start time cannot be in the past');
            return;
        }

        setLoading(true);

        try {
            await scheduleService.create(formData);
            toast.success('Schedule created successfully!');
            navigate(ROUTES.ADMIN_SCHEDULES);
        } catch (error) {
            console.error("Error creating schedule:", error);
            const message = error.response?.data?.message || 'Failed to create schedule';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.ADMIN_SCHEDULES)}
                        className="p-2 hover:bg-frozen/20 rounded-xl transition-colors text-polar-night/60 hover:text-polar-night"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-polar-night">Create Schedule</h1>
                        <p className="text-text-primary/60 text-sm">Add a new class to the calendar</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Service Selection */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Service (Class)</label>
                            <AdminFilterDropdown
                                options={serviceOptions}
                                value={formData.service_id}
                                onChange={handleServiceChange}
                                placeholder="Select Class..."
                            />
                        </div>

                        {/* Instructor Selection */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Instructor</label>
                            <AdminFilterDropdown
                                options={filteredInstructorOptions}
                                value={formData.instructor_id}
                                onChange={handleInstructorChange}
                                placeholder={formData.service_id ? "Select Instructor..." : "Select a class first..."}
                            />
                            {formData.service_id && filteredInstructorOptions.length === 0 && (
                                <p className="text-xs text-red-500 mt-2 italic">No instructors available for this class</p>
                            )}
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Start Time</label>
                                <div className="relative">
                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-polar-night/40 pointer-events-none z-10" />
                                    <input
                                        type="datetime-local"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleStartTimeChange}
                                        min={minDateTime}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">End Time</label>
                                <div className="relative">
                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-polar-night/40 pointer-events-none z-10" />
                                    <input
                                        type="datetime-local"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                    />
                                </div>
                                <p className="text-[0.65rem] text-text-primary/40 mt-1 italic">Auto-calculated if service selected</p>
                            </div>
                        </div>

                        {/* Capacity & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Maximum Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-polar-night text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-polar-night/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Create Schedule</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateSchedulePage;
