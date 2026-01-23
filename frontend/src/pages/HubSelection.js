import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../services/api';

const HubSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    // State from previous step
    // state: { pickupDateTime, returnDateTime, differentReturn, locationData, searchType }

    const [hubs, setHubs] = useState([]);
    const [selectedHub, setSelectedHub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!state || !state.locationData) {
            setError("No location data provided. Please start from the booking page.");
            setLoading(false);
            return;
        }

        // CASE 1: Airport flow (already have hubs in locationData)
        if (Array.isArray(state.locationData)) {
            setHubs(state.locationData);
            setLoading(false);
            return;
        }

        // CASE 2: State + City flow (need to fetch)
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
            console.error("Hub fetch error:", err);
            setError("Failed to fetch hubs for the selected city.");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (!selectedHub) {
            alert("Please select a pick-up location");
            return;
        }

        navigate("/select-car", {
            state: {
                pickupDateTime: state.pickupDateTime,
                returnDateTime: state.returnDateTime,
                differentReturn: state.differentReturn,
                hub: selectedHub
            }
        });
    };

    if (error) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-secondary" onClick={() => navigate('/booking')}>Back to Search</button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center fw-bold">Select Pick-Up Location</h2>

            <div className="card glass-card p-4 mx-auto" style={{ maxWidth: '800px' }}>
                {loading && <div className="text-center"><span className="spinner-border text-primary"></span> Loading locations...</div>}

                {!loading && hubs.length === 0 && (
                    <div className="text-center">
                        <p className="lead">No hubs found for your search.</p>
                        <button className="btn btn-secondary" onClick={() => navigate('/booking')}>Try Different Location</button>
                    </div>
                )}

                {!loading && hubs.length > 0 && (
                    <div className="list-group mb-4">
                        {hubs.map(hub => (
                            <label key={hub.hubId} className={`list-group-item list-group-item-action d-flex gap-3 align-items-center ${selectedHub?.hubId === hub.hubId ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
                                <input
                                    className="form-check-input flex-shrink-0"
                                    type="radio"
                                    name="hub"
                                    checked={selectedHub?.hubId === hub.hubId}
                                    onChange={() => setSelectedHub(hub)}
                                />
                                <div className="d-flex w-100 justify-content-between">
                                    <div>
                                        <h5 className="mb-1 fw-bold">{hub.hubName}</h5>
                                        <p className="mb-1 opacity-75">{hub.hubAddress}</p>
                                        <small>{hub.cityName}, {hub.stateName}</small>
                                    </div>
                                    <div className="text-end">
                                        <div className="badge bg-light text-dark mb-2">
                                            <i className="bi bi-telephone-fill"></i> {hub.contactNumber}
                                        </div>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                )}

                <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-secondary" onClick={() => navigate('/booking')}>Back</button>
                    <button className="btn btn-primary px-5" onClick={handleContinue} disabled={!selectedHub}>Continue</button>
                </div>
            </div>
        </div>
    );
};

export default HubSelection;
