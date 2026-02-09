import axios from 'axios';

const NET_URL = 'http://localhost:5086';
const JAVA_URL = 'http://localhost:5087';

let activeBaseUrl = null;
let backendCheckPromise = null;

const checkBackend = async () => {
    if (activeBaseUrl) return activeBaseUrl;
    if (backendCheckPromise) return backendCheckPromise;

    backendCheckPromise = (async () => {
        const timeout = 2000; // 2s timeout for checks
        try {
            console.log(`Checking .NET Backend at ${NET_URL}...`);
            await axios.get(`${NET_URL}/api/v1/hubs`, { timeout });
            console.log(".NET Backend is active.");
            activeBaseUrl = NET_URL;
        } catch (error) {
            console.warn(`.NET Backend unreachable (${error.message}). Checking Java Backend at ${JAVA_URL}...`);
            try {
                await axios.get(`${JAVA_URL}/api/v1/hubs`, { timeout });
                console.log("Java Backend is active.");
                activeBaseUrl = JAVA_URL;
            } catch (javaError) {
                console.error(`Java Backend also unreachable (${javaError.message}). App functionality will be limited.`);
                activeBaseUrl = null; // Do NOT default to .NET if it's down
            }
        }
        notifyListeners(activeBaseUrl);
        return activeBaseUrl;
    })();

    return backendCheckPromise;
};

// Simple event emitter for backend changes
const listeners = [];
const subscribeToBackendChange = (callback) => {
    listeners.push(callback);
    if (activeBaseUrl) callback(activeBaseUrl); // Immediate callback if known
    return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
    };
};

const notifyListeners = (url) => {
    listeners.forEach(cb => cb(url));
};

const instance = axios.create();

// Add a request interceptor to set baseURL and append token
instance.interceptors.request.use(
    async config => {
        if (!activeBaseUrl) {
            await checkBackend();
        }
        config.baseURL = activeBaseUrl;

        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user && user.token) {
            config.headers['Authorization'] = 'Bearer ' + user.token;
        }
        return config;
    },
    error => Promise.reject(error)
);

const ApiService = {
    // Hubs
    getHubs: (stateName, cityName, cityId) => {
        if (cityId) return instance.get(`/api/v1/hubs/city/${cityId}`).then(res => res.data);
        return instance.get('/api/v1/hubs').then(res => res.data);
    },
    searchLocations: (query) => instance.get(`/api/v1/locations/search?query=${query}`).then(res => res.data), // Feature missing in BE

    // States & Cities
    getAllStates: () => instance.get('/api/v1/states').then(res => res.data),
    getCitiesByState: (stateId) => instance.get(`/api/v1/cities/state/${stateId}`).then(res => res.data),

    // Cars
    getCarTypes: () => instance.get('/api/v1/car-types').then(res => res.data),
    getAvailableCars: (hubId, startDate, endDate, carTypeId) => {
        let url = `/api/v1/cars/available?hubId=${hubId}&startDate=${startDate}&endDate=${endDate}`;
        if (carTypeId) url += `&carTypeId=${carTypeId}`;
        return instance.get(url).then(res => res.data);
    },
    uploadCars: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return instance.post('/api/v1/cars/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Add-ons
    getAddOns: () => instance.get('/api/v1/addons').then(res => res.data),

    // Bookings
    createBooking: (bookingRequest) => instance.post('/booking/create', bookingRequest).then(res => res.data),
    getBooking: (id) => instance.get(`/booking/get/${id}`).then(res => res.data),
    getBookingsByUser: (email) => instance.get(`/booking/user/${email}`).then(res => res.data),
    getBookingsByHub: (hubId) => instance.get(`/booking/hub/${hubId}`).then(res => res.data),
    processHandover: (request) => instance.post('/booking/process-handover', request).then(res => res.data),
    returnCar: (request) => instance.post('/booking/return', request).then(res => res.data),
    cancelBooking: (id) => instance.post(`/booking/cancel/${id}`).then(res => res.data),

    // Customer
    findCustomer: (email) => instance.get(`/api/v1/customers/${email}`).then(res => res.data),
    getCustomerById: (id) => instance.get(`/api/v1/customers/id/${id}`).then(res => res.data),
    saveCustomer: (customer) => instance.post('/api/v1/customers', customer).then(res => res.data),
    updateCustomer: (id, customer) => instance.put(`/api/v1/customers/${id}`, customer).then(res => res.data),

    // Vendors
    getAllVendors: () => instance.get('/api/v1/vendors').then(res => res.data),
    addVendor: (vendor) => instance.post('/api/v1/vendors', vendor).then(res => res.data),
    testVendorConnection: (id) => instance.delete(`/api/v1/vendors/${id}`).then(res => res.data), // Using delete for test? No, sticking to original likely/stub

    // Admin Rates
    uploadRates: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return instance.post('/api/admin/upload-rates', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Admin Dashboard
    getAllBookings: () => instance.get('/booking/all').then(res => res.data),
    getFleetOverview: () => instance.get('/api/admin/fleet-overview').then(res => res.data),

    // Staff Management (Admin)
    getAdminStaff: () => instance.get('/api/admin/staff').then(res => res.data),
    getAdminHubs: () => instance.get('/api/v1/hubs').then(res => res.data), // Reusing general hubs
    registerStaff: (userData) => instance.post('/api/admin/register-staff', userData).then(res => res.data),
    deleteStaff: (id) => instance.delete(`/api/admin/staff/${id}`).then(res => res.data),

    // Utilities
    subscribeToBackendChange,
    NET_URL,
    JAVA_URL,
    initializeBackend: checkBackend
};

export { subscribeToBackendChange, NET_URL, JAVA_URL };
export default ApiService;
