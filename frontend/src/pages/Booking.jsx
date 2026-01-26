import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Calendar, Car as CarIcon, PlusCircle, CheckCircle2,
    Search, Plane, Building2, ChevronRight, ArrowLeft,
    User, Mail, Phone, CreditCard, ShieldCheck, Download, AlertCircle
} from 'lucide-react';
import ApiService from '../services/apiService';
import AuthService from '../services/authService';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);

    // Data States
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [cars, setCars] = useState([]);
    const [addOns, setAddOns] = useState([]);
    const [carTypes, setCarTypes] = useState([]);

    // Selection States
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedHub, setSelectedHub] = useState('');
    const [selectedCarType, setSelectedCarType] = useState('');
    const [dates, setDates] = useState({ startDate: '', endDate: '' });
    const [selectedCar, setSelectedCar] = useState(null);
    const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);

    // Customer States
    const [customer, setCustomer] = useState({
        email: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        dateOfBirth: '',
        addressLine1: '',
        city: '',
        drivingLicenseNumber: '',
        issuedByDL: '',
        validThroughDL: '',
        passportNumber: '',
        passportIssuedBy: '',
        passportIssueDate: '',
        passportValidThrough: '',
        creditCardType: 'VISA',
        creditCardNumber: ''
    });

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [airportCode, setAirportCode] = useState('');
    const [differentReturn, setDifferentReturn] = useState(false);

    useEffect(() => {
        loadStates();
        loadAddOns();
        loadCarTypes();

        if (location.state) {
            if (location.state.selectedCar) {
                const { selectedCar, pickupHub, startDate, endDate } = location.state;
                setDates({ startDate, endDate });
                setSelectedHub(pickupHub.hubId);
                setHubs([pickupHub]);
                setSelectedCar(selectedCar);
                setStep(3);
            }

            const { selectedCarType: preCarType, pickupHub: preHub } = location.state;
            if (preCarType) setSelectedCarType(preCarType.carTypeId);
            if (preHub) {
                setHubs([preHub]);
                setSelectedHub(preHub.hubId);
            }
        }
    }, [location.state]);

    const loadStates = async () => {
        try {
            const data = await ApiService.getAllStates();
            setStates(data);
        } catch (err) {
            console.error("Failed to load states", err);
        }
    };

    const loadAddOns = async () => {
        try {
            const data = await ApiService.getAddOns();
            setAddOns(data);
        } catch (err) {
            console.error("Failed to load add-ons", err);
        }
    };

    const loadCarTypes = async () => {
        try {
            const data = await ApiService.getCarTypes();
            setCarTypes(data);
        } catch (err) {
            console.error("Failed to load car types", err);
        }
    };

    const handleStateChange = async (e) => {
        const stateId = e.target.value;
        const stateName = e.target.options[e.target.selectedIndex].text;
        setSelectedState({ id: stateId, name: stateName });
        setSelectedCity(null);
        setHubs([]);
        try {
            const data = await ApiService.getCitiesByState(stateId);
            setCities(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCityChange = async (e) => {
        const cityId = e.target.value;
        const cityName = e.target.options[e.target.selectedIndex].text;
        setSelectedCity({ id: cityId, name: cityName });
        try {
            const data = await ApiService.getHubs(selectedState.name, cityName);
            setHubs(data);
        } catch (err) {
            console.error(err);
        }
    };

    const searchByAirport = async () => {
        if (!airportCode || !dates.startDate || !dates.endDate) {
            setError("Please fill in airport code and both dates.");
            return;
        }
        setLoading(true);
        try {
            const data = await ApiService.searchLocations(airportCode);
            navigate('/select-hub', {
                state: {
                    pickupDateTime: dates.startDate,
                    returnDateTime: dates.endDate,
                    differentReturn,
                    locationData: data,
                    searchType: 'airport'
                }
            });
        } catch (err) {
            setError('Airport search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const searchByCity = () => {
        if (!selectedState || (!selectedCity && cities.length > 0) || !dates.startDate || !dates.endDate) {
            setError('Please select state, city and both dates.');
            return;
        }
        navigate('/select-hub', {
            state: {
                pickupDateTime: dates.startDate,
                returnDateTime: dates.endDate,
                differentReturn,
                locationData: {
                    stateName: selectedState.name,
                    cityName: selectedCity.name
                },
                searchType: 'city'
            }
        });
    };

    const toggleAddOn = (id) => {
        setSelectedAddOnIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleFindCustomer = async () => {
        if (!customer.email) return;
        setLoading(true);
        try {
            const data = await ApiService.findCustomer(customer.email);
            if (data) {
                setCustomer(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCustomer = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await ApiService.saveCustomer(customer);
            if (response.success && response.data) {
                setCustomer(prev => ({ ...prev, ...response.data }));
                setStep(4);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving customer details');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!customer.custId) return;
        setLoading(true);
        const bookingRequest = {
            carId: selectedCar.carId,
            customerId: customer.custId,
            pickupHubId: selectedHub,
            returnHubId: selectedHub,
            startDate: dates.startDate,
            endDate: dates.endDate,
            addOnIds: selectedAddOnIds,
            email: customer.email
        };
        try {
            const response = await ApiService.createBooking(bookingRequest);
            alert('Booking Confirmed! ID: ' + (response.bookingId || 'Success'));
            navigate('/my-bookings');
        } catch (err) {
            setError('Booking Failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, name: 'Location', icon: MapPin },
        { id: 2, name: 'Car', icon: CarIcon },
        { id: 3, name: 'Add-ons', icon: PlusCircle },
        { id: 4, name: 'Review', icon: CheckCircle2 }
    ];

    return (
        <div className="container mx-auto px-6 max-w-6xl">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-12 relative max-w-3xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10"></div>
                {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                            step >= s.id ? "bg-primary-600 border-primary-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-slate-900 border-slate-800 text-slate-500"
                        )}>
                            <s.icon size={20} />
                        </div>
                        <span className={cn(
                            "mt-3 text-xs font-bold uppercase tracking-wider",
                            step >= s.id ? "text-primary-400" : "text-slate-500"
                        )}>
                            {s.name}
                        </span>
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid lg:grid-cols-5 gap-8"
                    >
                        <div className="lg:col-span-3 space-y-6">
                            <div className="glass-dark border border-slate-800 rounded-[32px] p-8 shadow-2xl">
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                    <Calendar className="text-primary-500" />
                                    Make Reservation
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Pickup Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-primary-500/50 transition-all"
                                            onChange={e => setDates({ ...dates, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Return Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-primary-500/50 transition-all"
                                            onChange={e => setDates({ ...dates, endDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <Plane size={18} className="text-blue-400" />
                                            Airport Pickup
                                        </h4>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1 group">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Airport Code (e.g. BOM)"
                                                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary-500/50 transition-all uppercase"
                                                    value={airportCode}
                                                    onChange={e => setAirportCode(e.target.value.toUpperCase())}
                                                />
                                            </div>
                                            <button
                                                onClick={searchByAirport}
                                                className="bg-slate-800 hover:bg-slate-700 text-white px-8 rounded-2xl font-bold transition-all border border-slate-700 whitespace-nowrap"
                                            >
                                                Find Airport
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-800"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-[#0f172a] px-4 text-slate-600 font-bold tracking-widest">Or Select City</span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">State</label>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-primary-500/50 transition-all appearance-none cursor-pointer"
                                                onChange={handleStateChange}
                                            >
                                                <option value="">Select State</option>
                                                {states.map(s => <option key={s.stateId} value={s.stateId}>{s.stateName}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">City</label>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-primary-500/50 transition-all appearance-none cursor-pointer disabled:opacity-50"
                                                onChange={handleCityChange}
                                                disabled={!cities.length}
                                            >
                                                <option value="">Select City</option>
                                                {cities.map(c => <option key={c.cityId} value={c.cityId}>{c.cityName}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 px-2">
                                        <button
                                            onClick={() => setDifferentReturn(!differentReturn)}
                                            className={cn(
                                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                differentReturn ? "bg-primary-600 border-primary-500" : "bg-slate-900 border-slate-700"
                                            )}
                                        >
                                            {differentReturn && <CheckCircle2 size={14} className="text-white" />}
                                        </button>
                                        <span className="text-slate-300 font-medium">I may return the car to a different location</span>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3">
                                            <AlertCircle size={20} />
                                            <p className="text-sm font-medium">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={searchByCity}
                                        className="w-full bg-primary-600 hover:bg-primary-500 text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-[0.98]"
                                    >
                                        Continue to Select Hub
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[32px] p-8 text-white relative overflow-hidden h-full">
                                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                <h4 className="text-4xl font-black mb-4">Exclusive Deals</h4>
                                <p className="text-blue-100 text-lg mb-8">Save up to 25% on long-term rentals this monsoon season!</p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                        <ShieldCheck className="text-emerald-300" />
                                        <span>Full Insurance Coverage</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                        <MapPin className="text-emerald-300" />
                                        <span>Unlimited Miles</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid lg:grid-cols-3 gap-8"
                    >
                        {/* Add-ons */}
                        <div className="lg:col-span-1">
                            <div className="glass-dark border border-slate-800 rounded-[32px] p-6 shadow-xl sticky top-24">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <PlusCircle className="text-emerald-500" />
                                    Premium Add-ons
                                </h3>
                                <div className="space-y-3">
                                    {addOns.map(addon => (
                                        <button
                                            key={addon.addOnId}
                                            onClick={() => toggleAddOn(addon.addOnId)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                                                selectedAddOnIds.includes(addon.addOnId)
                                                    ? "bg-emerald-500/10 border-emerald-500/50 text-white"
                                                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                                                    selectedAddOnIds.includes(addon.addOnId) ? "bg-emerald-500 border-emerald-500" : "border-slate-700"
                                                )}>
                                                    {selectedAddOnIds.includes(addon.addOnId) && <CheckCircle2 size={12} className="text-white" />}
                                                </div>
                                                <span className="font-medium">{addon.addOnName}</span>
                                            </div>
                                            <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded-lg">
                                                ${addon.addonDailyRate}/day
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="lg:col-span-2">
                            <div className="glass-dark border border-slate-800 rounded-[32px] p-8 shadow-2xl">
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                    <User className="text-primary-500" />
                                    Personal Details
                                </h3>

                                <div className="mb-10 flex gap-4">
                                    <div className="relative flex-1 group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Member Email (Search & Autofill)"
                                            className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                                            value={customer.email}
                                            onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleFindCustomer}
                                        className="bg-primary-600 hover:bg-primary-500 text-white px-8 rounded-2xl font-bold transition-all"
                                    >
                                        Find
                                    </button>
                                </div>

                                <form onSubmit={handleSaveCustomer} className="space-y-10">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                                            <input type="text" className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-primary-500/50" value={customer.firstName} onChange={e => setCustomer({ ...customer, firstName: e.target.value })} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                                            <input type="text" className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-primary-500/50" value={customer.lastName} onChange={e => setCustomer({ ...customer, lastName: e.target.value })} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Mobile</label>
                                            <input type="text" className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-primary-500/50" value={customer.mobileNumber} onChange={e => setCustomer({ ...customer, mobileNumber: e.target.value })} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">DOB</label>
                                            <input type="date" className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-primary-500/50" value={customer.dateOfBirth} onChange={e => setCustomer({ ...customer, dateOfBirth: e.target.value })} />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Address</label>
                                            <input type="text" className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-primary-500/50" value={customer.addressLine1} onChange={e => setCustomer({ ...customer, addressLine1: e.target.value })} />
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-bold mb-6 text-slate-300 border-b border-slate-800 pb-2">Documents</h4>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase ml-1">Driving License</label>
                                                <input type="text" className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-xl focus:outline-none focus:border-primary-500/50" value={customer.drivingLicenseNumber} onChange={e => setCustomer({ ...customer, drivingLicenseNumber: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase ml-1">Passport No</label>
                                                <input type="text" className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-xl focus:outline-none focus:border-primary-500/50" value={customer.passportNumber} onChange={e => setCustomer({ ...customer, passportNumber: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase ml-1">Expiry Date</label>
                                                <input type="date" className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-xl focus:outline-none focus:border-primary-500/50" value={customer.validThroughDL} onChange={e => setCustomer({ ...customer, validThroughDL: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-bold mb-6 text-slate-300 border-b border-slate-800 pb-2">Payment Info</h4>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase ml-1">Card Type</label>
                                                <select className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-xl focus:outline-none focus:border-primary-500/50 appearance-none" value={customer.creditCardType} onChange={e => setCustomer({ ...customer, creditCardType: e.target.value })}>
                                                    <option value="VISA">VISA</option>
                                                    <option value="MasterCard">MasterCard</option>
                                                    <option value="Amex">Amex</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase ml-1">Card Number</label>
                                                <input type="text" className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-xl focus:outline-none focus:border-primary-500/50" value={customer.creditCardNumber} onChange={e => setCustomer({ ...customer, creditCardNumber: e.target.value })} required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-4 pt-6">
                                        <button type="button" onClick={() => navigate(-1)} className="px-8 py-4 rounded-2xl font-bold border border-slate-800 hover:bg-slate-800 transition-colors">
                                            Return to Selection
                                        </button>
                                        <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-600/20 active:scale-95 transition-all">
                                            Review Booking
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="glass-dark border border-slate-800 rounded-[40px] p-8 lg:p-12 shadow-2xl relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -z-10 rounded-full"></div>

                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-black mb-4">Complete your booking</h2>
                                <p className="text-slate-400">Please review all details before payment</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 mb-12">
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Selected Vehicle</p>
                                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                                            <h4 className="text-2xl font-bold mb-1">{selectedCar?.carModel}</h4>
                                            <p className="text-primary-400 font-bold mb-4">{selectedCar?.carType?.carTypeName}</p>
                                            <div className="flex items-center gap-4 text-slate-400 text-sm">
                                                <span className="flex items-center gap-1.5"><Calendar size={16} /> {dates.startDate}</span>
                                                <span className="flex items-center gap-1.5"><ArrowLeft className="rotate-180" size={16} /> {dates.endDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Customer Details</p>
                                        <div className="space-y-2 px-2">
                                            <p className="text-xl font-bold">{customer.firstName} {customer.lastName}</p>
                                            <p className="text-slate-400">{customer.email}</p>
                                            <p className="text-slate-400">{customer.mobileNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Add-ons & Services</p>
                                        <div className="space-y-3">
                                            {selectedAddOnIds.length > 0 ? (
                                                selectedAddOnIds.map(id => {
                                                    const addon = addOns.find(a => a.addOnId === id);
                                                    return (
                                                        <div key={id} className="flex justify-between items-center text-slate-300">
                                                            <span>{addon?.addOnName}</span>
                                                            <span className="font-bold">${addon?.addonDailyRate}/day</span>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <p className="text-slate-500 italic">No add-ons selected</p>
                                            )}
                                            <div className="pt-4 border-t border-slate-800 mt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold">Base Total</span>
                                                    <span className="text-2xl font-black text-emerald-400">${selectedCar?.carType?.dailyRate || 50}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-primary-600/10 border border-primary-500/20 p-6 rounded-3xl">
                                        <p className="text-sm font-medium text-primary-300 mb-2 flex items-center gap-2">
                                            <ShieldCheck size={18} />
                                            IndiaDrive Protection Active
                                        </p>
                                        <p className="text-xs text-primary-400/80">Your rental is covered by our comprehensive insurance policy and 24/7 roadside assistance.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-8 py-5 rounded-[24px] font-bold border border-slate-700 hover:bg-slate-800 transition-colors"
                                >
                                    Modify Details
                                </button>
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={loading}
                                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-5 rounded-[24px] font-black text-xl shadow-xl shadow-primary-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Processing...' : 'Confirm & Pay Securely'}
                                    {!loading && <CreditCard size={24} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Booking;
