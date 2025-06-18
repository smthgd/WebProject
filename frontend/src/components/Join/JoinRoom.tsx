import React from 'react';
import { toast } from 'react-hot-toast';
import './Join.css';
import { API_URL } from '../../config';

interface JoinRoomProps {
    roomCode: string;
    setRoomCode: (code: string) => void;
    userId: string | null;
    CreateRoomComponent: React.FC<{ setRoomCode: (code: string) => void }>;
    setCurrentMovie: (movie: any[]) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ roomCode, setRoomCode, userId, CreateRoomComponent, setCurrentMovie }) => {
    const joinRoom = async () => {
        if (!roomCode) {
            toast.error('Please enter a room code');
            return;
        }
        try{
            const response = await fetch(`${API_URL}/api/room/join/${roomCode}/${userId}`, {
                method: 'POST',
            });

            if (response.ok) {
                console.log('Successfully joined room:', roomCode);
                await getMovies(roomCode);
                if (userId) {
                    await getNextMovie(roomCode, userId);
                } else {
                    toast.error('User ID is not available');
                }
            } else {
                toast.error('Room not found');
            }
        }
        catch(error){
            console.log(error);
            toast.error('Network error while joining room');
        }
        
    };

    const getMovies = async (code: string) => {
        try {
            const response = await fetch(`${API_URL}/api/room/${code}/movies`);
            if (response.ok) {
                const moviesData = await response.json();
                console.log('Movies loaded:', moviesData);
                if (moviesData.length > 0) {
                    setCurrentMovie(moviesData[0]); // Устанавливаем первый фильм как текущий
                }
            } else {
                toast.error('Failed to load movies');
            }
        } catch (error) {
            console.log(error);
            toast.error('Network error while loading movies');
        }
    };

    const getNextMovie = async (code: string, userId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/room/${code}/next-movie?userId=${userId}`);
            if (response.ok) {
                const movieData = await response.json();
                // Здесь можно передать movieData в родительский компонент или сохранить в локальном состоянии
            } else {
                toast.error('No more movies available');
            }
        } catch (error) {
            console.log(error);
            toast.error('Network error while loading next movie');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                className="input"
            />
            <div className="join-container">
                <button className="button" onClick={joinRoom}>Join Room</button>
                <CreateRoomComponent setRoomCode={setRoomCode} /> {/* Используем переданный компонент */}
            </div>
        </div>
    );
};

export default JoinRoom;