import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Building2, ChevronRight, ArrowLeft, Loader2, SearchX } from 'lucide-react';
import ApiService from '../services/apiService';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const HubSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [hubs, setHubs] = useState([]);
    const [selectedHub, setSelectedHub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!state || !state.locationData) {
            setError("No location criteria provided. Please start from the booking page.");
            setLoading(false);
            return;
        }

        if (Array.isArray(state.locationData)) {
            setHubs(state.locationData);
            setLoading(false);
            return;
        }

        if (state.locationData.stateName && state.locationData.cityName) {
            const { stateName, cityName } = state.locationData;
            fetchHubs(stateName, cityName);
        } else {
            setLoading(false);
            setError("Invalid location criteria.");
        }
    }, [state]);

    const fetchHubs = async (stateName, cityName) => {
        try {
            const data = await ApiService.getHubs(stateName, cityName);
            setHubs(data);
        } catch (err) {
            setError("Failed to fetch hubs for the selected city.");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (!selectedHub) return;

        navigate("/select-car", {
            state: {
                pickupDateTime: state.pickupDateTime,
                returnDateTime: state.returnDateTime,
                differentReturn: state.differentReturn,
                hub: selectedHub
            }
        });
    };

    return (
        <div className="container mx-auto px-6 max-w-4xl py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-black mb-4">Select Hub</h1>
                <p className="text-slate-400">Choose the most convenient pick-up location for your journey</p>
            </motion.div>

            <div className="glass-dark border border-slate-800 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-indigo-600"></div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 size={48} className="text-primary-500 animate-spin" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching nearest hubs...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="bg-red-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <SearchX className="text-red-500" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-red-400 mb-4">{error}</h3>
                        <button
                            onClick={() => navigate('/booking')}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl transition-all"
                        >
                            Return to Search
                        </button>
                    </div>
                ) : hubs.length === 0 ? (
                    <div className="text-center py-20">
                        <SearchX className="mx-auto text-slate-700 mb-6" size={64} />
                        <p className="text-xl font-bold text-slate-400 mb-8">No hubs found for this location.</p>
                        <button
                            onClick={() => navigate('/booking')}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-2xl font-bold transition-all"
                        >
                            Try Different Location
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 mb-10">
                        {hubs.map((hub, idx) => (
                            <motion.label
                                key={hub.hubId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                    "relative flex items-center p-6 rounded-[24px] border-2 cursor-pointer transition-all group",
                                    selectedHub?.hubId === hub.hubId
                                        ? "bg-primary-600/10 border-primary-500 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mr-6 flex-shrink-0",
                                    selectedHub?.hubId === hub.hubId ? "bg-primary-600 border-primary-500" : "bg-slate-800 border-slate-700"
                                )}>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full bg-white transition-all",
                                        selectedHub?.hubId === hub.hubId ? "scale-100" : "scale-0"
                                    )} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h3 className="text-lg font-black">{hub.hubName}</h3>
                                        {idx === 0 && (
                                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                Fastest Pickup
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-400 flex items-center gap-2 mb-2">
                                        <MapPin size={16} className="text-primary-500" />
                                        {hub.hubAddress}, {hub.cityName}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-tighter">
                                            <Phone size={14} className="text-emerald-500" />
                                            {hub.contactNumber}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-tighter">
                                            <Building2 size={14} className="text-indigo-500" />
                                            {hub.stateName}
                                        </span>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="hub"
                                    className="hidden"
                                    checked={selectedHub?.hubId === hub.hubId}
                                    onChange={() => setSelectedHub(hub)}
                                />
                            </motion.label>
                        ))}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <button
                        onClick={() => navigate('/booking')}
                        className="flex items-center gap-2 text-slate-400 font-bold hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Search
                    </button>
                    <button
                        onClick={handleContinue}
                        disabled={!selectedHub || loading}
                        className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-12 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]"
                    >
                        Continue to Cars
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HubSelection;
