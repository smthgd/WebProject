import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { Toaster, toast } from "react-hot-toast";
import { useStore } from "./store/useStore";
import HomePage from "./pages/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import "./App.css";
import Header from "./components/Header";
import { API_URL } from "./config";
import CreateRoom from "./pages/CreateRoom";
import Room from "./pages/Room";

const App: React.FC = () => {
	const {
		userId,
		setUserId,
		isRegisterOpen,
		closeRegisterModal,
		isLoginOpen,
		closeLoginModal,
		setUserName,
		setUserIsLoaded,
	} = useStore();

	useEffect(() => {
		const newSocket = new WebSocket(`ws://${API_URL.split("://")[1]}/ws`);

		newSocket.onmessage = (event) => {
			const message = event.data;
			if (typeof message === "string" && message.startsWith("userId:")) {
				const id = message.split(": ")[1];
				setUserId(id);
				setUserIsLoaded(true);
			} else {
				toast(message);
			}
		};

		newSocket.onclose = () => console.log("WebSocket connection closed");

		return () => newSocket.close();
	}, [setUserId]);

	return (
		<>
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 4000,
					style: { background: "#363636", color: "#fff" },
					success: {
						duration: 3000,
						iconTheme: {
							primary: "#4ade80",
							secondary: "#fff",
						},
					},
					error: {
						duration: 4000,
						iconTheme: {
							primary: "#ef4444",
							secondary: "#fff",
						},
					},
				}}
			/>
			<Header />
			<main>
				<div className="container">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/room/new" element={<CreateRoom />} />
						<Route path="/room/:roomCode" element={<Room />} />
					</Routes>
				</div>
				{isRegisterOpen && <Register onClose={closeRegisterModal} />}
				{isLoginOpen && (
					<Login
						onClose={closeLoginModal}
						setUserName={setUserName}
					/>
				)}
			</main>
			<p>Your ID: {userId}</p>
		</>
	);
};

export default App;
