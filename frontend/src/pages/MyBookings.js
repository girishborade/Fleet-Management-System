import React, { useEffect, useState } from 'react';
import ApiService from '../services/api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Shim: Fetch from localStorage since backend endpoint is missing for customer history
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
        <div className="container py-5">
            <h2 className="mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
                <div className="alert alert-info">You haven't made any bookings yet in this session.</div>
            ) : (
                <div className="table-responsive card p-3 shadow-sm border-0">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Booking ID</th>
                                <th>Car</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b, index) => (
                                <tr key={index}>
                                    <td>#{b.bookingId || 'PENDING'}</td>
                                    <td>{b.carName || 'Unknown Car'}</td>
                                    <td>
                                        <span className="badge bg-primary">Confirmed</span>
                                    </td>
                                    <td>{new Date().toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => handleDownloadInvoice(b.bookingId)}
                                            disabled={!b.bookingId} // Disable if no ID
                                        >
                                            <i className="bi bi-file-earmark-pdf me-1"></i> Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
