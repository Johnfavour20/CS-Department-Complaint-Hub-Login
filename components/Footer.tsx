import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} CS Department Complaint Hub. All Rights Reserved.</p>
                <p className="text-sm mt-1">Fostering a responsive and accountable academic community.</p>
            </div>
        </footer>
    );
};

export default Footer;