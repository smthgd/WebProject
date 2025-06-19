import React from "react";
import "./Header.css";
import UserMenu from "./UserMenu";
import { useStore } from "../store/useStore";
import { Link } from "react-router";
import { fetchRoomHistory } from "../actions/api";
import logo from "../assets/ChoosyLogo.png";

const Header: React.FC = () => {
	const {
		userName,
		handleLogout,
		roomCode,
		setRoomHistory,
		openLoginModal,
		openRegisterModal,
		setIsRoomHistoryVisible,
	} = useStore();

	const handleRoomHistoryShow = async () => {
		setRoomHistory(await fetchRoomHistory(roomCode));
		setIsRoomHistoryVisible(true);
	};

	return (
		<header className="app-header">
			<Link to="/">
				<img src={logo} alt="Logo" className="logo" />
			</Link>
			<div className="header-buttons">
				{userName ? (
					<UserMenu
						userName={userName}
						onLogout={handleLogout}
						roomCode={roomCode}
						onShowRoomHistory={handleRoomHistoryShow}
					/>
				) : (
					<>
						<button
							className="login-button"
							onClick={openLoginModal}
						>
							Log in
						</button>
						<button
							className="register-button"
							onClick={openRegisterModal}
						>
							Sign up
						</button>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;
