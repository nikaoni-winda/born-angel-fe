import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import serviceService from '../../../services/serviceService';
import Pagination from '../../../components/Pagination';
import { withMinDelay } from '../../../utils/loadingUtils';
import { Search, Trash2, Edit, Plus, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../components/common/ConfirmModal';

const ServicesListPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async (page = 1) => {
    try {
      setLoading(true);
      const data = await withMinDelay(serviceService.getAll({ page, per_page: 10 }));
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
      toast.error("Failed to load services list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await serviceService.delete(deleteId);
      toast.success('Service deleted successfully');
      fetchServices(pagination.current_page);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error('Failed to delete service');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-polar-night mb-2">Service Management</h1>
          <p className="text-text-primary/60 text-sm">Create and manage your class offerings</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/40" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 w-full md:w-64"
            />
          </div>
          {/* Add Button */}
          <Link
            to={ROUTES.ADMIN_SERVICES_CREATE}
            className="bg-polar-night text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-polar-night/90 transition-colors font-medium text-sm no-underline"
          >
            <Plus size={18} />
            <span>Add Service</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 min-h-[40vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
          <p className="text-text-primary/40 text-[0.85rem] italic font-medium">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-frozen/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-night/5">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-frozen/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-polar-night text-sm">{service.name}</span>
                          <span className="text-xs text-text-primary/40 italic line-clamp-1">{service.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-emerald-600">
                          IDR {parseInt(service.price).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-text-primary/70">
                          <Clock size={14} className="text-amber-500" />
                          <span>{service.duration_minutes} min</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={ROUTES.ADMIN_SERVICES_EDIT.replace(':id', service.id)}
                            className="p-2 hover:bg-frozen/20 text-text-primary/60 hover:text-polar-night rounded-lg transition-colors"
                            title="Edit Service"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(service.id)}
                            className="p-2 hover:bg-red-50 text-text-primary/40 hover:text-red-500 rounded-lg transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-text-primary/40">
                      <p>No services found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Are you sure? This may affect existing schedules."
      />
    </AdminLayout>
  );
};


export default ServicesListPage;
