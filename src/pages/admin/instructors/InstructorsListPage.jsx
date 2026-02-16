import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import instructorService from '../../../services/instructorService';
import serviceService from '../../../services/serviceService';
import Pagination from '../../../components/Pagination';
import { withMinDelay } from '../../../utils/loadingUtils';
import { Search, Trash2, Edit, Plus, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import AdminFilterDropdown from '../../../components/admin/AdminFilterDropdown';
import ConfirmModal from '../../../components/common/ConfirmModal';

const InstructorsListPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [filterService, setFilterService] = useState('all');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const [instructorsData, servicesData] = await withMinDelay(Promise.all([
        instructorService.getAll({ page, per_page: 10 }),
        serviceService.getAll({ per_page: 100 })
      ]));
      setInstructors(instructorsData.data);
      setPagination({
        current_page: instructorsData.current_page,
        last_page: instructorsData.last_page,
        total: instructorsData.total,
        from: instructorsData.from,
        to: instructorsData.to,
      });
      setServices(servicesData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await instructorService.delete(deleteId);
      toast.success('Instructor deleted successfully');
      fetchData(pagination.current_page);
    } catch (error) {
      console.error("Error deleting instructor:", error);
      toast.error('Failed to delete instructor');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch =
      instructor.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.service?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService = filterService === 'all' || instructor.service?.id.toString() === filterService;

    return matchesSearch && matchesService;
  });

  const serviceOptions = [
    { label: 'All Specializations', value: 'all' },
    ...services.map(s => ({ label: s.name, value: s.id.toString() }))
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-polar-night mb-2">Instructor Management</h1>
            <p className="text-text-primary/60 text-sm">Manage teaching staff profiles</p>
          </div>

          <Link
            to={ROUTES.ADMIN_INSTRUCTORS_CREATE}
            className="bg-polar-night text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-polar-night/90 transition-colors font-medium text-sm no-underline"
          >
            <Plus size={18} />
            <span>Add Instructor</span>
          </Link>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-polar-night/5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Service Filter */}
          <div className="w-full md:w-auto">
            <AdminFilterDropdown
              options={serviceOptions}
              value={filterService}
              onChange={setFilterService}
              placeholder="Filter Specialization"
              className="w-full md:w-auto"
            />
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/40" size={20} />
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 w-full"
            />
          </div>
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
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Bio Preview</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-night/5">
                {filteredInstructors.length > 0 ? (
                  filteredInstructors.map((instructor) => (
                    <tr key={instructor.id} className="hover:bg-frozen/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-polar-night/5 flex items-center justify-center text-polar-night overflow-hidden">
                            {instructor.photo ? (
                              <img src={instructor.photo} alt={instructor.user?.name} className="w-full h-full object-cover" />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-polar-night text-sm">{instructor.user?.name}</p>
                            <p className="text-xs text-text-primary/40">{instructor.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-frost-byte/10 text-polar-night capitalize">
                          {instructor.service?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-text-primary/60 line-clamp-2 max-w-xs italic">
                          "{instructor.bio}"
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={ROUTES.ADMIN_INSTRUCTORS_EDIT.replace(':id', instructor.id)}
                            className="p-2 hover:bg-frozen/20 text-text-primary/60 hover:text-polar-night rounded-lg transition-colors"
                            title="Edit Profile"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(instructor.id)}
                            className="p-2 hover:bg-red-50 text-text-primary/40 hover:text-red-500 rounded-lg transition-colors"
                            title="Delete Profile"
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
                      <p>No instructors found matching criteria.</p>
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
            onPageChange={(page) => fetchData(page)}
          />
        </div>
      )}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Instructor"
        message="Are you sure you want to delete this instructor profile?"
      />
    </AdminLayout>
  );
};

export default InstructorsListPage;
