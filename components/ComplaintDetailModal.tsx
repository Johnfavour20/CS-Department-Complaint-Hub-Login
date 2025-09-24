import React, { useState } from 'react';
import { Complaint, ComplaintStatus, User } from '../types';
import { XMarkIcon, UserIcon, CalendarIcon, DocumentIcon, InformationCircleIcon } from './icons';

const statusStyles: { [key in ComplaintStatus]: { bg: string; text: string; border: string } } = {
  [ComplaintStatus.SUBMITTED]: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400' },
  [ComplaintStatus.IN_PROGRESS]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400' },
  [ComplaintStatus.RESOLVED]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
  [ComplaintStatus.CLOSED]: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-400' },
};

// Helper to format date for input[type="date"] which expects 'YYYY-MM-DD'
const formatDateForInput = (date: Date | undefined | null): string => {
    if (!date) return '';
    // Adjust for timezone offset to prevent date from changing
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};

interface ComplaintDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint;
  student: User | null;
  onStatusUpdate: (id: string, newStatus: ComplaintStatus, dueDate: string | null) => void;
  onNotesUpdate: (id: string, notes: string) => void;
}

const TabButton: React.FC<{ title: string, isActive: boolean, onClick: () => void }> = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`py-2 px-4 font-semibold text-sm transition-colors ${
            isActive
                ? 'border-b-2 border-brand-primary text-brand-primary'
                : 'border-b-2 border-transparent text-gray-500 hover:text-brand-primary'
        }`}
    >
        {title}
    </button>
);


