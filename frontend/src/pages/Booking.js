import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../services/api';
import AuthService from '../services/authService';

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
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
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

    useEffect(() => {
        loadStates();
        loadAddOns();
        loadCarTypes();

        // Handle pre-filled data from redirects (New Flow)
        if (location.state) {
            // Case: Returning from Car Selection
            if (location.state.selectedCar) {
                const { selectedCar, pickupHub, returnHub, startDate, endDate, differentReturnChecked } = location.state;
                setDates({ startDate, endDate });
                setSelectedHub(pickupHub.hubId);
                // Pre-fill hubs to ensure dropdown shows something if list not loaded
                setHubs([pickupHub]);

                setSelectedCar(selectedCar);
                setStep(3); // Jump to Add-ons

                // If different return logic needed?
                // if (differentReturnChecked) ...
            }

            // Handle pre-filled data from redirects
            const { selectedCarType, pickupHub } = location.state;

            if (selectedCarType) {
                setSelectedCarType(selectedCarType.carTypeId);
            }

            if (pickupHub) {
                // Pre-fill hub selection
                setHubs([pickupHub]);
                setSelectedHub(pickupHub.hubId);
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
        setSelectedCity('');
        setHubs([]);

        try {
            const data = await ApiService.getCitiesByState(stateId);
            setCities(data);
        } catch (err) {
            console.error(err);
            setCities([{ cityId: 1, cityName: 'Pune' }, { cityId: 2, cityName: 'Mumbai' }]);
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
            setHubs([{ hubId: 1, hubName: 'Pune Airport Hub', hubAddress: 'Pune Airport' }]);
        }
    };

    const [airportCode, setAirportCode] = useState('');
    const [differentReturn, setDifferentReturn] = useState(false);

    const handleSearchLocation = async (e) => {
        e.preventDefault();
        // This handles "Search" or "Find Airport"
        // But we have two different actions in the reference.
        // Let's split them or handle based on input.
    };

    const searchByAirport = async () => {
        if (!airportCode) {
            alert("Enter airport code");
            return;
        }
        setLoading(true);
        try {
            const data = await ApiService.searchLocations(airportCode); // Returns Hub list
            navigate('/select-hub', {
                state: {
                    pickupDateTime: dates.startDate,
                    returnDateTime: dates.endDate,
                    differentReturn,
                    locationData: data, // Passing array of hubs
                    searchType: 'airport'
                }
            });
        } catch (err) {
            alert('Airport search failed');
        } finally {
            setLoading(false);
        }
    };

    const searchByCity = (e) => {
        e.preventDefault();
        if (!selectedState || (!selectedCity && cities.length > 0)) {
            alert('Please select state and city');
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
        if (!customer.email) {
            alert('Please enter an email to search.');
            return;
        }
        try {
            setLoading(true);
            const data = await ApiService.findCustomer(customer.email);
            if (data) {
                setCustomer(prev => ({ ...prev, ...data }));
                alert('Member found! Details auto-filled.');
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert('Member not found. Please fill in details.');
            } else {
                console.error(err);
                alert('Error fetching member details.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCustomer = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await ApiService.saveCustomer(customer);
            if (response.success && response.data) {
                setCustomer(prev => ({ ...prev, ...response.data })); // Update with ID
                setStep(4);
            } else {
                alert('Failed to save customer info.');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving customer info: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        // Customer is already saved/retrieved in step 3
        if (!customer.custId) {
            alert("Customer ID missing. Please save customer details first.");
            return;
        }

        const bookingRequest = {
            carId: selectedCar.carId,
            customerId: customer.custId, // Using the ID from saved customer
            pickupHubId: selectedHub,
            returnHubId: selectedHub,
            startDate: dates.startDate,
            endDate: dates.endDate,
            addOnIds: selectedAddOnIds,
            email: customer.email
        };

        try {
            const response = await ApiService.createBooking(bookingRequest);
            const existing = JSON.parse(localStorage.getItem('myBookings') || '[]');
            existing.push({ ...response, carName: selectedCar.carModel });
            localStorage.setItem('myBookings', JSON.stringify(existing));

            alert('Booking Confirmed! ID: ' + (response.bookingId || 'Pending'));
            navigate('/');
        } catch (err) {
            alert('Booking Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold">Book Your Ride</h2>

            <div className="d-flex justify-content-between mb-5 position-relative">
                <div className={`text-center ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                    <div className="fs-4 fw-bold">1</div> <small>Location</small>
                </div>
                <div className={`text-center ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                    <div className="fs-4 fw-bold">2</div> <small>Car</small>
                </div>
                <div className={`text-center ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
                    <div className="fs-4 fw-bold">3</div> <small>Add-ons</small>
                </div>
                <div className={`text-center ${step >= 4 ? 'text-primary' : 'text-muted'}`}>
                    <div className="fs-4 fw-bold">4</div> <small>Confirm</small>
                </div>
            </div>

            {/* Step 1: Location & Date (Unchanged Logic, just re-render) */}
            {/* Step 1: Location & Date (Refactored to MakeReservation style) */}
            {step === 1 && (
                <div className="row g-4">
                    {/* Left Panel */}
                    <div className="col-md-6">
                        <div className="card glass-card p-4 h-100">
                            <h3>Make Reservation</h3>

                            {/* Dates */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Pick-Up Date</label>
                                    <input type="date" className="form-control" onChange={e => setDates({ ...dates, startDate: e.target.value })} required />
                                    {/* Note: User used datetime-local, keeping date for consistency with legacy or switching? keeping date for now */}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Return Date</label>
                                    <input type="date" className="form-control" onChange={e => setDates({ ...dates, endDate: e.target.value })} required />
                                </div>
                            </div>

                            <hr />

                            {/* Airport Section */}
                            <h5 className="mt-3">Pick-Up Location</h5>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Enter Airport Code</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={airportCode}
                                        onChange={e => setAirportCode(e.target.value.toUpperCase())}
                                        placeholder="e.g. BOM"
                                    />
                                    <button className="btn btn-outline-primary" type="button" onClick={searchByAirport} disabled={loading}>
                                        {loading ? '...' : 'Find Airport'}
                                    </button>
                                </div>
                            </div>

                            <div className="text-center fw-bold my-2">OR</div>

                            {/* City Section */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Enter State</label>
                                <select className="form-select" onChange={handleStateChange}>
                                    <option value="">--Select State--</option>
                                    {states.map(s => <option key={s.stateId} value={s.stateId}>{s.stateName}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">City</label>
                                <select className="form-select" onChange={handleCityChange} disabled={!selectedCity && cities.length === 0}>
                                    <option value="">--Select City--</option>
                                    {cities.map(c => <option key={c.cityId} value={c.cityId}>{c.cityName}</option>)}
                                </select>
                            </div>

                            {/* Return Checkbox */}
                            <div className="form-check mb-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={differentReturn}
                                    onChange={() => setDifferentReturn(!differentReturn)}
                                />
                                <label className="form-check-label">
                                    I may return the car to different location
                                </label>
                            </div>

                            <button className="btn btn-primary w-100 py-2 fs-5" onClick={searchByCity}>
                                Continue Booking
                            </button>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="col-md-6">
                        <div className="card h-100 p-4 bg-light border-0 d-flex align-items-center justify-content-center text-center">
                            <div>
                                <h4 className="fw-bold mb-3">Special Offers</h4>
                                <p className="text-muted">For sale Ads / Promotions</p>
                                <i className="bi bi-tag-fill text-warning display-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Choose Car */}
            {step === 2 && (
                <div className="row g-4">
                    {cars.map(car => (
                        <div className="col-md-4" key={car.carId}>
                            <div className="card h-100 shadow-sm border-0">
                                <img src={car.imagePath || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=60'}
                                    className="card-img-top" alt={car.carModel} style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{car.carModel}</h5>
                                    <p className="card-text text-muted">{car.carType?.carTypeName || 'Sedan'}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="fs-5 fw-bold text-primary">${car.carType?.dailyRate || 50}/day</span>
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => { setSelectedCar(car); setStep(3); }}>
                                            Select
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="col-12 mt-3">
                        <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                    </div>
                </div>
            )}

            {/* Step 3: Add-ons & Customer Info */}
            {step === 3 && (
                <div className="row">
                    {/* Add-ons Column */}
                    <div className="col-md-4 mb-4">
                        <div className="card glass-card p-4 h-100">
                            <h4 className="fw-bold mb-3">Add-ons</h4>
                            {addOns.length > 0 ? (
                                <div className="list-group">
                                    {addOns.map(addon => (
                                        <label key={addon.addOnId} className="list-group-item d-flex gap-3 align-items-center bg-transparent">
                                            <input
                                                className="form-check-input flex-shrink-0"
                                                type="checkbox"
                                                checked={selectedAddOnIds.includes(addon.addOnId)}
                                                onChange={() => toggleAddOn(addon.addOnId)}
                                            />
                                            <span className="d-flex justify-content-between w-100">
                                                <span>{addon.addOnName}</span>
                                                <span className="text-muted">${addon.addonDailyRate.toFixed(2)}</span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            ) : <p className="text-muted">No add-ons available.</p>}
                        </div>
                    </div>

                    {/* Customer Form Column */}
                    <div className="col-md-8">
                        <div className="card glass-card p-4">
                            <h4 className="fw-bold mb-3">Customer Information</h4>

                            {/* Membership Login */}
                            <div className="input-group mb-4">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter Email to Retrieve Details"
                                    value={customer.email}
                                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                />
                                <button className="btn btn-outline-primary" type="button" onClick={handleFindCustomer}>
                                    Go / Auto-Fill
                                </button>
                            </div>

                            <form onSubmit={handleSaveCustomer}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" value={customer.firstName} onChange={e => setCustomer({ ...customer, firstName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" className="form-control" value={customer.lastName} onChange={e => setCustomer({ ...customer, lastName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Mobile</label>
                                        <input type="text" className="form-control" value={customer.mobileNumber} onChange={e => setCustomer({ ...customer, mobileNumber: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Date of Birth</label>
                                        <input type="date" className="form-control" value={customer.dateOfBirth} onChange={e => setCustomer({ ...customer, dateOfBirth: e.target.value })} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Address</label>
                                        <input type="text" className="form-control" value={customer.addressLine1} onChange={e => setCustomer({ ...customer, addressLine1: e.target.value })} />
                                    </div>

                                    <h5 className="fw-bold mt-4">Documents</h5>
                                    <div className="col-md-4">
                                        <label className="form-label">Driving License No</label>
                                        <input type="text" className="form-control" value={customer.drivingLicenseNumber} onChange={e => setCustomer({ ...customer, drivingLicenseNumber: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">DL Issued By</label>
                                        <input type="text" className="form-control" value={customer.issuedByDL} onChange={e => setCustomer({ ...customer, issuedByDL: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">DL Valid Thru</label>
                                        <input type="date" className="form-control" value={customer.validThroughDL} onChange={e => setCustomer({ ...customer, validThroughDL: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Passport No</label>
                                        <input type="text" className="form-control" value={customer.passportNumber} onChange={e => setCustomer({ ...customer, passportNumber: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Passport Valid Thru</label>
                                        <input type="date" className="form-control" value={customer.passportValidThrough} onChange={e => setCustomer({ ...customer, passportValidThrough: e.target.value })} />
                                    </div>

                                    <h5 className="fw-bold mt-4">Payment</h5>
                                    <div className="col-md-4">
                                        <label className="form-label">Card Type</label>
                                        <select className="form-select" value={customer.creditCardType} onChange={e => setCustomer({ ...customer, creditCardType: e.target.value })}>
                                            <option value="VISA">VISA</option>
                                            <option value="MasterCard">MasterCard</option>
                                            <option value="Amex">Amex</option>
                                        </select>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label">Card Number</label>
                                        <input type="text" className="form-control" value={customer.creditCardNumber} onChange={e => setCustomer({ ...customer, creditCardNumber: e.target.value })} required />
                                    </div>
                                </div>

                                <div className="mt-4 d-flex justify-content-between">
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                                    <button type="submit" className="btn btn-primary px-4">Continue to Confirm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Confirm Booking */}
            {step === 4 && (
                <div className="card glass-card p-4 mx-auto" style={{ maxWidth: '600px' }}>
                    <h3 className="card-title mb-4">Confirm Booking</h3>
                    <div className="mb-3">
                        <p><strong>Car:</strong> {selectedCar?.carModel} ({selectedCar?.carType?.carTypeName})</p>
                        <p><strong>Pickup Hub:</strong> {hubs.find(h => h.hubId === Number(selectedHub))?.hubName}</p>
                        <p><strong>Date:</strong> {dates.startDate} to {dates.endDate}</p>
                        <p><strong>Customer:</strong> {customer.firstName} {customer.lastName}</p>
                        <p><strong>Add-ons:</strong> {selectedAddOnIds.length > 0 ? selectedAddOnIds.length + ' selected' : 'None'}</p>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button className="btn btn-secondary" onClick={() => setStep(3)}>Back</button>
                        <button className="btn btn-success px-4" onClick={handleConfirmBooking}>Confirm & Pay</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
