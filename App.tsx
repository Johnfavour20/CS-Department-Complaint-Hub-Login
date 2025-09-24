
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Notification from './components/Notification';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  const renderContent = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-light text-brand-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
      <Notification />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ComplaintProvider>
          <AppContent />
        </ComplaintProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
