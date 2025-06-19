import { create } from "zustand";

interface StoreState {
	userIsLoaded: boolean;
	setUserIsLoaded: (userIsLoaded: boolean) => void;
	roomCode: string;
	setRoomCode: (roomCode: string) => void;
	likedMovies: any[];
	addLikedMovie: (movie: any) => void;
	currentMovie: any;
	setCurrentMovie: (movie: any) => void;
	userId: string | null;
	setUserId: (userId: string | null) => void;
	userName: string | null;
	setUserName: (userName: string | null) => void;
	isRegisterOpen: boolean;
	openRegisterModal: () => void;
	closeRegisterModal: () => void;
	isLoginOpen: boolean;
	openLoginModal: () => void;
	closeLoginModal: () => void;
	isStarted: boolean;
	setIsStarted: (isStarted: boolean) => void;
	roomHistory: any;
	setRoomHistory: (history: any) => void;
	isRoomHistoryVisible: boolean;
	setIsRoomHistoryVisible: (isVisible: boolean) => void;
	handleLogout: () => void;
}

export const useStore = create<StoreState>((set) => ({
	roomCode: "",
	userIsLoaded: false,
	setUserIsLoaded: (userIsLoaded) => set({ userIsLoaded }),
	setRoomCode: (roomCode) => set({ roomCode }),
	likedMovies: [],
	addLikedMovie: (movie) =>
		set((state) => ({ likedMovies: [...state.likedMovies, movie] })),
	currentMovie: null,
	setCurrentMovie: (movie) => set({ currentMovie: movie }),
	userId: null,
	setUserId: (userId) => set({ userId }),
	userName: null,
	setUserName: (userName) => set({ userName }),
	isRegisterOpen: false,
	openRegisterModal: () => set({ isRegisterOpen: true, isLoginOpen: false }),
	closeRegisterModal: () => set({ isRegisterOpen: false }),
	isLoginOpen: false,
	openLoginModal: () => set({ isLoginOpen: true, isRegisterOpen: false }),
	closeLoginModal: () => set({ isLoginOpen: false }),
	isStarted: false,
	setIsStarted: (isStarted) => set({ isStarted }),
	roomHistory: null,
	setRoomHistory: (history) => set({ roomHistory: history }),
	isRoomHistoryVisible: false,
	setIsRoomHistoryVisible: (isVisible) =>
		set({ isRoomHistoryVisible: isVisible }),
	handleLogout: () => {
		set({ userId: null, userName: null });
	},
}));
