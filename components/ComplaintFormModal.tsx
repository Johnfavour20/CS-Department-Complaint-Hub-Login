

import React, { useState, useEffect, useCallback } from 'react';
import { Complaint, ComplaintCategory, ComplaintAttachment } from '../types';
import { XMarkIcon, DocumentIcon, PaperClipIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

interface ComplaintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    complaint: Omit<Complaint, 'id' | 'submittedAt' | 'status' | 'history' | 'studentId' | 'studentName'>,
    attachment?: ComplaintAttachment
  ) => void;
}

const ComplaintFormModal: React.FC<ComplaintFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [category, setCategory] = useState<ComplaintCategory>(ComplaintCategory.ACADEMIC);
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<ComplaintAttachment | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
        setDescription('');
        setCategory(ComplaintCategory.ACADEMIC);
        setAttachment(null);
        setError('');
    }
  }, [isOpen]);

  const handleFile = (file: File) => {
    if (!file) return;

    if(file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('File is too large. Please select a file under 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
          setAttachment({
              name: file.name,
              size: file.size,
              type: file.type,
              dataUrl: dataUrl
          });
      }
    };
    reader.onerror = () => {
        showNotification('Failed to read file.', 'error');
    };
    reader.readAsDataURL(file);
  };
  
  const handleDragEvents = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
      handleDragEvents(e);
      setIsDragging(true);
  }, [handleDragEvents]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
      handleDragEvents(e);
      setIsDragging(false);
  }, [handleDragEvents]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      handleDragEvents(e);
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
      }
  }, [handleDragEvents]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description cannot be empty.');
      return;
    }
    setError('');
    onSubmit({ category, description }, attachment || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-primary">Submit a New Complaint</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
              <input type="text" id="studentName" value={user?.name || ''} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
              <input type="text" id="studentId" value={user?.id || ''} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2" />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary"
            >
              {Object.values(ComplaintCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description</label>
            <textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder="Please provide as much detail as possible..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attach a File (Optional)</label>
            {!attachment ? (
                <div 
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragEvents}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-brand-primary' : 'border-gray-300'} border-dashed rounded-md`}>
                    <div className="space-y-1 text-center">
                        <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400"/>
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-secondary hover:text-brand-primary focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={e => e.target.files && handleFile(e.target.files[0])} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                    </div>
                </div>
            ) : (
                <div className="mt-2 flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                    <div className="flex items-center space-x-3">
                       {attachment.type.startsWith('image/') ? (
                           <img src={attachment.dataUrl} alt="preview" className="w-12 h-12 rounded-md object-cover"/>
                       ) : (
                           <DocumentIcon className="w-10 h-10 text-gray-500"/>
                       )}
                       <div>
                           <p className="text-sm font-medium text-gray-800 truncate">{attachment.name}</p>
                           <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                       </div>
                    </div>
                    <button onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-700">
                        <XMarkIcon className="w-5 h-5"/>
                    </button>
                </div>
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4 pt-2">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-brand-secondary text-white rounded-lg hover:bg-brand-primary transition-colors">Submit Complaint</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintFormModal;