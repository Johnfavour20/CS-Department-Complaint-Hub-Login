import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRightOnRectangleIcon, UserIcon } from './icons';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogoClick = () => {
        if(user) logout();
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10 print:hidden">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-4 cursor-pointer" onClick={handleLogoClick}>
                    <img src="https://cdn-icons-png.flaticon.com/512/613/613220.png" alt="CS Department Logo" className="h-12 w-auto" />
                    <h1 className="text-xl font-bold text-brand-primary hidden sm:block">CS Department Complaint Hub</h1>
                </div>
                {user && (
                    <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-3">
                            {user.profilePictureUrl ? (
                                <img src={user.profilePictureUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-gray-500" />
                                </div>
                            )}
                            <span className="font-medium text-gray-800 hidden sm:block">{user.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                            aria-label="Logout"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            <span className="font-medium hidden md:block">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;