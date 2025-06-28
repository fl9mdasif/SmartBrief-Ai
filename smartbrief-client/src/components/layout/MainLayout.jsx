import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Header />
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;