export const API_URL =
	process.env.VITE_API_URL ||
	"http://choosy-backend-8bmcbw-368642-77-110-105-3.traefik.me";

export const config = {
	apiUrl: API_URL,
} as const;
