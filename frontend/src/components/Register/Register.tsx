import React, { useState } from "react";
import "./Register.css";
import { signUp } from "../../actions/api";

interface RegisterProps {
	onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");

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
					<button
						onClick={async () => {
							await signUp(username, password, email);
							onClose();
						}}
					>
						Register
					</button>
				</div>
			</div>
		</>
	);
};

export default Register;
