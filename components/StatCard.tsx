import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'bg-blue-100 text-blue-800' }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border flex items-start space-x-4 hover:shadow-md transition-shadow">
      <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${color}`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="mt-1 text-3xl font-bold text-brand-dark">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
