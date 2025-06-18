import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';

interface LoginProps {
    onClose: () => void;
    setUserName: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onClose, setUserName }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('User logged in successfully');
                setUserName(data.userName);
                onClose();
            } else {
                const errorData = await response.json();
                toast.error(`Login failed: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.log(`Request failed: ${error}`);
            toast.error('Network error during login');
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={() => onClose()}></div>
            <div className="modal">
                <h2>Login</h2>
                <hr className="divider" />
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <hr className="divider" />
                <div className="button-container">
                    <button onClick={onClose}>Close</button>
                    <button onClick={handleLogin}>Login</button> 
                </div>
            </div>
        </>
    );
};

export default Login;
