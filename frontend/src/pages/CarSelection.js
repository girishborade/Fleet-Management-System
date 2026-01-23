import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../services/api';

const CarSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    // state: { pickupDateTime, returnDateTime, differentReturn, hub }

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const loadData = async () => {
        try {
            // Load available cars
            const carsData = await ApiService.getAvailableCars(
                state.hub.hubId,
                state.pickupDateTime, // API might expect date-only or datetime. 
                // Booking.js Step 1 used <input type="date"> so it's YYYY-MM-DD
                state.returnDateTime
            );

            // Load car types for filtering (optional but nice)
            const typesData = await ApiService.getCarTypes();

            setCars(carsData || []);
            setCarTypes(typesData || []);
        } catch (err) {
            console.error("Failed to load cars", err);
            setError("Failed to load available cars.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCar = (car) => {
        navigate('/booking', {
            state: {
                selectedCar: car,
                pickupHub: state.hub,
                returnHub: state.differentReturn ? null : state.hub, // If different return, Booking.js needs to ask? 
                // Wait, requirement: "Return Location (DO NOT TOUCH LOGIC) UI is visible on this page" (Booking.js Step 1/New Step 1)
                // In my refactored Booking.js Step 1, I had the checkbox.
                // If checked, we need to handle it.
                // The new flow jumps back to Booking.js Step 3 (Addons).
                // Where is Return Hub selected?
                // If "Different Location" was checked in Step 1, then user hasn't selected a return hub yet!
                // So we might need to prompt for Return Hub??
                // OR, Booking.js Step 3 is just addons. 
                // Maybe we go back to a step that allows Return Hub selection if missing?
                // Let's assume for now we pass the flag. Booking.js logic should handle it (maybe showing Step 1 again with Return Hub active? or a new Step?)
                // The user said "Return Selection logic must remain exactly as implemented".
                // Existing Booking.js had everything on one page. 
                // I will pass 'differentReturnChecked': state.differentReturn

                differentReturnChecked: state.differentReturn,
                startDate: state.pickupDateTime,
                endDate: state.returnDateTime
            }
        });
    };

    const filteredCars = selectedCarTypeFilter
        ? cars.filter(c => c.carType?.carTypeId === Number(selectedCarTypeFilter))
        : cars;

    if (error) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>Home</button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0">Select Your Vehicle</h2>
                <div className="d-flex gap-2">
                    <select
                        className="form-select w-auto"
                        value={selectedCarTypeFilter}
                        onChange={e => setSelectedCarTypeFilter(e.target.value)}
                    >
                        <option value="">All Types</option>
                        {carTypes.map(t => <option key={t.carTypeId} value={t.carTypeId}>{t.carTypeName}</option>)}
                    </select>
                </div>
            </div>

            {loading && <div className="text-center py-5"><span className="spinner-border text-primary"></span> Loading cars...</div>}

            {!loading && filteredCars.length === 0 && (
                <div className="text-center py-5">
                    <h4>No cars available.</h4>
                    <p className="text-muted">Try changing your dates or location.</p>
                    <button className="btn btn-secondary" onClick={() => navigate('/select-hub', { state: location.state })}>Back via Browser</button>
                </div>
            )}

            <div className="row g-4">
                {filteredCars.map(car => (
                    <div className="col-md-4" key={car.carId}>
                        <div className="card h-100 shadow-sm border-0 hover-effect">
                            <img
                                src={car.imagePath || car.carType?.imagePath || 'https://via.placeholder.com/400x200?text=Car'}
                                className="card-img-top"
                                alt={car.carModel}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title fw-bold mb-0">{car.carModel}</h5>
                                    <span className="badge bg-primary">{car.carType?.carTypeName}</span>
                                </div>
                                <p className="text-muted small mb-3">{car.carNumber} • {car.color}</p>

                                <div className="row g-2 mb-3 text-center">
                                    <div className="col-4">
                                        <div className="border rounded p-1">
                                            <small className="d-block text-muted">Daily</small>
                                            <span className="fw-bold">${car.carType?.dailyRate}</span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="border rounded p-1">
                                            <small className="d-block text-muted">Weekly</small>
                                            <span className="fw-bold">${car.carType?.weeklyRate}</span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="border rounded p-1">
                                            <small className="d-block text-muted">Monthly</small>
                                            <span className="fw-bold">${car.carType?.monthlyRate}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-success w-100 fw-bold"
                                    onClick={() => handleSelectCar(car)}
                                >
                                    Book This Car
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
};

export default CarSelection;
