
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';  
import { useGetSummariesQuery } from '../../redux/features/summary/summaryApi';
import { setSelectedSummary } from '../../redux/features/summary/summarySlice'; 


const Sidebar = () => {
    const dispatch = useDispatch();
    const { data: summaries, isLoading } = useGetSummariesQuery();
    const { selectedSummaryId } = useSelector((state) => state.summary);
    const { user } = useSelector((state) => state.auth); 
    const navigate = useNavigate();

   const handleSelectSummary = (summary) => {
        dispatch(setSelectedSummary(summary));
        navigate('/'); // 3. Navigate to the dashboard route
    };
    
    const handleNewSummary = () => {
        dispatch(setSelectedSummary(null));
        navigate('/'); // 3. Navigate to the dashboard route
    };


    // This logic is correct, we'll now use it in the JSX
    const historyTitle = 
        user && ['admin', 'editor', 'reviewer'].includes(user.role) 
        ? 'All Summaries' 
        : 'My History';

    return (
        <aside className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col">
            {/* 4. Add a new section only visible to admins */}
            {user && user.role === 'admin' && (
                <div className='mt-auto p-2 border-t border-slate-700'>
                     <h2 className="px-2 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Admin Panel
                    </h2>
                    <Link
                        to="/admin/user-management"
                        className='w-full text-left p-3 my-1 rounded-md text-sm flex items-center hover:bg-slate-700 text-gray-300 transition-colors'
                    >
                        {/* You can find an icon for this from a library like react-icons */}
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        User Management
                    </Link>
                </div>
            )}
            
            <div className="p-4 border-b border-slate-700">
                <button 
                    onClick={handleNewSummary}
                    className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    + New Summary
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <h2 className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {historyTitle} {/* 2. Use the dynamic title here */}
                </h2>
                <nav className="flex flex-col px-2">
                    {isLoading ? (
                        <p className="p-4 text-gray-400">Loading history...</p>
                    ) : (
                        summaries?.data?.length > 0 ? (
                            summaries.data.map((summary) => (
                                <button
                                    key={summary._id}
                                    onClick={() => handleSelectSummary(summary)}
                                    className={`w-full text-left p-3 my-1 rounded-md text-sm truncate transition-colors ${selectedSummaryId === summary._id ? 'bg-blue-500 text-white' : 'hover:bg-slate-700 text-gray-300'}`}
                                >
                                    {/* 3. Show author's name for privileged roles */}
                                    {user && user.role !== 'user' && summary.user ? (
                                        <span className='block text-xs font-bold text-purple-300'>{summary.user.username}</span>
                                     ) : null}
                                    <span className='block'>{summary.prompt.substring(0, 25)}...</span>
                                    <span className='block text-xs text-gray-400'>{new Date(summary.createdAt).toLocaleDateString()}</span>
                                </button>
                            ))
                        ) : (
                             <p className="p-4 text-gray-400 text-sm">No summaries found.</p>
                        )
                    )}
                </nav>
            </div>
            
            
        </aside>
    );
};

export default Sidebar;