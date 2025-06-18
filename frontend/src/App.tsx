import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/Join/JoinRoom";
import MovieCard from "./components/MovieCard";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import UserMenu from "./components/UserMenu";
import "./App.css";
import logo from "./assets/ChoosyLogo.png";
import { API_URL, config } from "./config";

const App: React.FC = () => {
	const [roomCode, setRoomCode] = useState<string>("");
	const [likedMovies, setLikedMovies] = useState<any[]>([]);
	const [currentMovie, setCurrentMovie] = useState<any>(null);
	const [, setSocket] = useState<WebSocket | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [userName, setUserName] = useState<string | null>(null);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isStarted, setIsStarted] = useState(false);
	const [roomHistory, setRoomHistory] = useState<any>(null);
	const [isRoomHistoryVisible, setIsRoomHistoryVisible] = useState(false);

	const handleButtonClick = () => {
		setIsStarted(true);
	};

	const openRegisterModal = () => {
		setIsLoginOpen(false);
		setIsRegisterOpen(true);
	};

	const closeRegisterModal = () => {
		setIsRegisterOpen(false);
	};

	const openLoginModal = () => {
		setIsRegisterOpen(false);
		setIsLoginOpen(true);
	};

	const closeLoginModal = () => {
		setIsLoginOpen(false);
	};

	const handleLogout = () => {
		setUserId(null);
		setUserName(null);
	};

	const handleShowRoomHistory = () => {
		if (roomCode) {
			fetchRoomHistory(roomCode);
		}
	};

	const getNextMovie = async (roomCode: string, userId: string) => {
		try {
			const response = await fetch(
				`${API_URL}/api/room/${roomCode}/next-movie?userId=${userId}`,
			);
			if (response.ok) {
				const movieData = await response.json();
				setCurrentMovie(movieData); // Устанавливаем текущий фильм
			} else {
				toast.error("No more movies available");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error loading movie");
		}
	};

	const handleSwipe = async (direction: "left" | "right") => {
		if (currentMovie) {
			if (userId) {
				const response = await fetch(
					`${API_URL}/api/room/${roomCode}/watched-movies?userId=${userId}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(currentMovie.id),
					},
				);

				if (response.ok) {
					if (direction === "right") {
						setLikedMovies((prev) => {
							const updatedLikedMovies = [...prev, currentMovie];

							// Вызываем метод MatchChecking с likedMovies
							fetch(
								`${API_URL}/api/room/${roomCode}/match-checking?userId=${userId}`,
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify(currentMovie.id),
								},
							);

							return updatedLikedMovies;
						});
					}

					await getNextMovie(roomCode, userId); // Запрашиваем следующий фильм. Нужно поменять айдишник
				} else {
					toast.error("Error while swiping");
				}
			} else {
				toast.error("User ID is not available");
			}
		}
	};

	const fetchRoomHistory = async (roomCode: string) => {
		try {
			const response = await fetch(
				`${API_URL}/api/room/${roomCode}/history`,
			);
			if (response.ok) {
				const data = await response.json();
				setRoomHistory(data);
				setIsRoomHistoryVisible(true);
			} else {
				toast.error("Error fetching room history");
			}
		} catch (error) {
			console.error("Error fetching room history:", error);
			toast.error("Error fetching room history");
		}
	};

	useEffect(() => {
		// Подключение к WebSocket
		const newSocket = new WebSocket(
			`ws://${config.apiUrl.split("://")[1]}/ws`,
		);

		newSocket.onmessage = (event) => {
			const message = event.data;
			if (typeof message === "string" && message.startsWith("userId:")) {
				const id = message.split(": ")[1];
				setUserId(id);
			} else {
				toast(message);
			}
		};

		newSocket.onclose = () => {
			console.log("WebSocket connection closed");
		};

		setSocket(newSocket);

		// Очистка при размонтировании компонента
		return () => {
			newSocket.close();
		};
	}, []);

	return (
		<>
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 4000,
					style: {
						background: "#363636",
						color: "#fff",
					},
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
			<header className="app-header">
				<h1 className="app-title">Choosy</h1>
				<div className="header-buttons">
					{userName ? (
						<UserMenu
							userName={userName}
							onLogout={handleLogout}
							roomCode={"47534720"!}
							onShowRoomHistory={handleShowRoomHistory}
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
			<div>
				<img src={logo} alt="Logo" className="logo" />
				{!isStarted && (
					<>
						<div className="blur-background">
							<p>
								We're giving you time. The time you can spend
								not choosing a movie, but watching it. Just
								connect with a friend, partner, or family member
								and start swiping through suggested movies. As
								soon as the "match" happens, you will get your
								perfect movie for a great evening!
							</p>
						</div>

						<button
							className="register-button"
							onClick={handleButtonClick}
						>
							Get started
						</button>
					</>
				)}

				{isStarted && (
					<>
						<JoinRoom
							roomCode={roomCode}
							setRoomCode={setRoomCode}
							userId={userId}
							CreateRoomComponent={CreateRoom}
							setCurrentMovie={setCurrentMovie}
						/>

						{currentMovie ? (
							<MovieCard
								movie={currentMovie}
								onSwipe={(direction) => handleSwipe(direction)}
							/>
						) : (
							<p></p> // TODO: заменить на чтение состояния
						)}
						<p>Your ID: {userId}</p>

						{console.log(roomHistory)}

						{isRoomHistoryVisible && roomHistory && (
							<div>
								<h3>Room History</h3>
								<p>Room ID: {roomHistory.roomCode}</p>
								<p>Creation Date: {roomHistory.creationDate}</p>
								<h4>Users:</h4>
								<ul>
									{roomHistory.users.map((user: any) => (
										<li key={user.id}>{user.username}</li>
									))}
								</ul>
								<h4>Matched Films:</h4>
								<ul>
									{roomHistory.matchedFilms.map(
										(film: any) => (
											<li key={film.id}>{film.title}</li>
										),
									)}
								</ul>
							</div>
						)}
					</>
				)}

				{likedMovies.length > 0 && (
					<div>
						<h2>Liked Movies</h2>
						<ul>
							{likedMovies.map((movie) => (
								<li key={movie.id}>{movie.name}</li>
							))}
						</ul>
					</div>
				)}

				{isRegisterOpen && (
					<Register onClose={() => closeRegisterModal()} />
				)}
				{isLoginOpen && (
					<Login
						onClose={closeLoginModal}
						setUserName={setUserName}
					/>
				)}
			</div>
		</>
	);
};

export default App;
