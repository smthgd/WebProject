import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useStore } from "../store/useStore";
import MoviePicker from "../components/MovieCard";
import { getMovies } from "../actions/api";
import toast from "react-hot-toast";

const CreateRoom: React.FC = () => {
	const { roomCode: roomCodeParam } = useParams<{ roomCode: string }>();
	const { userId, setRoomCode, setCurrentMovie, roomHistory, userIsLoaded } =
		useStore();
	const [isRoomHistoryVisible] = useState(false);

	const [isLoading, setIsLoading] = useState(true);

	const handleRoomJoin = async (roomCode: string) => {
		if (userIsLoaded)
			if (userId) {
				const movies = await getMovies(roomCode);
				if (movies.length > 0) setCurrentMovie(movies[0]);
				setRoomCode(roomCode);
				setIsLoading(false);
			} else {
				toast.error("User ID is not available");
			}
	};

	useEffect(() => {
		if (roomCodeParam && roomCodeParam !== "new") {
			handleRoomJoin(roomCodeParam);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, roomCodeParam, setRoomCode]);

	return isLoading ? (
		<div>Loading</div>
	) : (
		<div className="room-container">
			<MoviePicker />

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
						{roomHistory.matchedFilms.map((film: any) => (
							<li key={film.id}>{film.title}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default CreateRoom;
