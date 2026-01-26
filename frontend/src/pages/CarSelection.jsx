import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car as CarIcon, Filter, ArrowLeft, Loader2, Gauge, Fuel, Users, Star, Info } from 'lucide-react';
import ApiService from '../services/apiService';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const CarSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCarTypeFilter, setSelectedCarTypeFilter] = useState('');
    const [carTypes, setCarTypes] = useState([]);

    useEffect(() => {
        if (!state || !state.hub) {
            setError("Missing booking details. Please start over.");
            setLoading(false);
            return;
        }
        loadData();
    }, [state]);

    const loadData = async () => {
        try {
            const [carsData, typesData] = await Promise.all([
                ApiService.getAvailableCars(state.hub.hubId, state.pickupDateTime, state.returnDateTime),
                ApiService.getCarTypes()
            ]);
            setCars(carsData || []);
            setCarTypes(typesData || []);
        } catch (err) {
            setError("Failed to load available vehicles.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCar = (car) => {
        navigate('/booking', {
            state: {
                selectedCar: car,
                pickupHub: state.hub,
                differentReturnChecked: state.differentReturn,
                startDate: state.pickupDateTime,
                endDate: state.returnDateTime
            }
        });
    };

    const filteredCars = selectedCarTypeFilter
        ? cars.filter(c => c.carType?.carTypeId === Number(selectedCarTypeFilter))
        : cars;

    return (
        <div className="container mx-auto px-6 py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 group font-bold"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Change Location
                    </button>
                    <h1 className="text-4xl font-black text-white">Choose a Vehicle</h1>
                </div>

                <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl">
                    <div className="bg-slate-800 p-2.5 rounded-xl">
                        <Filter size={20} className="text-primary-400" />
                    </div>
                    <select
                        className="bg-transparent text-white font-bold pr-8 focus:outline-none cursor-pointer"
                        value={selectedCarTypeFilter}
                        onChange={e => setSelectedCarTypeFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {carTypes.map(t => <option key={t.carTypeId} value={t.carTypeId}>{t.carTypeName}</option>)}
                    </select>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 size={64} className="text-primary-500 animate-spin mb-6" />
                    <p className="text-slate-500 font-black uppercase tracking-[0.2em]">Searching available fleet...</p>
                </div>
            ) : error ? (
                <div className="glass-dark border border-red-500/20 p-12 rounded-[32px] text-center max-w-2xl mx-auto">
                    <Info className="text-red-500 mx-auto mb-6" size={48} />
                    <h3 className="text-xl font-bold text-slate-200 mb-6">{error}</h3>
                    <button onClick={() => navigate('/')} className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold">Return Home</button>
                </div>
            ) : filteredCars.length === 0 ? (
                <div className="glass-dark border border-slate-800 p-20 rounded-[40px] text-center max-w-3xl mx-auto">
                    <CarIcon className="text-slate-800 mx-auto mb-6" size={80} />
                    <h3 className="text-2xl font-black text-slate-400 mb-4">No Vehicles Match Your Criteria</h3>
                    <p className="text-slate-500 mb-10 max-w-md mx-auto">Try adjusting your filters or choosing a different hub or date range.</p>
                    <button
                        onClick={() => navigate('/booking')}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-2xl font-bold transition-all"
                    >
                        New Search
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredCars.map((car, idx) => (
                            <motion.div
                                key={car.carId}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group glass-dark border border-slate-800 rounded-[32px] overflow-hidden hover:border-primary-500/50 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
                            >
                                <div className="relative h-56 overflow-hidden bg-slate-900">
                                    <img
                                        src={car.imagePath || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80'}
                                        alt={car.carModel}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-primary-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                        {car.carType?.carTypeName}
                                    </div>
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <div className="glass-dark backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white">
                                            <Gauge size={14} className="text-primary-400" /> Auto
                                        </div>
                                        <div className="glass-dark backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white">
                                            <Users size={14} className="text-primary-400" /> 5
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-2xl font-black text-white">{car.carModel}</h3>
                                        <div className="flex items-center text-yellow-500">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-xs font-black ml-1">4.9</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium mb-6 uppercase tracking-widest">{car.carNumber} • {car.color}</p>

                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-2xl text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">Daily</p>
                                            <p className="text-lg font-black text-white">${car.carType?.dailyRate}</p>
                                        </div>
                                        <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-2xl text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">Weekly</p>
                                            <p className="text-lg font-black text-white">${car.carType?.weeklyRate}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center ring-1 ring-primary-500/30">
                                            <p className="text-[10px] font-black text-primary-400 uppercase tracking-tighter mb-0.5">Save</p>
                                            <p className="text-lg font-black text-white">${car.carType?.monthlyRate}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleSelectCar(car)}
                                        className="w-full bg-slate-950 hover:bg-primary-600 border border-slate-800 hover:border-primary-500 text-white py-4 rounded-2xl font-black transition-all group-hover:shadow-[0_10px_30px_rgba(37,99,235,0.2)] active:scale-[0.97]"
                                    >
                                        Book Now
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

export default CarSelection;
