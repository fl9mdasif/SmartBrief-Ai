import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminRoute from './components/routes/AdminRoutes';
import UserManagement from './pages/UserManagement';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
 
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        
        <Route 
          path="/admin/user-management" 
          element={
            <AdminRoute>
              <UserManagement/>
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;