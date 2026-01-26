import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Chrome } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import AuthService from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await AuthService.login(username, password);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Invalid username or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            await AuthService.googleLogin(credentialResponse.credential);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Google Login Failed. Please try standard login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[80vh] px-6"
        >
            <div className="w-full max-w-md">
                <div className="glass-dark border border-slate-800 rounded-[32px] overflow-hidden p-8 lg:p-12 shadow-2xl relative">
                    {/* Background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-1/2 bg-primary-600/10 blur-3xl rounded-full"></div>

                    <div className="text-center mb-10">
                        <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-600/20">
                            <LogIn className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Enter your credentials to access your account</p>
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

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Username</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="your_username"
                                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-600"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-600"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary-600/20"
                        >
                            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#111822] px-4 text-slate-500 font-bold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center mb-8">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            useOneTap
                            width="100%"
                            theme="filled_black"
                            shape="pill"
                        />
                    </div>

                    <p className="text-center text-slate-400 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
