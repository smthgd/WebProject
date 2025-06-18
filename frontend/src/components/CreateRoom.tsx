import React from 'react';
import { toast } from 'react-hot-toast';
import './Join/Join.css';
import { API_URL } from '../config';

interface CreateRoomProps {
    setRoomCode: (code: string) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ setRoomCode }) => {
    const createRoom = async () => {
        try{
            const response = await fetch(`${API_URL}/api/room/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const newRoomCode = await response.text();
        setRoomCode(newRoomCode); // Устанавливаем новый код комнаты
        toast.success('Room created successfully');
        }
        catch(error){
            console.log(error);
            toast.error('Network error while creating room');
        }

    };

    return (
        <button className="button" onClick={createRoom}>Create Room</button>
    );
};

export default CreateRoom;