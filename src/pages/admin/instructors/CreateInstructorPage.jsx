import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import instructorService from '../../../services/instructorService';
import serviceService from '../../../services/serviceService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import AdminFilterDropdown from '../../../components/admin/AdminFilterDropdown';

const CreateInstructorPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        service_id: '',
        bio: '',
        photo: null
    });

    // Cleanup preview on unmount
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await serviceService.getAll({ per_page: 100 });
                setServices(response.data.map(s => ({ label: s.name, value: s.id })));
            } catch (error) {
                console.error("Error fetching services:", error);
                toast.error("Failed to load services");
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            const file = files[0];
            setFormData(prev => ({ ...prev, photo: file }));

            if (file) {
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
            } else {
                setPreview(null);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSpecializationChange = (value) => {
        setFormData(prev => ({ ...prev, service_id: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create FormData
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            payload.append('phone_number', formData.phone_number);
            payload.append('password', formData.password);
            payload.append('service_id', formData.service_id);
            payload.append('bio', formData.bio);

            if (formData.photo) {
                payload.append('photo', formData.photo);
            }

            await instructorService.create(payload);
            toast.success('Instructor account created successfully!');
            navigate(ROUTES.ADMIN_INSTRUCTORS);
        } catch (error) {
            console.error("Error creating instructor:", error);
            const message = error.response?.data?.message || 'Failed to create instructor profile';
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
                        onClick={() => navigate(ROUTES.ADMIN_INSTRUCTORS)}
                        className="p-2 hover:bg-frozen/20 rounded-xl transition-colors text-polar-night/60 hover:text-polar-night"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-polar-night">Add New Instructor</h1>
                        <p className="text-text-primary/60 text-sm">Register a new instructor account & profile</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name & Email Field */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Instructor Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                    placeholder="e.g. Cassandra Lee"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                    placeholder="e.g. cassandra@born-angel.com"
                                />
                            </div>
                        </div>

                        {/* Phone & Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                    placeholder="e.g. 08123456789"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Account Password</label>
                                <input
                                    type="text" // Visible password
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white font-mono text-sm"
                                    placeholder="Create a login password"
                                />
                            </div>
                        </div>

                        {/* Specialization Selection */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Specialization</label>
                            <AdminFilterDropdown
                                options={services}
                                value={formData.service_id}
                                onChange={handleSpecializationChange}
                                placeholder="Select Specialization..."
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Professional Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white resize-none"
                                placeholder="Write a short professional biography..."
                            ></textarea>
                        </div>

                        {/* Photo Upload (Side-by-Side) */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Instructor Photo</label>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Visual Preview Area */}
                                {preview && (
                                    <div className="w-full md:w-48 h-48 shrink-0 bg-frozen/5 rounded-xl border border-polar-night/10 flex items-center justify-center p-2 relative group mt-1">
                                        <img
                                            src={preview}
                                            alt="Instructor Preview"
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white shadow-sm bg-amber-500">
                                                New
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* File Input */}
                                <div className="flex-1 w-full">
                                    <input
                                        type="file"
                                        name="photo"
                                        onChange={handleChange}
                                        accept="image/*"
                                        className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-frost-byte/10 file:text-frost-byte hover:file:bg-frost-byte/20 transition-all cursor-pointer"
                                    />
                                    <p className="text-xs text-text-primary/60 mt-2 leading-relaxed">
                                        Professional headshot recommended. Max 5MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.ADMIN_INSTRUCTORS)}
                                className="px-6 py-2.5 rounded-xl text-polar-night font-medium hover:bg-frozen/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.service_id}
                                className="px-6 py-2.5 rounded-xl bg-polar-night text-white font-medium hover:bg-polar-night/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Create Instructor & Account</span>
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

export default CreateInstructorPage;
