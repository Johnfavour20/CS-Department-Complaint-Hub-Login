
import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from './icons';

const Notification: React.FC = () => {
  const { notification, hideNotification } = useNotification();
  const { message, type, visible } = notification;

  if (!visible) return null;

  const styles = {
    success: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400', icon: <CheckCircleIcon className="w-6 h-6 text-green-500" /> },
    error: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400', icon: <XCircleIcon className="w-6 h-6 text-red-500" /> },
    info: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400', icon: <InformationCircleIcon className="w-6 h-6 text-blue-500" /> },
  };

  const currentStyle = styles[type];

  return (
    <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:w-full sm:max-w-sm sm:right-5 sm:bottom-5 rounded-lg shadow-lg border-l-4 ${currentStyle.border} ${currentStyle.bg} p-4 z-50 animate-slide-in-up`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {currentStyle.icon}
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className={`text-sm font-medium ${currentStyle.text}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button onClick={hideNotification} className={`inline-flex rounded-md p-1 ${currentStyle.text} focus:outline-none focus:ring-2 focus:ring-offset-2`}>
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;