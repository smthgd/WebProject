export const API_URL = process.env.VITE_API_URL || "http://localhost:5065";

export const config = {
	apiUrl: API_URL,
} as const;
