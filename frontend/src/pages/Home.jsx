import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Tag, ChevronRight, Star, MapPin, Users, Car } from 'lucide-react';

const Home = () => {
    const features = [
        {
            icon: ShieldCheck,
            title: "Safe & Secure",
            desc: "Verified cars and secure payment gateways for your peace of mind.",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        },
        {
            icon: Clock,
            title: "24/7 Support",
            desc: "Our team is always available to assist you with your journey.",
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            icon: Tag,
            title: "Best Rates",
            desc: "Affordable daily, weekly, and monthly rates for all car types.",
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        }
    ];

    const stats = [
        { label: "Happy Clients", value: "10k+", icon: Users },
        { label: "Premium Cars", value: "500+", icon: Star },
        { label: "Cities Covered", value: "50+", icon: MapPin }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
        >
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -z-10 w-full h-full">
                    <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary-600/20 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full"></div>
                </div>

                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-block py-1 px-4 rounded-full bg-primary-500/10 text-primary-400 text-sm font-bold border border-primary-500/20 mb-6">
                            PREMIUM FLEET SERVICE
                        </span>
                        <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tighter">
                            Drive Your <span className="bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">Dreams</span> Into Reality
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
                            Experience the ultimate freedom of the road with India's most premium fleet management solution. Rent luxury, drive comfort.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/booking"
                                className="group relative bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95"
                            >
                                <span>Book Now</span>
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/about"
                                className="px-8 py-4 rounded-2xl font-bold border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center"
                            >
                                Explore Fleet
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        {/* Mockup for image since generate failed */}
                        <div className="relative z-10 rounded-[40px] overflow-hidden border border-slate-700/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-slate-900 group">
                            <img
                                src="/images/luxury_car_hero.png"
                                alt="Luxury Car"
                                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 border-y border-slate-900 bg-slate-950/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <stat.icon className="text-primary-500 mb-4" size={32} />
                                <h3 className="text-4xl font-black mb-1">{stat.value}</h3>
                                <p className="text-slate-400 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why Choose IndiaDrive?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            We provide more than just a car. We provide an experience tailored to your needs with the highest standards of safety and comfort.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((f, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="glass-dark p-8 rounded-3xl border border-slate-800 hover:border-primary-500/50 transition-all group"
                            >
                                <div className={`${f.bg} ${f.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <f.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="relative rounded-[40px] bg-gradient-to-br from-primary-600 to-primary-800 p-12 lg:p-20 overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            {/* Decorative patterns could go here */}
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 relative z-10">
                            Ready to hit the road?
                        </h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto relative z-10">
                            Join thousands of satisfied travelers who choose IndiaDrive for their primary travel needs.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block bg-white text-primary-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-colors relative z-10 shadow-xl"
                        >
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-900 bg-slate-950">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <Car className="text-primary-500" size={24} />
                        <span className="text-2xl font-bold tracking-tight">IndiaDrive</span>
                    </div>
                    <p className="text-slate-500 mb-8">&copy; 2026 IndiaDrive Fleet Management. All rights reserved.</p>
                    <div className="flex justify-center space-x-6 text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </motion.div>
    );
};

export default Home;
