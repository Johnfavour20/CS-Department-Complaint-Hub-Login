import React, { useState } from 'react';
import { UserRole } from '../types';
import { BookOpenIcon, ShieldCheckIcon, ArrowRightIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.STUDENT);
  const { login } = useAuth();
  
  const [studentId, setStudentId] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!studentId.trim()) {
      setError('Student ID cannot be empty.');
      return;
    }
    if (!login(UserRole.STUDENT, studentId.trim())) {
        setError('Invalid Student ID. Please check the format and try again.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (adminUser === 'admin' && adminPass === 'password') {
      login(UserRole.ADMIN, 'admin01');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="text-center animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-brand-primary mb-4">
          CS Department Complaint Hub Login
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Please select your role to proceed.
        </p>
        
        <div className="max-w-md mx-auto">
            <div className="flex border-b border-gray-200">
                <TabButton 
                    title="Student" 
                    icon={<BookOpenIcon className="w-5 h-5 mr-2"/>} 
                    isActive={activeTab === UserRole.STUDENT} 
                    onClick={() => { setActiveTab(UserRole.STUDENT); setError(''); }}
                />
                <TabButton 
                    title="Administrator" 
                    icon={<ShieldCheckIcon className="w-5 h-5 mr-2"/>} 
                    isActive={activeTab === UserRole.ADMIN} 
                    onClick={() => { setActiveTab(UserRole.ADMIN); setError(''); }}
                />
            </div>
            <div className="pt-8">
                {activeTab === UserRole.STUDENT ? (
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                         <div>
                            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 text-left">Student ID</label>
                            <input
                                type="text"
                                id="studentId"
                                value={studentId}
                                onChange={e => setStudentId(e.target.value.toUpperCase())}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-brand-secondary focus:border-brand-secondary"
                                placeholder="e.g., U2021/5570009"
                            />
                        </div>
                        <button type="submit" className="w-full flex justify-center items-center py-3 px-4 bg-brand-secondary text-white rounded-lg hover:bg-brand-primary transition-colors font-semibold">
                            Login as Student <ArrowRightIcon className="w-5 h-5 ml-2"/>
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label htmlFor="adminUser" className="block text-sm font-medium text-gray-700 text-left">Username</label>
                            <input
                                type="text"
                                id="adminUser"
                                value={adminUser}
                                onChange={e => setAdminUser(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-brand-secondary focus:border-brand-secondary"
                                placeholder="Username"
                            />
                        </div>
                         <div>
                            <label htmlFor="adminPass" className="block text-sm font-medium text-gray-700 text-left">Password</label>
                            <input
                                type="password"
                                id="adminPass"
                                value={adminPass}
                                onChange={e => setAdminPass(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-brand-secondary focus:border-brand-secondary"
                                placeholder="Password"
                            />
                        </div>
                        <button type="submit" className="w-full flex justify-center items-center py-3 px-4 bg-brand-secondary text-white rounded-lg hover:bg-brand-primary transition-colors font-semibold">
                            Login as Administrator <ArrowRightIcon className="w-5 h-5 ml-2"/>
                        </button>
                    </form>
                )}
                {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

// FIX: Changed JSX.Element to React.ReactElement to resolve namespace error.
const TabButton: React.FC<{title: string, icon: React.ReactElement, isActive: boolean, onClick: () => void}> = ({title, icon, isActive, onClick}) => (
    <button onClick={onClick} className={`flex-1 flex justify-center items-center py-3 px-4 font-semibold text-lg border-b-2 transition-colors ${isActive ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-brand-primary'}`}>
        {icon} {title}
    </button>
);


export default LandingPage;