import React, { useState } from 'react';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';
// FIX: Added DocumentIcon to the import list to resolve reference error.
import { ChevronDownIcon, ChevronUpIcon, AcademicCapIcon, BuildingOfficeIcon, WrenchScrewdriverIcon, ShieldExclamationIcon, CurrencyDollarIcon, EllipsisHorizontalIcon, CalendarIcon, InformationCircleIcon, ClockIcon, PaperClipIcon, DocumentIcon } from './icons';

interface ComplaintCardProps {
  complaint: Complaint;
  userRole: 'student' | 'admin';
  onCardClick?: (complaint: Complaint) => void;
}

const statusStyles: { [key in ComplaintStatus]: { bg: string; text: string; border: string } } = {
  [ComplaintStatus.SUBMITTED]: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400' },
  [ComplaintStatus.IN_PROGRESS]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400' },
  [ComplaintStatus.RESOLVED]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
  [ComplaintStatus.CLOSED]: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-400' },
};

// FIX: Changed JSX.Element to React.ReactElement to resolve namespace error.
const categoryIcons: { [key in ComplaintCategory]: React.ReactElement } = {
    [ComplaintCategory.ACADEMIC]: <AcademicCapIcon className="w-5 h-5" />,
    [ComplaintCategory.ADMINISTRATIVE]: <BuildingOfficeIcon className="w-5 h-5" />,
    [ComplaintCategory.FACILITIES]: <WrenchScrewdriverIcon className="w-5 h-5" />,
    [ComplaintCategory.HARASSMENT]: <ShieldExclamationIcon className="w-5 h-5" />,
    [ComplaintCategory.FINANCIAL]: <CurrencyDollarIcon className="w-5 h-5" />,
    [ComplaintCategory.OTHER]: <EllipsisHorizontalIcon className="w-5 h-5" />,
};

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, userRole, onCardClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const style = statusStyles[complaint.status];
  const isUnreadByAdmin = userRole === 'admin' && !complaint.isReadByAdmin;

  const isOverdue = complaint.dueDate && new Date(complaint.dueDate) < new Date() && complaint.status !== ComplaintStatus.RESOLVED && complaint.status !== ComplaintStatus.CLOSED;

  const handleHeaderClick = () => {
    if (userRole === 'admin' && onCardClick) {
      onCardClick(complaint);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`${isUnreadByAdmin ? 'bg-blue-50' : 'bg-white'} rounded-lg shadow-md border-l-4 ${isOverdue ? 'border-red-500' : style.border} transition-all duration-300 ${userRole === 'admin' ? 'hover:shadow-xl' : ''}`}>
      <div className="p-4 cursor-pointer" onClick={handleHeaderClick}>
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
                <span className={`p-2 rounded-full ${style.bg} ${style.text}`}>
                    {categoryIcons[complaint.category]}
                </span>
                <div>
                    <p className={`text-brand-primary text-lg ${isUnreadByAdmin ? 'font-bold' : 'font-semibold'}`}>{complaint.category}</p>
                    <p className="text-sm text-gray-500">
                        Complaint ID: {complaint.id}
                        {userRole === 'admin' && ` | Student: ${complaint.studentName} (${complaint.studentId})`}
                    </p>
                    {userRole === 'admin' && complaint.dueDate && (
                        <div className={`mt-1 flex items-center text-xs ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                            <ClockIcon className="w-4 h-4 mr-1.5"/>
                            <span>Due: {new Date(complaint.dueDate).toLocaleDateString()}</span>
                            {isOverdue && <span className="ml-2">(Overdue)</span>}
                        </div>
                    )}
                </div>
            </div>
          <div className="text-right flex items-center space-x-4">
            {isUnreadByAdmin && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                NEW
              </span>
            )}
            {userRole === 'admin' && complaint.attachment && (
                <PaperClipIcon className="w-5 h-5 text-gray-400" aria-label="Has attachment" />
            )}
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${style.bg} ${style.text}`}>
              {complaint.status}
            </span>
            {userRole === 'student' && (
              <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="text-gray-500 hover:text-brand-primary">
                  {isExpanded ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
        {userRole === 'admin' && complaint.adminNotes && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-start space-x-2 text-gray-600 text-sm">
            <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400" />
            <p className="italic">
              <span className="font-semibold not-italic text-gray-700">Admin Note: </span> 
              {complaint.adminNotes.length > 100 ? `${complaint.adminNotes.substring(0, 100)}...` : complaint.adminNotes}
            </p>
          </div>
        )}
      </div>
      {isExpanded && userRole === 'student' && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="py-4">
            <p className="text-gray-700">{complaint.description}</p>
          </div>
           {complaint.attachment && (
              <div className="pb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Attachment</h4>
                   <a href={complaint.attachment.dataUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors">
                        {complaint.attachment.type.startsWith('image/') ? (
                            <img src={complaint.attachment.dataUrl} alt="Attachment Preview" className="w-10 h-10 object-cover rounded-md"/>
                        ) : (
                            <DocumentIcon className="w-8 h-8 text-gray-600"/>
                        )}
                        <div>
                            <p className="text-sm font-medium text-brand-primary">{complaint.attachment.name}</p>
                            <p className="text-xs text-gray-500">({(complaint.attachment.size / 1024).toFixed(2)} KB)</p>
                        </div>
                   </a>
              </div>
            )}
          
          <div className="text-xs text-gray-500 mb-4 flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4" />
            <span>Submitted on: {complaint.submittedAt.toLocaleString()}</span>
          </div>

          <h4 className="font-semibold text-gray-800 mb-2">Complaint History</h4>
          <div className="space-y-2 text-sm">
            {complaint.history.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3 text-gray-600">
                    <div className={`mt-1 w-3 h-3 rounded-full ${statusStyles[entry.status].bg} border ${statusStyles[entry.status].border}`}></div>
                    <div>
                        <p><span className="font-semibold">{entry.status}</span> - {new Date(entry.changedAt).toLocaleString()}</p>
                        {entry.notes && <p className="text-xs text-gray-500 italic pl-1">Note: {entry.notes}</p>}
                    </div>
                </div>
            ))}
          </div>
           <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800">Admin Notes</h4>
                <p className="text-sm text-gray-600 mt-1 italic">{complaint.adminNotes || 'No notes added yet.'}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;