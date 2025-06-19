import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { API_URL } from "../config";
import { getNextMovie } from "../actions/api";
import toast from "react-hot-toast";

const MoviePicker: React.FC = () => {
	const {
		currentMovie,
		likedMovies,
		roomCode,
		userId,
		setCurrentMovie,
		addLikedMovie,
	} = useStore();

	const [isLoading, setIsLoading] = useState(false);

	const handleSwipe = async (direction: "left" | "right") => {
		setIsLoading(true);
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
						await fetch(
							`${API_URL}/api/room/${roomCode}/match-checking?userId=${userId}`,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(currentMovie.id),
							},
						);
						addLikedMovie(currentMovie);
					}

					setCurrentMovie(await getNextMovie(roomCode, userId)); // Запрашиваем следующий фильм. Нужно поменять айдишник
				} else {
					toast.error("Error while swiping");
				}
			} else {
				toast.error("User ID is not available");
			}
		}
		setIsLoading(false);
	};

	if (!currentMovie) return <div>No more movies available</div>;

	return (
		<div className="movie-picker-container">
			<h4
				style={{
					fontSize: "18px",
					alignSelf: "start",
					padding: "10px",
					borderRadius: "10px",
					background: "#222",
				}}
			>
				RoomCode {roomCode}
			</h4>
			<div className="movie">
				<img
					className="movie__poster"
					style={{
						opacity: isLoading && 0.5,
					}}
					src={currentMovie.posterUrl}
					alt={currentMovie.name}
				/>
				<div
					style={{
						opacity: isLoading && 0.5,
					}}
					className="movie__description"
				>
					<h2 className="movie__title">{currentMovie.name}</h2>
					<h4 className="movie__rating">{currentMovie.rating}</h4>
					<div className="movie__description_buttons">
						<button
							onClick={() => handleSwipe("left")}
							disabled={isLoading}
						>
							👎 Dislike
						</button>
						<button
							onClick={() => handleSwipe("right")}
							disabled={isLoading}
						>
							❤️ Like
						</button>
					</div>
				</div>
			</div>
			{likedMovies.length > 0 && (
				<div className="liked-movies-list">
					<h3>Liked Movies</h3>
					<ul>
						{likedMovies.map((movie) => (
							<li key={movie.id}>{movie.name}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default MoviePicker;
