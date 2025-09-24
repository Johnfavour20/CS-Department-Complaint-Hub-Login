import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';
import ComplaintCard from './ComplaintCard';
import { ChartBarIcon, DocumentTextIcon, CheckCircleIcon, ClockIcon, ArrowPathIcon, MagnifyingGlassIcon, UserIcon } from './icons';
import { useComplaints } from '../contexts/ComplaintContext';
import { useNotification } from '../contexts/NotificationContext';
import ComplaintDetailModal from './ComplaintDetailModal';
import { findUserById } from '../utils/userData';
import ProfileView from './ProfileView';

const AdminDashboard: React.FC = () => {
  const { complaints, dispatch } = useComplaints();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'complaints' | 'analytics' | 'profile'>('complaints');
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

      <div className="mb-6">
        <div className="flex space-x-2 border-b-2 border-gray-200">
          <TabButton
            label="Manage Complaints"
            icon={<DocumentTextIcon className="w-5 h-5"/>}
            isActive={activeTab === 'complaints'}
            onClick={() => setActiveTab('complaints')}
          />
          <TabButton
            label="Analytics"
            icon={<ChartBarIcon className="w-5 h-5"/>}
            isActive={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
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
      {activeTab === 'analytics' && <AnalyticsView complaints={complaints} />}
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


const AnalyticsView: React.FC<{ complaints: Complaint[] }> = ({ complaints }) => {
    const categoryData = useMemo(() => {
        const counts = complaints.reduce((acc, c) => {
            acc[c.category] = (acc[c.category] || 0) + 1;
            return acc;
        }, {} as Record<ComplaintCategory, number>);

        return Object.entries(counts).map(([name, value]) => ({ name, count: value }));
    }, [complaints]);

    const statusData = useMemo(() => {
        const counts = complaints.reduce((acc, c) => {
            acc[c.status] = (acc[c.status] || 0) + 1;
            return acc;
        }, {} as Record<ComplaintStatus, number>);

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [complaints]);
    
    const COLORS = {
        [ComplaintStatus.SUBMITTED]: '#F58634',
        [ComplaintStatus.IN_PROGRESS]: '#3B82F6',
        [ComplaintStatus.RESOLVED]: '#10B981',
        [ComplaintStatus.CLOSED]: '#6B7280',
    };
    
    const summaryStats = {
        total: complaints.length,
        resolved: complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length,
        inProgress: complaints.filter(c => c.status === ComplaintStatus.IN_PROGRESS).length,
        pending: complaints.filter(c => c.status === ComplaintStatus.SUBMITTED).length,
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Complaints" value={summaryStats.total} icon={<DocumentTextIcon className="w-8 h-8"/>} color="bg-brand-primary" />
                <StatCard title="Pending Review" value={summaryStats.pending} icon={<ClockIcon className="w-8 h-8"/>} color="bg-brand-secondary" />
                <StatCard title="In Progress" value={summaryStats.inProgress} icon={<ArrowPathIcon className="w-8 h-8"/>} color="bg-blue-500" />
                <StatCard title="Resolved" value={summaryStats.resolved} icon={<CheckCircleIcon className="w-8 h-8"/>} color="bg-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-brand-primary mb-4">Complaints by Category</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}/>
                            <Legend />
                            <Bar dataKey="count" fill="#F58634" name="Complaints" barSize={30} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-brand-primary mb-4">Complaints by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            {/* FIX: Explicitly cast percent to a number before performing arithmetic to prevent TypeScript errors. */}
                            <Pie data={statusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}>
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as ComplaintStatus]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}/>
                            <Legend/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

const TabButton: React.FC<{ label: string; icon: JSX.Element; isActive: boolean; onClick: () => void }> = ({ label, icon, isActive, onClick }) => (
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

const StatCard: React.FC<{title: string, value: number, icon: JSX.Element, color: string}> = ({title, value, icon, color}) => (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-4">
        <div className={`p-3 rounded-full text-white ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-brand-dark">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;