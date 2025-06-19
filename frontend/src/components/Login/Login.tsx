import React, { useState } from "react";
import { signIn } from "../../actions/api";
import { useStore } from "../../store/useStore";

interface LoginProps {
	onClose: () => void;
	setUserName: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
	const { setUserName } = useStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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
					<button
						onClick={async () => {
							const data = await signIn(email, password);
							setUserName(data.userName);
							onClose();
						}}
					>
						Login
					</button>
				</div>
			</div>
		</>
	);
};

export default Login;
