import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import serviceService from '../../../services/serviceService';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const EditServicePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentImage, setCurrentImage] = useState(null); // URL from backend
    const [preview, setPreview] = useState(null); // Preview for new upload

    // Cleanup preview
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration: '',
        description: '',
        image: null
    });

    useEffect(() => {
        fetchService();
    }, [id]);

    const fetchService = async () => {
        try {
            setLoading(true);
            const data = await serviceService.getById(id);
            setFormData({
                name: data.name,
                price: parseInt(data.price),
                duration: data.duration_minutes || data.duration, // Handle potential field name difference
                description: data.description || '',
                image: null
            });
            if (data.image) {
                setCurrentImage(data.image);
            }
        } catch (error) {
            console.error("Error fetching service:", error);
            toast.error("Failed to load service details");
            navigate(ROUTES.ADMIN_SERVICES);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData(prev => ({ ...prev, image: file }));

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Create FormData for upload
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('price', formData.price);
            // Map duration to duration_minutes
            if (formData.duration) {
                payload.append('duration_minutes', formData.duration);
            }
            payload.append('description', formData.description);

            // Only append image if a new file is selected
            if (formData.image instanceof File) {
                payload.append('image', formData.image);
            }

            await serviceService.update(id, payload);
            toast.success('Service updated successfully!');
            navigate(ROUTES.ADMIN_SERVICES);
        } catch (error) {
            console.error("Error updating service:", error);
            const message = error.response?.data?.message || 'Failed to update service';
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
                        onClick={() => navigate(ROUTES.ADMIN_SERVICES)}
                        className="p-2 hover:bg-frozen/20 rounded-xl transition-colors text-polar-night/60 hover:text-polar-night"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-polar-night">Edit Service</h1>
                        <p className="text-text-primary/60 text-sm">Update service details</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Service Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50"
                            />
                        </div>

                        {/* Price & Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Price (IDR)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Duration (Minutes)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Service Image</label>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Visual Preview Area */}
                                {(preview || currentImage) && (
                                    <div className="w-full md:w-48 h-48 shrink-0 bg-frozen/5 rounded-xl border border-polar-night/10 flex items-center justify-center p-2 relative group mt-1">
                                        <img
                                            src={preview || currentImage}
                                            alt="Service Preview"
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                        />
                                        {/* Badge */}
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
                                        name="image"
                                        onChange={handleChange}
                                        accept="image/*"
                                        className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-frost-byte/10 file:text-frost-byte hover:file:bg-frost-byte/20 transition-all cursor-pointer"
                                    />
                                    <p className="text-xs text-text-primary/60 mt-2 leading-relaxed">
                                        Max file size: 5MB. Allowed formats: JPG, PNG.
                                        <br />
                                        <span className="italic text-text-primary/40">Leave empty to keep using the current image.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 resize-none"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-polar-night text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-polar-night/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Update Service</span>
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

export default EditServicePage;
