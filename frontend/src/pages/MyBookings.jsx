import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Calendar, Car, Tag, Clock, Package } from 'lucide-react';
import ApiService from '../services/apiService';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('myBookings') || '[]');
        setBookings(stored);
    }, []);

    const handleDownloadInvoice = async (bookingId) => {
        try {
            const blob = await ApiService.downloadInvoice(bookingId);
            if (blob.size < 100) {
                alert("Error generating invoice. Please check if booking is completed.");
                return;
            }
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading invoice:", error);
            alert("Failed to download invoice. Server may be unreachable.");
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl font-black mb-4">My Bookings</h1>
                <p className="text-slate-400 font-medium">View and manage your recent travel history</p>
            </motion.div>

            {bookings.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-dark border border-slate-800 p-20 rounded-[40px] text-center"
                >
                    <Package className="mx-auto text-slate-800 mb-6" size={80} />
                    <h3 className="text-2xl font-black text-slate-400 mb-2">No Bookings Found</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't made any reservations in this session yet. Your next adventure is just a few clicks away!</p>
                    <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-black transition-all">Start Booking</button>
                </motion.div>
            ) : (
                <div className="grid gap-6">
                    <AnimatePresence>
                        {bookings.map((b, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group glass-dark border border-slate-800 rounded-[32px] p-8 hover:border-primary-500/50 transition-all flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 blur-3xl -z-10 rounded-full"></div>

                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group-hover:bg-primary-600/10 group-hover:border-primary-500/30 transition-colors">
                                    <Car size={40} className="text-primary-500" />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-500/20">
                                            Confirmed
                                        </span>
                                        <span className="text-slate-500 text-xs font-bold font-mono tracking-tighter">ID: #{b.bookingId || 'PENDING'}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{b.carName || 'Premium Sedan'}</h3>
                                    <div className="flex flex-wrap items-center gap-6 text-slate-400">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Calendar size={16} className="text-slate-500" />
                                            {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Clock size={16} className="text-slate-500" />
                                            Active Reservation
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => handleDownloadInvoice(b.bookingId)}
                                        disabled={!b.bookingId}
                                        className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors text-sm border border-slate-700"
                                    >
                                        <FileText size={18} />
                                        Invoice PDF
                                    </button>
                                    <button className="flex-1 sm:flex-initial bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary-600/10 transition-all">
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
