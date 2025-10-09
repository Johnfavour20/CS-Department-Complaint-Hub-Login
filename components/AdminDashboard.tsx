import React, { useState, useMemo, useEffect } from 'react';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';
import ComplaintCard from './ComplaintCard';
import { DocumentTextIcon, MagnifyingGlassIcon, UserIcon, Cog6ToothIcon, BellIcon, ExclamationTriangleIcon, ClockIcon } from './icons';
import { useComplaints } from '../contexts/ComplaintContext';
import { useNotification } from '../contexts/NotificationContext';
import ComplaintDetailModal from './ComplaintDetailModal';
import { findUserById } from '../utils/userData';
import ProfileView from './ProfileView';
import ReportsView from './ReportsView';
import StatCard from './StatCard';

const AdminDashboard: React.FC = () => {
  const { complaints, dispatch } = useComplaints();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'complaints' | 'reports' | 'profile'>('complaints');
  const [filter, setFilter] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'status_asc' | 'status_desc'>('newest');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const now = new Date();
    // Set hours, minutes, seconds, and ms to 0 to compare dates only
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const overdue = complaints.filter(c => 
        c.dueDate && new Date(c.dueDate) < today && c.status !== ComplaintStatus.RESOLVED && c.status !== ComplaintStatus.CLOSED
    );

    const upcoming = complaints.filter(c => {
        if (!c.dueDate || c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.CLOSED) return false;
        const dueDate = new Date(c.dueDate);
        const dueDateTime = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();
        return dueDateTime === today.getTime();
    });

    if (overdue.length > 0 || upcoming.length > 0) {
        let message = '';
        if (overdue.length > 0) {
            message += `${overdue.length} complaint${overdue.length > 1 ? 's are' : ' is'} overdue.`;
        }
        if (upcoming.length > 0) {
            if(message) message += ' ';
            message += `${upcoming.length} complaint${upcoming.length > 1 ? 's are' : ' is'} due today.`;
        }
        showNotification(message, overdue.length > 0 ? 'error' : 'info');
    }
  }, [complaints, showNotification]);

  const handleStatusUpdate = (id: string, newStatus: ComplaintStatus, dueDate: string | null) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    const getHistoryNote = (oldStatus: ComplaintStatus, newStatus: ComplaintStatus): string => {
        if (oldStatus === newStatus) return 'Complaint details updated by admin.';
        return `Status changed from ${oldStatus} to ${newStatus}.`;
    };

    const newHistoryEntry = { status: newStatus, changedAt: new Date(), notes: getHistoryNote(complaint.status, newStatus) };
    const updatedHistory = [...complaint.history, newHistoryEntry];
    
    const resolvedAt = (newStatus === ComplaintStatus.RESOLVED || newStatus === ComplaintStatus.CLOSED) 
        ? (complaint.resolvedAt || new Date())
        : undefined;

    const updatedComplaint: Complaint = {
      ...complaint,
      status: newStatus,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      history: updatedHistory,
      resolvedAt,
      isReadByAdmin: true,
    };

    dispatch({ type: 'UPDATE_COMPLAINT', payload: updatedComplaint });
    showNotification(`Complaint ${id} updated successfully.`, 'success');
  };

  const handleNotesUpdate = (id: string, notes: string) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    const updatedComplaint = {
      ...complaint,
      adminNotes: notes,
      isReadByAdmin: true,
    };

    dispatch({ type: 'UPDATE_COMPLAINT', payload: updatedComplaint });
    showNotification(`Notes for complaint ${id} updated.`, 'success');
    setSelectedComplaint(updatedComplaint); // Keep modal in sync
  };
  
  const handleViewDetails = (complaint: Complaint) => {
    if (!complaint.isReadByAdmin) {
      // Optimistically update the UI to remove the "NEW" tag immediately
      dispatch({
        type: 'UPDATE_COMPLAINT',
        payload: { ...complaint, isReadByAdmin: true },
      });
    }
    setSelectedComplaint(complaint);
  };

  const stats = useMemo(() => {
    const openComplaints = complaints.filter(c => c.status === ComplaintStatus.SUBMITTED || c.status === ComplaintStatus.IN_PROGRESS).length;
    const newSubmissions = complaints.filter(c => !c.isReadByAdmin).length;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const overdue = complaints.filter(c =>
      c.dueDate && new Date(c.dueDate) < today && c.status !== ComplaintStatus.RESOLVED && c.status !== ComplaintStatus.CLOSED
    ).length;

    const resolvedComplaints = complaints.filter(c => c.resolvedAt);
    let avgResolutionTime = 'N/A';
    if (resolvedComplaints.length > 0) {
        const totalTime = resolvedComplaints.reduce((acc, c) => {
            if (c.resolvedAt) { // type guard
                return acc + (new Date(c.resolvedAt).getTime() - new Date(c.submittedAt).getTime());
            }
            return acc;
        }, 0);
        const avgMilliseconds = totalTime / resolvedComplaints.length;
        const avgDays = avgMilliseconds / (1000 * 60 * 60 * 24);
        avgResolutionTime = `${avgDays.toFixed(1)} days`;
    }

    return { openComplaints, newSubmissions, overdue, avgResolutionTime };
  }, [complaints]);

  const filteredAndSortedComplaints = useMemo(() => {
    let processedComplaints = [...complaints];

    if (filter !== 'ALL') {
        processedComplaints = processedComplaints.filter(c => c.status === filter);
    }

    if (categoryFilter !== 'ALL') {
        processedComplaints = processedComplaints.filter(c => c.category === categoryFilter);
    }
    
    if (searchTerm) {
        processedComplaints = processedComplaints.filter(c => 
            c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    processedComplaints.sort((a, b) => {
        switch(sortBy) {
            case 'status_asc':
                if (a.status !== b.status) return a.status.localeCompare(b.status);
                return b.submittedAt.getTime() - a.submittedAt.getTime();
            case 'status_desc':
                if (a.status !== b.status) return b.status.localeCompare(a.status);
                return b.submittedAt.getTime() - a.submittedAt.getTime();
            case 'oldest':
                return a.submittedAt.getTime() - b.submittedAt.getTime();
            case 'newest':
            default:
                return b.submittedAt.getTime() - a.submittedAt.getTime();
        }
    });

    return processedComplaints;
  }, [complaints, filter, categoryFilter, searchTerm, sortBy]);

  return (
    <div className="animate-slide-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-primary">Administrator Dashboard</h2>
      </div>

      <div className="mb-6 print:hidden">
        <div className="flex space-x-2 border-b-2 border-gray-200">
          <TabButton
            label="Manage Complaints"
            icon={<Cog6ToothIcon className="w-5 h-5"/>}
            isActive={activeTab === 'complaints'}
            onClick={() => setActiveTab('complaints')}
          />
          <TabButton
            label="Reports"
            icon={<DocumentTextIcon className="w-5 h-5"/>}
            isActive={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
          />
          <TabButton
            label="My Profile"
            icon={<UserIcon className="w-5 h-5"/>}
            isActive={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </div>
      </div>

      {activeTab === 'complaints' && (
        <div>
            <div className="mb-8">
                <h3 className="text-xl font-bold text-brand-dark mb-4">At a Glance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Open Complaints" value={stats.openComplaints} icon={<DocumentTextIcon />} />
                    <StatCard title="New Submissions" value={stats.newSubmissions} icon={<BellIcon />} />
                    <StatCard title="Overdue Complaints" value={stats.overdue} icon={<ExclamationTriangleIcon />} color={stats.overdue > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} />
                    <StatCard title="Avg. Resolution Time" value={stats.avgResolutionTime} icon={<ClockIcon />} />
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="relative">
                        <label htmlFor="search-complaint" className="block text-sm font-medium text-gray-700 mb-1">Search Complaints</label>
                        <input 
                            type="text"
                            id="search-complaint"
                            placeholder="By ID, name, or keyword..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-[38px] text-gray-400"/>
                    </div>
                     <div>
                        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                        <select id="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                            <option value="ALL">All Categories</option>
                            {Object.values(ComplaintCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="status_asc">Status (A-Z)</option>
                            <option value="status_desc">Status (Z-A)</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="mb-4 flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm border flex-wrap gap-2">
                <span className="font-semibold text-gray-700">Filter by status:</span>
                {(['ALL', ...Object.values(ComplaintStatus)] as const).map(status => (
                    <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filter === status ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {status}
                    </button>
                ))}
            </div>
            <div className="space-y-4">
                {filteredAndSortedComplaints.length > 0 ? filteredAndSortedComplaints.map(complaint => (
                    <ComplaintCard key={complaint.id} complaint={complaint} userRole="admin" onCardClick={handleViewDetails} />
                )) : (
                    <p className="text-center text-gray-500 py-8">No complaints match the current filters.</p>
                )}
            </div>
        </div>
      )}
      {activeTab === 'reports' && <ReportsView />}
      {activeTab === 'profile' && <ProfileView />}

      {selectedComplaint && (
          <ComplaintDetailModal
            isOpen={!!selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
            complaint={selectedComplaint}
            student={findUserById(selectedComplaint.studentId)}
            onStatusUpdate={handleStatusUpdate}
            onNotesUpdate={handleNotesUpdate}
          />
      )}
    </div>
  );
};


// FIX: Changed JSX.Element to React.ReactElement to resolve namespace error.
const TabButton: React.FC<{ label: string; icon: React.ReactElement; isActive: boolean; onClick: () => void }> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 py-3 px-4 font-semibold transition-colors duration-300 ${
            isActive ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-primary'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default AdminDashboard;