import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../types';
import { useComplaints } from '../contexts/ComplaintContext';
import { DocumentArrowDownIcon, PrinterIcon } from './icons';

const ReportsView: React.FC = () => {
    const { complaints } = useComplaints();
    
    // State for filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<ComplaintStatus[]>(Object.values(ComplaintStatus));
    const [selectedCategories, setSelectedCategories] = useState<ComplaintCategory[]>(Object.values(ComplaintCategory));
    
    // State for report data
    const [reportData, setReportData] = useState<Complaint[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const handleGenerateReport = () => {
        const filtered = complaints.filter(c => {
            const submittedDate = new Date(c.submittedAt);
            submittedDate.setHours(0, 0, 0, 0);

            const start = startDate ? new Date(startDate) : null;
            if(start) start.setHours(0, 0, 0, 0);

            const end = endDate ? new Date(endDate) : null;
            if(end) end.setHours(0, 0, 0, 0);

            if (start && submittedDate < start) return false;
            if (end && submittedDate > end) return false;
            if (!selectedStatuses.includes(c.status)) return false;
            if (!selectedCategories.includes(c.category)) return false;
            return true;
        });

        setReportData(filtered);
        setShowPreview(true);
    };
    
    const handleStatusChange = (status: ComplaintStatus) => {
        setSelectedStatuses(prev => 
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };
    
    const handleCategoryChange = (category: ComplaintCategory) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Student Name', 'Student ID', 'Category', 'Status', 'Submitted At', 'Resolved At', 'Description'];
        const rows = reportData.map(c => [
            c.id,
            c.studentName,
            c.studentId,
            c.category,
            c.status,
            c.submittedAt.toISOString(),
            c.resolvedAt?.toISOString() || 'N/A',
            `"${c.description.replace(/"/g, '""')}"` // Handle quotes in description
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `complaint_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 print:hidden">
                <h3 className="text-xl font-bold text-brand-primary mb-4">Generate Complaint Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"/>
                    </div>
                </div>
                <div className="mt-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</p>
                    <div className="flex flex-wrap gap-3">
                        {Object.values(ComplaintStatus).map(status => (
                            <label key={status} className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" checked={selectedStatuses.includes(status)} onChange={() => handleStatusChange(status)} className="h-4 w-4 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"/>
                                <span className="text-sm text-gray-700">{status}</span>
                            </label>
                        ))}
                    </div>
                </div>
                 <div className="mt-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</p>
                    <div className="flex flex-wrap gap-3">
                        {Object.values(ComplaintCategory).map(cat => (
                            <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} className="h-4 w-4 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"/>
                                <span className="text-sm text-gray-700">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button onClick={handleGenerateReport} className="py-2 px-6 bg-brand-secondary text-white rounded-lg hover:bg-brand-primary transition-colors font-semibold">Generate Preview</button>
                </div>
            </div>
            {showPreview && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4 print:hidden">
                        <h3 className="text-xl font-bold text-brand-primary">Report Preview ({reportData.length} entries)</h3>
                        <div className="flex space-x-3">
                            <button onClick={handlePrint} className="flex items-center space-x-2 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                                <PrinterIcon className="w-5 h-5"/>
                                <span>Print</span>
                            </button>
                            <button onClick={exportToCSV} className="flex items-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                                <DocumentArrowDownIcon className="w-5 h-5"/>
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </div>
                     <div className="print:hidden">
                        <p className="text-sm text-gray-600 mb-4">
                            <strong>Filters Applied:</strong> Dates: {startDate || 'any'} to {endDate || 'any'}; 
                            Statuses: {selectedStatuses.join(', ') || 'none'}; 
                            Categories: {selectedCategories.join(', ') || 'none'}.
                        </p>
                    </div>
                    {reportData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map(c => (
                                        <tr key={c.id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{c.id.substring(0, 10)}...</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{c.studentName} ({c.studentId})</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{c.category}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{c.status}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(c.submittedAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No complaints found for the selected criteria.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportsView;