import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Key,
    RotateCcw,
    Search,
    AlertCircle,
    CheckCircle2,
    Car,
    User,
    Fuel,
    ClipboardList,
    ChevronRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import ApiService from '../services/apiService';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState('handover');
    const [bookingId, setBookingId] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // Modal & Flow State
    const [showModal, setShowModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [availableCars, setAvailableCars] = useState([]);
    const [showCarSelection, setShowCarSelection] = useState(false);

    // Form State
    const [selectedCar, setSelectedCar] = useState(null);
    const [fuelStatus, setFuelStatus] = useState('Full');
    const [notes, setNotes] = useState('');

    const handleFetchBooking = async () => {
        if (!bookingId) return;
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const data = await ApiService.getBooking(bookingId);
            setBookingDetails(data);
            setShowModal(true);
        } catch (err) {
            setMessage({ type: 'danger', text: 'Booking not found or error fetching details.' });
        } finally {
            setLoading(false);
        }
    };

    const handleLoadCars = async () => {
        if (!bookingDetails) return;
        setLoading(true);
        try {
            const cars = await ApiService.getAvailableCars(1, bookingDetails.startDate, bookingDetails.endDate);
            setAvailableCars(cars || []);
            setShowCarSelection(true);
        } catch (err) {
            alert("Could not load available cars.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteHandover = async () => {
        setLoading(true);
        const request = {
            bookingId: bookingDetails.bookingId,
            carId: selectedCar ? selectedCar.carId : null,
            fuelStatus: fuelStatus,
            notes: notes
        };

        try {
            await ApiService.processHandover(request);
            setMessage({ type: 'success', text: 'Handover Completed Successfully!' });
            closeAndReset();
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Handover Failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async () => {
        if (!bookingId) return;
        setLoading(true);
        try {
            const data = await ApiService.getBooking(bookingId);
            setBookingDetails(data);
            setActiveTab('return');
            setShowModal(true);
        } catch (err) {
            setMessage({ type: 'danger', text: 'Booking not found.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteReturn = async () => {
        setLoading(true);
        const request = {
            bookingId: bookingDetails.bookingId,
            returnDate: new Date().toISOString().split('T')[0],
            fuelStatus: fuelStatus,
            notes: notes
        };

        try {
            await ApiService.returnCar(request);
            setMessage({ type: 'success', text: 'Return Processed! Invoice generated.' });
            closeAndReset();
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Return Failed' });
        } finally {
            setLoading(false);
        }
    };

    const closeAndReset = () => {
        setShowModal(false);
        setBookingId('');
        setBookingDetails(null);
        setSelectedCar(null);
        setNotes('');
        setFuelStatus('Full');
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <header className="flex items-center gap-4 mb-12">
                <div className="bg-primary-600 p-3 rounded-2xl shadow-lg shadow-primary-600/20">
                    <LayoutDashboard className="text-white" size={28} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white">Staff Operations</h1>
                    <p className="text-slate-500 font-medium">Manage fleet handovers and returns efficiently</p>
                </div>
            </header>

            {!showModal ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-dark border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl"
                >
                    <div className="flex border-b border-slate-800">
                        <button
                            onClick={() => setActiveTab('handover')}
                            className={cn(
                                "flex-1 py-6 flex items-center justify-center gap-3 transition-all",
                                activeTab === 'handover' ? "bg-primary-600/10 text-primary-400 font-black border-b-2 border-primary-500" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Key size={20} />
                            Vehicle Handover
                        </button>
                        <button
                            onClick={() => setActiveTab('return')}
                            className={cn(
                                "flex-1 py-6 flex items-center justify-center gap-3 transition-all",
                                activeTab === 'return' ? "bg-emerald-500/10 text-emerald-400 font-black border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <RotateCcw size={20} />
                            Vehicle Return
                        </button>
                    </div>

                    <div className="p-10 lg:p-16 text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-md mx-auto"
                            >
                                {message.text && (
                                    <div className={cn(
                                        "mb-8 p-4 rounded-2xl flex items-center gap-3 border",
                                        message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                                    )}>
                                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                        <p className="text-sm font-bold">{message.text}</p>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block text-left ml-2">
                                            {activeTab === 'handover' ? 'Inbound Customer ID' : 'Returning Booking ID'}
                                        </label>
                                        <div className="relative group">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-primary-500" size={24} />
                                            <input
                                                type="number"
                                                className="w-full bg-slate-900/50 border border-slate-800 text-white pl-14 pr-6 py-6 rounded-[24px] focus:outline-none focus:border-primary-500/50 text-2xl font-black placeholder:text-slate-700 transition-all shadow-inner"
                                                placeholder="0000"
                                                value={bookingId}
                                                onChange={(e) => setBookingId(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => activeTab === 'handover' ? handleFetchBooking() : handleReturn()}
                                        disabled={loading || !bookingId}
                                        className={cn(
                                            "w-full py-6 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl",
                                            activeTab === 'handover'
                                                ? "bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/20"
                                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                                        )}
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Start Inspection'}
                                        {!loading && <ChevronRight size={24} />}
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            ) : (
                /* INSPECTION MODAL / VIEW */
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-dark border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl"
                >
                    <div className={cn(
                        "p-8 flex items-center justify-between",
                        activeTab === 'handover' ? "bg-primary-600 text-white" : "bg-emerald-600 text-white"
                    )}>
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <ClipboardList />
                            Inspection Details
                        </h2>
                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                            Booking #{bookingDetails?.bookingId}
                        </span>
                    </div>

                    <div className="p-10 lg:p-12">
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-800 p-3 rounded-2xl">
                                        <User className="text-primary-400" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Customer</p>
                                        <p className="text-lg font-bold">{bookingDetails?.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-800 p-3 rounded-2xl">
                                        <CheckCircle2 className="text-emerald-400" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Confirmation</p>
                                        <p className="text-lg font-bold">{bookingDetails?.confirmationNumber}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-800 p-3 rounded-2xl">
                                        <Car className="text-indigo-400" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Reserved Vehicle</p>
                                        <p className="text-lg font-bold">{bookingDetails?.carName || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-800 p-3 rounded-2xl">
                                        <Fuel className="text-yellow-400" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Assigned Dates</p>
                                        <p className="text-lg font-bold text-slate-300">{bookingDetails?.startDate} — {bookingDetails?.endDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!showCarSelection ? (
                            <div className="space-y-10 group">
                                {activeTab === 'handover' && (
                                    <div className="space-y-4">
                                        <label className="text-sm font-black text-slate-400 ml-1 uppercase tracking-widest">Vehicle Assignment</label>
                                        <div className="flex gap-4">
                                            <div className="flex-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                                                <Car size={24} className="text-primary-500" />
                                                <span className="text-lg font-bold">{selectedCar ? selectedCar.carModel : (bookingDetails?.carName || 'N/A')}</span>
                                            </div>
                                            <button
                                                onClick={handleLoadCars}
                                                className="bg-slate-800 hover:bg-slate-700 text-white px-8 rounded-2xl font-bold border border-slate-700 transition-colors"
                                            >
                                                Switch
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-400 ml-1 uppercase tracking-widest">Current Fuel Level</label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {['1/4', '1/2', '3/4', 'Full'].map(level => (
                                            <button
                                                key={level}
                                                onClick={() => setFuelStatus(level)}
                                                className={cn(
                                                    "py-4 rounded-2xl font-black transition-all border-2",
                                                    fuelStatus === level
                                                        ? (activeTab === 'handover' ? "bg-primary-600/10 border-primary-500 text-white" : "bg-emerald-500/10 border-emerald-500 text-white")
                                                        : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                                                )}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-400 ml-1 uppercase tracking-widest">Inspection Notes</label>
                                    <textarea
                                        className="w-full bg-slate-900 border border-slate-800 text-white p-6 rounded-3xl focus:outline-none focus:border-primary-500/50 min-h-[120px] transition-all"
                                        placeholder="Note any visible damage, cleanliness issues, or extra amenities included..."
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        onClick={closeAndReset}
                                        className="flex items-center justify-center gap-2 px-8 py-5 rounded-[24px] font-bold text-slate-500 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft size={20} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={activeTab === 'handover' ? handleCompleteHandover : handleCompleteReturn}
                                        disabled={loading}
                                        className={cn(
                                            "flex-1 py-5 rounded-[24px] font-black text-xl shadow-xl transition-all active:scale-[0.98]",
                                            activeTab === 'handover' ? "bg-primary-600 hover:bg-primary-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"
                                        )}
                                    >
                                        {loading ? 'Submitting...' : `Complete ${activeTab === 'handover' ? 'Handover' : 'Return'}`}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* CAR SELECTION OVERLAY */
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xl font-bold">Select Available Fleet</h4>
                                    <button onClick={() => setShowCarSelection(false)} className="text-slate-500 hover:text-white">Close</button>
                                </div>

                                <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {availableCars.length > 0 ? (
                                        availableCars.map(car => (
                                            <button
                                                key={car.carId}
                                                onClick={() => { setSelectedCar(car); setShowCarSelection(false); }}
                                                className={cn(
                                                    "flex items-center justify-between p-6 rounded-3xl border-2 transition-all text-left",
                                                    selectedCar?.carId === car.carId ? "bg-primary-600/10 border-primary-500" : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                                )}
                                            >
                                                <div>
                                                    <p className="font-black text-lg">{car.carModel}</p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{car.numberPlate} • {car.carType?.carTypeName}</p>
                                                </div>
                                                <ChevronRight className="text-slate-700" />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center bg-slate-900 rounded-3xl border-2 border-dashed border-slate-800">
                                            <Car className="mx-auto text-slate-800 mb-4" size={48} />
                                            <p className="text-slate-500 font-bold">No other vehicles available at this hub</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowCarSelection(false)}
                                    className="w-full bg-slate-800 py-4 rounded-2xl font-bold text-slate-300 hover:bg-slate-700"
                                >
                                    Cancel Selection
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default StaffDashboard;