const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ isOpen, onClose, complaint, student, onStatusUpdate, onNotesUpdate }) => {
    const [adminNotes, setAdminNotes] = useState(complaint.adminNotes || '');
    const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint.status);
    const [dueDate, setDueDate] = useState<string>(formatDateForInput(complaint.dueDate));
    const [activeTab, setActiveTab] = useState<'manage' | 'details'>('manage');
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    const handleStatusUpdateClick = () => {
        const statusChanged = newStatus !== complaint.status;
        const dueDateChanged = dueDate !== formatDateForInput(complaint.dueDate);

        if (!statusChanged && !dueDateChanged) {
            onClose();
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirmStatusUpdate = () => {
        onStatusUpdate(complaint.id, newStatus, dueDate || null);
        setShowConfirmation(false);
        onClose();
    };

    const handleCancelStatusUpdate = () => {
        setShowConfirmation(false);
    };


    const handleNotesUpdateClick = () => {
        onNotesUpdate(complaint.id, adminNotes);
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in p-0 sm:p-4" onClick={onClose}>
            <div className="bg-white rounded-none sm:rounded-xl shadow-2xl flex flex-col w-full max-w-4xl h-full sm:max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-brand-primary">Complaint Details: {complaint.id}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto">
                    {/* Left Column: Student and Complaint Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div>
                            <h4 className="font-bold text-lg text-brand-dark mb-2">Student Information</h4>
                            <div className="bg-brand-light p-4 rounded-lg border border-gray-200 space-y-3">
                                <div className="flex items-center space-x-3">
                                    {student?.profilePictureUrl ? (
                                        <img src={student.profilePictureUrl} alt={student.name} className="w-14 h-14 rounded-full object-cover"/>
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                                            <UserIcon className="w-8 h-8 text-gray-600"/>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-brand-primary text-lg">{student?.name || 'Unknown Student'}</p>
                                        <p className="text-sm text-gray-600">{student?.id}</p>
                                    </div>
                                </div>
                                <div className="text-sm space-y-1 pt-2 border-t">
                                     <p><span className="font-semibold text-gray-700">Department:</span> {student?.department || 'N/A'}</p>
                                     <p><span className="font-semibold text-gray-700">Level:</span> {student?.level ? `${student.level} Level` : 'N/A'}</p>
                                     <p><span className="font-semibold text-gray-700">Email:</span> {student?.email || 'N/A'}</p>
                                     <p><span className="font-semibold text-gray-700">Phone:</span> {student?.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-brand-dark mb-2">Complaint Summary</h4>
                             <div className="space-y-2 text-sm">
                                <p><span className="font-semibold">Category:</span> {complaint.category}</p>
                                <p><span className="font-semibold">Status:</span> 
                                    <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[complaint.status].bg} ${statusStyles[complaint.status].text}`}>
                                        {complaint.status}
                                    </span>
                                </p>
                                <p><span className="font-semibold">Due Date:</span> {complaint.dueDate ? new Date(complaint.dueDate).toLocaleDateString() : 'Not set'}</p>
                                <div className="flex items-start space-x-2 pt-1">
                                    <CalendarIcon className="w-4 h-4 mt-0.5 text-gray-500"/>
                                    <span><span className="font-semibold">Submitted:</span> {complaint.submittedAt.toLocaleString()}</span>
                                </div>
                                <p className="font-semibold pt-2">Description:</p>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{complaint.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tabs for Actions and Details */}
                    <div className="md:col-span-2">
                        <div className="flex border-b border-gray-200 mb-6">
                            <TabButton title="Manage" isActive={activeTab === 'manage'} onClick={() => setActiveTab('manage')} />
                            <TabButton title="Details" isActive={activeTab === 'details'} onClick={() => setActiveTab('details')} />
                        </div>
                        
                        {activeTab === 'manage' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h4 className="font-bold text-lg text-brand-dark mb-3">Internal Admin Notes</h4>
                                    <div className="space-y-3 bg-brand-light p-4 rounded-lg border">
                                        <div>
                                            <label htmlFor="admin-notes" className="block text-sm font-medium text-gray-700">Add/Edit Notes (Admin Only)</label>
                                            <textarea id="admin-notes" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={4} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary" placeholder="Add internal notes for this complaint..."></textarea>
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={handleNotesUpdateClick} className="py-2 px-4 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm font-semibold">Save Note</button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-brand-dark mb-3">Update Complaint Status</h4>
                                    <div className="space-y-4 bg-brand-light p-4 rounded-lg border">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Update Status</label>
                                            <select value={newStatus} onChange={e => setNewStatus(e.target.value as ComplaintStatus)} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary">
                                                {Object.values(ComplaintStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Set Due Date</label>
                                            <input 
                                                type="date" 
                                                value={dueDate} 
                                                onChange={e => setDueDate(e.target.value)}
                                                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button onClick={handleStatusUpdateClick} className="py-2 px-4 bg-brand-secondary text-white rounded-lg hover:bg-brand-primary transition-colors font-semibold">Update Status & Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="space-y-6 animate-fade-in">
                                {complaint.attachment && (
                                    <div>
                                        <h4 className="font-bold text-lg text-brand-dark mb-3">Attachment</h4>
                                        <div className="bg-gray-50 p-3 rounded-lg border">
                                            <a href={complaint.attachment.dataUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                                                {complaint.attachment.type.startsWith('image/') ? (
                                                    <img src={complaint.attachment.dataUrl} alt="Attachment Preview" className="w-16 h-16 object-cover rounded-md flex-shrink-0"/>
                                                ) : (
                                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md flex-shrink-0">
                                                        <DocumentIcon className="w-8 h-8 text-gray-600"/>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-brand-primary group-hover:underline">{complaint.attachment.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        <span>{(complaint.attachment.size / 1024).toFixed(2)} KB</span>
                                                        <span className="mx-1.5">|</span>
                                                        <span>{complaint.attachment.type}</span>
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-lg text-brand-dark mb-3">Complaint History</h4>
                                    <div className="space-y-3 text-sm border-l-2 border-gray-200 pl-4">
                                        {complaint.history.map((entry, index) => (
                                            <div key={index} className="flex items-start space-x-3 text-gray-600 relative">
                                                <div className={`absolute -left-[23px] mt-1 w-4 h-4 rounded-full ${statusStyles[entry.status].bg} border-2 ${statusStyles[entry.status].border} bg-white`}></div>
                                                <div>
                                                    <p><span className="font-semibold">{entry.status}</span> - {new Date(entry.changedAt).toLocaleString()}</p>
                                                    {entry.notes && <p className="text-xs text-gray-500 italic pl-1">Note: {entry.notes}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                                <InformationCircleIcon className="h-6 w-6 text-brand-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Confirm Changes</h3>
                                <p className="text-sm text-gray-600 mt-1">Please review the changes before confirming.</p>
                            </div>
                        </div>
                        <div className="mt-4 py-4 border-y text-sm space-y-3">
                            {newStatus !== complaint.status && (
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">Status:</span>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusStyles[complaint.status].bg} ${statusStyles[complaint.status].text}`}>{complaint.status}</span>
                                        <span className="text-gray-400">→</span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusStyles[newStatus].bg} ${statusStyles[newStatus].text}`}>{newStatus}</span>
                                    </div>
                                </div>
                            )}
                             {dueDate !== formatDateForInput(complaint.dueDate) && (
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">Due Date:</span>
                                     <div className="flex items-center space-x-2 font-medium">
                                        <span className="text-gray-500">{complaint.dueDate ? new Date(complaint.dueDate).toLocaleDateString() : 'Not Set'}</span>
                                        <span className="text-gray-400">→</span>
                                        <span className="text-brand-dark">{dueDate ? new Date(dueDate.replace(/-/g, '/')).toLocaleDateString() : 'Not Set'}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-5 flex justify-end space-x-3">
                            <button type="button" onClick={handleCancelStatusUpdate} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancel</button>
                            <button type="button" onClick={handleConfirmStatusUpdate} className="py-2 px-4 bg-brand-secondary text-white rounded-lg hover:bg-brand-primary transition-colors font-semibold">Confirm Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintDetailModal;