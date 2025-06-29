import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

const AppLayout = () => {
  return (
    // This component wraps your MainLayout...
    <MainLayout>
       
      <Outlet />
    </MainLayout>
  );
};

export default AppLayout;