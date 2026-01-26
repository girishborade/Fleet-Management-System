import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import CarSelection from './pages/CarSelection';
import HubSelection from './pages/HubSelection';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden font-sans">
        <Navbar />
        <main className="pt-20 pb-12">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/select-car" element={<CarSelection />} />
              <Route path="/select-hub" element={<HubSelection />} />
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/handover" element={<StaffDashboard />} />
              <Route path="/staff/return" element={<StaffDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
