import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../redux/features/auth/authApi';
// import { useRegisterMutation } from '../features/auth/authApi';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // Use the RTK Query mutation hook for registration
  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    if (data.password !== data.password2) {
      return alert('Passwords do not match');
    }

    try {
      const userData = {
        username: data.username,
        email: data.email,
        password: data.password,
      };
      
      await registerUser(userData).unwrap();

      // alert('Registration successful! Please login to continue.');
      navigate('/login');
    } catch (err) {
      console.error('Failed to register:', err);
      alert(err.data?.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Create an Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Username</label>
            <input
              {...register('username', { required: true })}
              type="text"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
            <input
              {...register('email', { required: true })}
              type="email"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Password</label>
            <input
              {...register('password', { required: true })}
              type="password"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Confirm Password</label>
            <input
              {...register('password2', { required: true })}
              type="password"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-500 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;