import React from 'react';
 

import MainLayout from '../components/layout/MainLayout';
import { useGetUsersQuery, useRechargeCreditsMutation } from '../redux/features/auth/admin/adminApi';

const UserManagement = () => {
    const { data: usersResponse, isLoading, isError, error } = useGetUsersQuery();
    const [rechargeCredits, { isLoading: isRecharging }] = useRechargeCreditsMutation();

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
    
    let content = null;

    if (isLoading) {
        content = <p>Loading users...</p>;
    } else if (isError) {
        content = <p className='text-red-500'>Error fetching users: {error.data?.message}</p>;
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
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
        content = <p>No users found.</p>
    }

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                {content}
            </div>
        </MainLayout>
    );
};

export default UserManagement;