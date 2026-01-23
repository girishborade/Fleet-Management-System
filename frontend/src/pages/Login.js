import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    // ... [existing state] ...
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        // ... [existing login logic] ...
        e.preventDefault();
        try {
            await AuthService.login(username, password);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await AuthService.googleLogin(credentialResponse.credential);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Google Login Failed');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Login</div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleLogin}>
                                {/* ... [existing form fields] ... */}
                                <div className="mb-3">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
                            </form>

                            <div className="d-flex justify-content-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        setError('Google Login Failed');
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
