import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { logout } from '../../redux/features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-slate-800 h-16 flex items-center justify-between px-6 border-b border-slate-700">
      <h1 className="text-xl font-bold text-white">SmartBrief AI</h1>
      <div className="flex items-center space-x-4">
        <span className="text-md font-semibold bg-blue-500 text-white rounded-full px-4 py-1">
          Credits: {user?.credits ?? '...'}
        </span>
        <button
          onClick={onLogout}
          className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;