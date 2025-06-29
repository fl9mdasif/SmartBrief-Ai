import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

const AppLayout = () => {
  return (
    // This component wraps your MainLayout...
    <MainLayout>
      {/* And this <Outlet/> is the most important part.
          It's the placeholder where your Dashboard or UserManagement page will appear.
          If this is missing, you will see the layout but no page content. */}
      <Outlet />
    </MainLayout>
  );
};

export default AppLayout;