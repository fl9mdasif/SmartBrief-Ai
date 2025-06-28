import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { setSelectedSummary } from '../../redux/features/summary/summarySlice'; 
import { useGetSummariesQuery } from '../../redux/features/summary/summaryApi';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { data: summaries, isLoading } = useGetSummariesQuery();
    const { selectedSummaryId } = useSelector((state) => state.summary);

    const handleSelectSummary = (summary) => {
        dispatch(setSelectedSummary(summary));
    };
    
    // Action to start a new summary
    const handleNewSummary = () => {
        dispatch(setSelectedSummary(null));
    };

    return (
        <aside className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col">
            <div className="p-4">
                <button 
                    onClick={handleNewSummary}
                    className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    + New Summary
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <h2 className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">History</h2>
                <nav className="flex flex-col px-2">
                    {isLoading ? (
                        <p className="p-4 text-gray-400">Loading...</p>
                    ) : (
                        summaries?.data?.map((summary) => (
                            <button
                                key={summary._id}
                                onClick={() => handleSelectSummary(summary)}
                                className={`w-full text-left p-3 my-1 rounded-md text-sm truncate ${selectedSummaryId === summary._id ? 'bg-blue-500 text-white' : 'hover:bg-slate-700 text-gray-300'}`}
                            >
                                 {summary.prompt.substring(0, 20)}... {new Date(summary.createdAt).toLocaleDateString()} 
                            </button>
                        ))
                    )}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;