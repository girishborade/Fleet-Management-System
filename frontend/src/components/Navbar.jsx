import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, User, LogOut, Menu, X, LayoutDashboard, Calendar, History, Shield } from 'lucide-react';
import AuthService from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = AuthService.getCurrentUser();
    const role = user?.role;
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: Car },
        ...(role === 'CUSTOMER' ? [
            { name: 'Book a Car', path: '/booking', icon: Calendar },
            { name: 'My Bookings', path: '/my-bookings', icon: History }
        ] : []),
        ...(role === 'STAFF' ? [
            { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard }
        ] : []),
        ...(role === 'ADMIN' ? [
            { name: 'Admin Panel', path: '/admin/dashboard', icon: Shield }
        ] : [])
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 py-3' : 'bg-transparent py-5'
            }`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-primary-600 p-2 rounded-lg">
                        <Car className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                        IndiaDrive
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${isActive(link.path) ? 'text-primary-400' : 'text-slate-300 hover:text-white'
                                }`}
                        >
                            <link.icon size={16} />
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4 bg-slate-900/50 rounded-full pl-4 pr-1 py-1 border border-slate-800">
                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-xs text-slate-400">{role}</span>
                                <span className="text-sm font-semibold">{user.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-slate-800 hover:bg-red-500/10 hover:text-red-400 p-2 rounded-full transition-colors group"
                                title="Logout"
                            >
                                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-slate-300 hover:text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-3 text-lg font-medium ${isActive(link.path) ? 'text-primary-400' : 'text-slate-300'
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <link.icon size={20} />
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                            <hr className="border-slate-800" />
                            {user ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">{role}</span>
                                        <span className="text-lg font-semibold">{user.username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 text-red-400 font-medium"
                                    >
                                        <LogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-4">
                                    <Link
                                        to="/login"
                                        className="text-center text-slate-300 py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-primary-600 text-white text-center py-3 rounded-xl font-semibold"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
