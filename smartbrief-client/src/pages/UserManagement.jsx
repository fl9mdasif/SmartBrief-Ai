
import React, { useState } from 'react';
import { Link } from 'react-router-dom';  
import { 
    useGetUsersQuery, 
    useChangeUserRoleMutation, 
    useRechargeCreditsMutation 
} from '../redux/features/admin/adminApi';
import MainLayout from '../components/layout/MainLayout';

const UserManagement = () => {
    const { data: usersResponse, isLoading, isError, error } = useGetUsersQuery();
    const [rechargeCredits, { isLoading: isRecharging }] = useRechargeCreditsMutation();
    
    // --- FIX: Initialize the missing hook ---
    const [changeUserRole, { isLoading: isChangingRole }] = useChangeUserRoleMutation();

    const [updatingRoleId, setUpdatingRoleId] = useState(null);

    const handleRecharge = async (userId, username) => {
        const amount = window.prompt(`Enter amount of credits to add to ${username}:`);

        if (amount && !isNaN(amount) && Number(amount) > 0) {
            try {
                await rechargeCredits({ userId, amount: Number(amount) }).unwrap();
                alert('Credits added successfully!');
            } catch (err) {
                alert(err.data?.message || 'Failed to add credits.');
            }
        } else if (amount) {
            alert('Please enter a valid positive number.');
        }
    };
    
    const handleRoleChange = async (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            setUpdatingRoleId(userId);
            try {
                // --- FIX: Correct the function call typo ---
                await changeUserRole({ userId, role: newRole }).unwrap();
                alert('Role updated successfully!');
            } catch (err) {
                alert(err.data?.message || 'Failed to change role.');
            } finally {
                setUpdatingRoleId(null);
            }
        }
    };
    
    let content = null;

    if (isLoading) {
        content = <p className="text-center text-gray-400">Loading users...</p>;
    } else if (isError) {
        content = <p className='text-center text-red-500'>Error fetching users: {error.data?.message}</p>;
    } else if (usersResponse?.data?.length > 0) {
        content = (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-slate-800 rounded-lg">
                    <thead>
                        <tr className='border-b border-slate-700'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Credits</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {usersResponse.data.map(user => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <select 
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        disabled={updatingRoleId === user._id || user.role === 'admin' || isChangingRole}
                                        className="bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="user">user</option>
                                        <option value="editor">editor</option>
                                        <option value="reviewer">reviewer</option>
                                        {user.role === 'admin' && <option value="admin">admin</option>}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-400">{user.credits}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => handleRecharge(user._id, user.username)}
                                        className="text-green-400 hover:text-green-300 disabled:opacity-50"
                                        disabled={isRecharging}
                                    >
                                        Recharge Credits
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        content = <p className="text-center text-gray-400">No users found.</p>;
    }

    return (
        // --- FIX: Wrap everything in the MainLayout component ---
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                {/* --- FIX: Use Link component for smooth navigation --- */}
                <Link to='/' className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                    &larr; Back to Dashboard
                </Link>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                {content}
            </div>
        </MainLayout>
    );
};

export default UserManagement;