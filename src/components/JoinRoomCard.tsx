import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import '../styles/JoinRoomCard.css';

interface JoinRoomCardProps {
    roomId: string;
    roomName: string;
    gameType: string;
    numberOfPlayers: number;
    currentPlayers?: number;
    createdBy: string;
}

function JoinRoomCard({ roomId, roomName, gameType, numberOfPlayers, currentPlayers = 0, createdBy }: JoinRoomCardProps) {
    
    const handleJoinRoom = async () => {
        const username = localStorage.getItem("username");
        
        if (!username) {
            alert("Please login first to join a room.");
            window.location.href = "/user-login";
            return;
        }

        try {

            const roomRef = doc(db, "rooms", roomId);
            const roomSnap = await getDoc(roomRef);
            
            if (!roomSnap.exists()) {
                alert("Room not found or has been deleted.");
                return;
            }

            const roomData = roomSnap.data();
            const currentPlayersInRoom = roomData.PlayersName || [];
            
            
            if (currentPlayersInRoom.includes(username)) {
                localStorage.setItem("roomname", roomId);
                window.location.href = "/room";
                return;
            }


            if (currentPlayersInRoom.length >= numberOfPlayers) {
                alert("Room is full!");
                return;
            }


            await updateDoc(roomRef, {
                PlayersName: arrayUnion(username),
                Points: arrayUnion(0) 
            });

            const userRef = doc(db, "users", username);
            await updateDoc(userRef, {
                roomId: arrayUnion(roomId),
                gameType: arrayUnion(gameType)
            });

            localStorage.setItem("roomname", roomId);
            window.location.href = "/room";

        } catch (error) {
            console.error("Error joining room:", error);
            alert("Failed to join room. Please try again.");
        }
    };

    return (
        <div className="jr-container">
            <div className="jr-form">
                <div className="room-info">
                    <h3 className="room-name">{roomName}</h3>
                    <p className="room-details">
                        <strong>Game:</strong> {gameType}
                    </p>
                    <p className="room-details">
                        <strong>Players:</strong> {currentPlayers}/{numberOfPlayers}
                    </p>
                    <p className="room-details">
                        <strong>Host:</strong> {createdBy}
                    </p>
                    <p className="room-id">
                        <strong>Room ID:</strong> {roomId}
                    </p>
                </div>
                <button 
                    className="jr-button"
                    onClick={handleJoinRoom}
                    disabled={currentPlayers >= numberOfPlayers}
                >
                    {currentPlayers >= numberOfPlayers ? "Room Full" : "Join Room"}
                </button>
            </div>
        </div>
    );
}

export default JoinRoomCard;