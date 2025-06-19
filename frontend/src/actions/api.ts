import toast from "react-hot-toast";
import { API_URL } from "../config";

export const joinRoom = async (roomCode: string, userId: string | null) => {
	if (!roomCode) {
		toast.error("Please enter a room code");
		return;
	}
	try {
		const response = await fetch(
			`${API_URL}/api/room/join/${roomCode}/${userId}`,
			{
				method: "POST",
			},
		);

		if (response.ok) {
			console.log("Successfully joined room:", roomCode);
		} else {
			toast.error("Room not found");
		}
	} catch (error) {
		console.log(error);
		toast.error("Network error while joining room");
	}
};

export const getMovies = async (code: string) => {
	try {
		const response = await fetch(`${API_URL}/api/room/${code}/movies`);
		if (response.ok) {
			return await response.json();
		} else {
			toast.error("Failed to load movies");
		}
	} catch (error) {
		console.log(error);
		toast.error("Network error while loading movies");
	}
};

export const getNextMovie = async (roomCode: string, userId: string) => {
	try {
		const response = await fetch(
			`${API_URL}/api/room/${roomCode}/next-movie?userId=${userId}`,
		);
		if (response.ok) {
			const movieData = await response.json();
			return movieData;
		} else {
			toast.error("No more movies available");
		}
	} catch (error) {
		console.log(error);
		toast.error("Error loading movie");
	}
};

export const createRoom = async () => {
	try {
		const response = await fetch(`${API_URL}/api/room/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return await response.text();
	} catch (error) {
		console.log(error);
	}
};

export const fetchRoomHistory = async (roomCode: string) => {
	try {
		const response = await fetch(`${API_URL}/api/room/${roomCode}/history`);
		if (response.ok) {
			return await response.json();
		} else {
			toast.error("Error fetching room history");
		}
	} catch (error) {
		console.error("Error fetching room history:", error);
		toast.error("Error fetching room history");
	}
};

export const signUp = async (
	username: string,
	password: string,
	email: string,
) => {
	try {
		const response = await fetch(`${API_URL}/api/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password, email }),
		});

		if (response.ok) {
			toast.success("User registered successfully");
		} else {
			toast.error("Registration failed");
		}
	} catch (error) {
		console.log("Request failed:", error);
		toast.error("Network error during registration");
	}
};

export const signIn = async (email: string, password: string) => {
	try {
		const response = await fetch(`${API_URL}/api/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		if (response.ok) {
			return await response.json();
			// toast.success("User logged in successfully");
		} else {
			const errorData = await response.json();
			toast.error(
				`Login failed: ${errorData.message || response.statusText}`,
			);
		}
	} catch (error) {
		console.log(`Request failed: ${error}`);
		toast.error("Network error during login");
	}
};
