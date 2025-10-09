



import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintStatus, ComplaintAttachment } from '../types';
import { PlusIcon, MagnifyingGlassIcon, MicrophoneIcon } from './icons';
import ComplaintFormModal from './ComplaintFormModal';
import ComplaintCard from './ComplaintCard';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import ProfileView from './ProfileView';
import LiveChatModal from './LiveChatModal';

const StudentDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const { complaints, dispatch } = useComplaints();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'complaints' | 'profile'>('complaints');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddComplaint = (
    newComplaintData: Omit<Complaint, 'id' | 'submittedAt' | 'status' | 'history' | 'studentId' | 'studentName'>,
    attachment?: ComplaintAttachment
  ) => {
    if (!user || !user.id || !user.name) {
        showNotification('You must be logged in to submit a complaint.', 'error');
        return;
    }

    const newComplaint: Complaint = {
      id: `C-${crypto.randomUUID()}`,
      ...newComplaintData,
      studentId: user.id,
      studentName: user.name,
      submittedAt: new Date(),
      status: ComplaintStatus.SUBMITTED,
      history: [
        {
          status: ComplaintStatus.SUBMITTED,
          changedAt: new Date(),
          notes: 'Complaint submitted by student.',
        },
      ],
      isReadByAdmin: false,
      attachment: attachment,
    };
    
    dispatch({ type: 'ADD_COMPLAINT', payload: newComplaint });
    showNotification('Complaint submitted successfully!', 'success');
    setSearchTerm(''); // Clear search filter to ensure the new complaint is visible
  };

  const studentComplaints = useMemo(() => {
    const allStudentComplaints = complaints.filter(c => c.studentId === user?.id);

    let filteredComplaints = allStudentComplaints;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filteredComplaints = allStudentComplaints.filter(c =>
        c.id.toLowerCase().includes(lowercasedSearchTerm) ||
        c.category.toLowerCase().includes(lowercasedSearchTerm) ||
        c.description.toLowerCase().includes(lowercasedSearchTerm) ||
        c.status.toLowerCase().includes(lowercasedSearchTerm)
      );
    }
    
    return filteredComplaints.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

  }, [complaints, user, searchTerm]);

  const hasComplaints = useMemo(() => complaints.some(c => c.studentId === user?.id), [complaints, user]);

  return (
    <div className="animate-slide-in-up">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-brand-primary">Student Dashboard</h2>
            <p className="text-lg text-gray-600 mt-1">Welcome back, {user?.name}!</p>
        </div>
        
        <div className="mb-6">
            <div className="flex space-x-2 border-b-2 border-gray-200">
                <TabButton label="My Complaints" isActive={activeTab === 'complaints'} onClick={() => setActiveTab('complaints')} />
                <TabButton label="My Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </div>
        </div>

        {activeTab === 'complaints' && (
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h3 className="text-2xl font-bold text-brand-dark w-full">Complaint History</h3>
                     <div className="flex items-center gap-4 w-full">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search complaints..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm"
                            />
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-shrink-0 flex items-center space-x-2 bg-brand-secondary hover:bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                        <PlusIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Submit New</span>
                        </button>
                    </div>
                </div>

                {studentComplaints.length > 0 ? (
                    <div className="space-y-4">
                    {studentComplaints.map(complaint => (
                        <ComplaintCard key={complaint.id} complaint={complaint} userRole="student" />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
                     {hasComplaints && searchTerm ? (
                         <>
                             <h3 className="text-xl font-semibold text-gray-700">No complaints found.</h3>
                             <p className="text-gray-500 mt-2">Your search for "{searchTerm}" did not match any complaints.</p>
                         </>
                     ) : (
                         <>
                             <h3 className="text-xl font-semibold text-gray-700">You haven't submitted any complaints yet.</h3>
                             <p className="text-gray-500 mt-2">Click "Submit New" to get started.</p>
                         </>
                     )}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'profile' && (
            <ProfileView />
        )}


      <ComplaintFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddComplaint}
      />

        <button
            onClick={() => setIsLiveChatOpen(true)}
            className="fixed bottom-8 right-8 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-brand-secondary focus:outline-none focus:ring-4 focus:ring-brand-secondary/50"
            aria-label="Open Live Support Chat"
        >
            <MicrophoneIcon className="h-8 w-8" />
        </button>

        <LiveChatModal 
            isOpen={isLiveChatOpen} 
            onClose={() => setIsLiveChatOpen(false)} 
        />
    </div>
  );
};


const TabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({label, isActive, onClick}) => (
    <button
        onClick={onClick}
        className={`py-3 px-4 font-semibold transition-colors duration-300 ${
            isActive ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-primary'
        }`}
    >
        <span>{label}</span>
    </button>
);


export default StudentDashboard;