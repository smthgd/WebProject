import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import './Register.css';
import { API_URL } from '../../config';

interface RegisterProps {
    onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async () => {
        try{
            const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
            });

            if (response.ok) {
                toast.success('User registered successfully');
                onClose();
            } else {
                toast.error('Registration failed');
            }
        }
        catch (error){
            console.log("Request failed:", error);
            toast.error('Network error during registration');
        }

    };

    return (
        <>
            <div className="modal-overlay" onClick={() => onClose()}></div>
            <div className="modal">
                <h2>Register</h2>
                <hr className="divider" /> 
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="email"
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
                    <button onClick={handleRegister}>Register</button>
                </div>
            </div>
        </>
    );
};

export default Register;
