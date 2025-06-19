import { useState } from "react";
import { createRoom } from "../actions/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import "./CreateRoom.css";

const CreateRoom: React.FC = () => {
	const [roomCode, setRoomCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleRoomCreation = async () => {
		setIsLoading(true);
		const roomCode = await createRoom();
		if (roomCode) setRoomCode(roomCode);
		else toast.error("Failed to create a room");
		setIsLoading(false);
	};

	return (
		<div
			style={{
				opacity: isLoading && 0.5,
			}}
		>
			<input
				disabled={isLoading}
				type="text"
				value={roomCode}
				onChange={(e) => setRoomCode(e.target.value)}
				placeholder="Enter room code"
				className="room-code__input"
			/>
			<div className="join-container">
				<button
					className="button"
					onClick={() => {
						navigate(`/room/${roomCode}`);
					}}
					disabled={isLoading}
				>
					Join Room
				</button>
				<button
					className="button"
					onClick={handleRoomCreation}
					disabled={isLoading}
				>
					Create Room
				</button>
			</div>
		</div>
	);
};

export default CreateRoom;
