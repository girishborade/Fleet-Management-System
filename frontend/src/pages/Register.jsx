import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../api/axiosConfig';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'CUSTOMER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Username or Email might already be taken.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-[90vh] px-6 py-12"
        >
            <div className="w-full max-w-lg">
                <div className="glass-dark border border-slate-800 rounded-[32px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 -z-10 w-full h-1/2 bg-emerald-500/10 blur-3xl rounded-full"></div>

                    <div className="text-center mb-10">
                        <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 text-white">
                            <UserPlus size={32} />
                        </div>
                        <h1 className="text-3xl font-black mb-2">Create Account</h1>
                        <p className="text-slate-400">Join IndiaDrive and start your journey today</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl flex items-center space-x-3 mb-8"
                        >
                            <AlertCircle size={20} />
                            <p className="text-sm font-medium">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleRegister} className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="choose_username"
                                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Account Type</label>
                            <div className="relative group">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <select
                                    name="role"
                                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                                    onChange={handleChange}
                                >
                                    <option value="CUSTOMER">Customer (Standard)</option>
                                    <option value="STAFF">Fleet Staff</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-emerald-600/20 mt-4"
                        >
                            <span>{loading ? 'Creating Account...' : 'Register'}</span>
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 font-medium mt-10">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;
