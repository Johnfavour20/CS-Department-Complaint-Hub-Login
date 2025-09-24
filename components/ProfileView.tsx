
import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { UserIcon, CameraIcon, PencilIcon } from './icons';

const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
      name: user?.name || '',
      department: user?.department || '',
      level: user?.level || 100,
      email: user?.email || '',
      phone: user?.phone || '',
  });

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file (PNG, JPEG, etc.).', 'error');
        return;
    }
    
    if(file.size > 10 * 1024 * 1024) { 
        showNotification('File is too large. Please select an image under 10MB.', 'error');
        return;
    }
    
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let { width, height } = img;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height = Math.round(height * (MAX_WIDTH / width));
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width = Math.round(width * (MAX_HEIGHT / height));
                height = MAX_HEIGHT;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            showNotification('Could not process image.', 'error');
            URL.revokeObjectURL(objectUrl);
            return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        updateUser({ profilePictureUrl: resizedDataUrl });
        showNotification('Profile picture updated successfully!', 'success');

        URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
        showNotification('Failed to load image for resizing.', 'error');
        URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleEditClick = () => {
    if (user) {
        setFormData({
            name: user.name,
            department: user.department || '',
            level: user.level || 100,
            email: user.email || '',
            phone: user.phone || '',
        });
    }
    setIsEditing(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
        showNotification('Name cannot be empty.', 'error');
        return;
    }
    updateUser(formData);
    showNotification('Profile updated successfully!', 'success');
    setIsEditing(false);
  };


  if (!user) return null;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-brand-primary">My Profile</h3>
            {!isEditing && (
                <button
                    onClick={handleEditClick}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-300"
                >
                    <PencilIcon className="w-5 h-5" />
                    <span>Edit Profile</span>
                </button>
            )}
        </div>
      <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
        <div className="relative flex-shrink-0">
          {user.profilePictureUrl ? (
            <img src={user.profilePictureUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover ring-4 ring-brand-secondary/20" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-brand-primary/10 flex items-center justify-center ring-4 ring-brand-secondary/20">
              <UserIcon className="w-16 h-16 text-brand-primary/60" />
            </div>
          )}
          <button
            onClick={triggerFileUpload}
            className="absolute bottom-1 right-1 bg-brand-secondary text-white rounded-full p-2.5 hover:bg-brand-primary transition-colors shadow-md"
            aria-label="Change profile picture"
          >
            <CameraIcon className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePictureUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pl-0 sm:pl-8 pt-6 sm:pt-0 w-full">
            {isEditing ? (
                 <form onSubmit={handleSave} className="space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary" required/>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                            <input type="text" name="department" id="department" value={formData.department} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary"/>
                        </div>
                        <div>
                            <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                            <input type="number" name="level" id="level" value={formData.level} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary" min="100" max="600" step="100"/>
                        </div>
                     </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary"/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary"/>
                    </div>
                     <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={() => setIsEditing(false)} className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-brand-secondary text-white rounded-lg hover:bg-brand-primary transition-colors">Save Changes</button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="space-y-1 mb-4">
                        <h4 className="text-2xl font-bold text-brand-dark">{user.name}</h4>
                        <p className="text-gray-600 font-medium">{user.id}</p>
                        <p className="text-gray-500 text-sm capitalize pt-1">{user.role} Account</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700 pt-4 border-t">
                        <p><span className="font-semibold text-brand-dark">Department:</span> {user.department || 'N/A'}</p>
                        <p><span className="font-semibold text-brand-dark">Level:</span> {user.level ? `${user.level} Level` : 'N/A'}</p>
                        <p><span className="font-semibold text-brand-dark">Email Address:</span> {user.email || 'N/A'}</p>
                        <p><span className="font-semibold text-brand-dark">Phone Number:</span> {user.phone || 'N/A'}</p>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
