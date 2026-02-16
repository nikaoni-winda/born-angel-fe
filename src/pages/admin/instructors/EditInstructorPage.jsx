import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import instructorService from '../../../services/instructorService';
import serviceService from '../../../services/serviceService';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import AdminFilterDropdown from '../../../components/admin/AdminFilterDropdown';

const EditInstructorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Data Sources
    const [services, setServices] = useState([]);

    // Image State
    const [currentPhoto, setCurrentPhoto] = useState(null); // URL from backend
    const [preview, setPreview] = useState(null); // Preview for new upload

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
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
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [servicesRes, instructorData] = await Promise.all([
                serviceService.getAll({ per_page: 100 }),
                instructorService.getById(id)
            ]);

            setServices(servicesRes.data.map(s => ({ label: s.name, value: s.id })));

            setFormData({
                name: instructorData.user?.name || '',
                email: instructorData.user?.email || '',
                phone_number: instructorData.user?.phone_number || '',
                service_id: instructorData.service_id,
                bio: instructorData.bio,
                photo: null
            });
            setCurrentPhoto(instructorData.photo);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load instructor details");
            navigate(ROUTES.ADMIN_INSTRUCTORS);
        } finally {
            setLoading(false);
        }
    };

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
        setSubmitting(true);

        try {
            // Create FormData
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            payload.append('phone_number', formData.phone_number);
            payload.append('service_id', formData.service_id);
            payload.append('bio', formData.bio);

            if (formData.photo) {
                payload.append('photo', formData.photo);
            }

            await instructorService.update(id, payload);
            toast.success('Instructor profile updated successfully!');
            navigate(ROUTES.ADMIN_INSTRUCTORS);
        } catch (error) {
            console.error("Error updating instructor:", error);
            const message = error.response?.data?.message || 'Failed to update profile';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
                </div>
            </AdminLayout>
        );
    }

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
                        <h1 className="text-2xl font-bold text-polar-night">Edit Instructor</h1>
                        <p className="text-text-primary/60 text-sm">Update instructor profile and account</p>
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

                        {/* Phone Number */}
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
                                {(preview || currentPhoto) && (
                                    <div className="w-full md:w-48 h-48 shrink-0 bg-frozen/5 rounded-xl border border-polar-night/10 flex items-center justify-center p-2 relative group mt-1">
                                        <img
                                            src={preview || currentPhoto}
                                            alt="Instructor Preview"
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white shadow-sm ${preview ? 'bg-amber-500' : 'bg-frost-byte'}`}>
                                                {preview ? 'New' : 'Current'}
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
                                        <br />
                                        <span className="italic text-text-primary/40">Leave empty to keep using the current photo.</span>
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
                                disabled={submitting || !formData.service_id}
                                className="px-6 py-2.5 rounded-xl bg-polar-night text-white font-medium hover:bg-polar-night/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Update Instructor</span>
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

export default EditInstructorPage;
