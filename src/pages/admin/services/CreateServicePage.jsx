import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import serviceService from '../../../services/serviceService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const CreateServicePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration: '',
        description: '',
        image: null // New state for image file
    });

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

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
        setLoading(true);

        try {
            // Create FormData for file upload
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('price', formData.price);
            payload.append('duration_minutes', formData.duration);
            payload.append('description', formData.description);
            // payload.append('type', 'makeup'); // Keep if backend requires it, otherwise omit

            if (formData.image) {
                payload.append('image', formData.image);
            }

            // Note: Backend expects 'duration_minutes', let's check input name
            // Input name is 'duration', backend validation likely 'duration_minutes'
            // Let's assume input maps to duration_minutes
            if (formData.duration) {
                payload.append('duration_minutes', formData.duration);
            }

            await serviceService.create(payload);
            toast.success('Service created successfully!');
            navigate(ROUTES.ADMIN_SERVICES);
        } catch (error) {
            console.error("Error creating service:", error);
            const message = error.response?.data?.message || 'Failed to create service';
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
                        onClick={() => navigate(ROUTES.ADMIN_SERVICES)}
                        className="p-2 hover:bg-frozen/20 rounded-xl transition-colors text-polar-night/60 hover:text-polar-night"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-polar-night">Add New Service</h1>
                        <p className="text-text-primary/60 text-sm">Create a new service offering</p>
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
                                placeholder="e.g. Basic Makeup Class"
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
                                    placeholder="e.g. 500000"
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
                                    placeholder="e.g. 120"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">Service Image</label>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Visual Preview Area */}
                                {preview && (
                                    <div className="w-full md:w-48 h-48 shrink-0 bg-frozen/5 rounded-xl border border-polar-night/10 flex items-center justify-center p-2 relative group mt-1">
                                        <img
                                            src={preview}
                                            alt="Service Preview"
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                        />
                                        {/* Badge */}
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
                                        name="image"
                                        onChange={handleChange}
                                        accept="image/*"
                                        className="w-full px-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-frost-byte/10 file:text-frost-byte hover:file:bg-frost-byte/20 transition-all cursor-pointer"
                                    />
                                    <p className="text-xs text-text-primary/60 mt-2 leading-relaxed">
                                        Max file size: 5MB. Allowed formats: JPG, PNG.
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
                                placeholder="Describe slightly about this service..."
                            ></textarea>
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
                                        <span>Save Service</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        </AdminLayout >
    );
};

export default CreateServicePage;
