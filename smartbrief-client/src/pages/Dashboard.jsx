import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/features/auth/authSlice';
// import { logout } from '../features/auth/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user information from the Redux state
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-white">SmartBrief Dashboard</h1>
           <p className="text-lg text-slate-300">Welcome back, {user?.username || 'User'}!</p>
        </div>
        <div>
          <span className="text-lg font-semibold bg-blue-500 text-white rounded-full px-4 py-1 mr-4">
            Credits: {user?.credits ?? 'N/A'}
          </span>
          <button 
            onClick={onLogout}
            className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* We will add the summary form and history here next */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Content Summarizer</h2>
          <p className="text-gray-300">Ready to get started!</p>
      </div>
    </div>
  );
};

export default Dashboard;