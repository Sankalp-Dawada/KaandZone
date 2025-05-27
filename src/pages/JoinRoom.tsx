import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import JoinRoomCard from "../components/JoinRoomCard";
import { db } from "../services/firebase";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "../styles/JoinRoom.css";

interface Room {
    id: string;
    roomname: string;
    gameType: string;
    numberOfPlayers: number;
    createdBy: string;
    createdAt: string;
    visibility: string;
    PlayersName?: string[];
    Points?: number[];
}

function JoinRoom() {
    const [POPSelect, setPOPSelect] = useState("Public");
    const [privateRoomId, setPrivateRoomId] = useState("");
    const [publicRooms, setPublicRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (POPSelect === "Public") {
            fetchPublicRooms();
        }
    }, [POPSelect]);

    const fetchPublicRooms = async () => {
        setLoading(true);
        try {
            const roomsQuery = query(
                collection(db, "rooms"),
                where("visibility", "in", ["public", "Public"])
            );

            const roomsSnapshot = await getDocs(roomsQuery);
            const rooms: Room[] = [];

            roomsSnapshot.forEach((doc) => {
                const roomData = doc.data();
                rooms.push({
                    id: doc.id,
                    roomname: roomData.roomname,
                    gameType: roomData.gameType,
                    numberOfPlayers: roomData.numberOfPlayers,
                    createdBy: roomData.createdBy,
                    createdAt: roomData.createdAt,
                    visibility: roomData.visibility || "public",
                    PlayersName: roomData.PlayersName || [],
                    Points: roomData.Points || []
                });
            });
            rooms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setPublicRooms(rooms);
        }
        catch (error) {
            console.error("Error fetching public rooms:", error);
            alert("Failed to fetch public rooms");
        }
        finally {
            setLoading(false);
        }
    };
    const handlePrivateRoomJoin = async () => {
        if (privateRoomId.trim() === "") {
            alert("Please enter a Room ID");
            return;
        }
        const username = localStorage.getItem("username");
        if (!username) {
            alert("Please login first to join a room.");
            window.location.href = "/user-login";
            return;
        }
        try {
            const roomRef = doc(db, "rooms", privateRoomId.trim());
            const roomSnap = await getDoc(roomRef);
            if (!roomSnap.exists()) {
                alert("Room not found. Please check the Room ID.");
                return;
            }
            const roomData = roomSnap.data();
            const currentPlayersInRoom = roomData.PlayersName || [];
            if (currentPlayersInRoom.includes(username)) {
                localStorage.setItem("roomname", privateRoomId.trim());
                window.location.href = "/room";
                return;
            }
            if (currentPlayersInRoom.length >= roomData.numberOfPlayers) {
                alert("Room is full!");
                return;
            }
            await updateDoc(roomRef, {
                PlayersName: arrayUnion(username),
                Points: arrayUnion(0)
            });
            const userRef = doc(db, "users", username);
            await updateDoc(userRef, {
                roomId: arrayUnion(privateRoomId.trim()),
                gameType: arrayUnion(roomData.gameType)
            });
            localStorage.setItem("roomname", privateRoomId.trim());
            window.location.href = "/room";
        } 
        catch (error) {
            console.error("Error joining private room:", error);
            alert("Failed to join room. Please try again.");
        }
    };

    return (
        <>
            <Header />
            <div className="background-effects">
                <div className="grid-overlay"></div>
            </div>
            <div className="content-wrapper">
                <div className="join-room-container">
                    <h1>Join Room</h1>

                    <div className="room-type-selector">
                        <label htmlFor="POP">Room Type:</label>
                        <select
                            name="PublicorPrivate"
                            id="POP"
                            value={POPSelect}
                            onChange={(e) => setPOPSelect(e.target.value)}
                        >
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                    </div>

                    {POPSelect === "Private" && (
                        <div className="private-room-section">
                            <h2>Join Private Room</h2>
                            <div className="private-room-input">
                                <label htmlFor="roomId">Room ID:</label>
                                <input
                                    type="text"
                                    id="roomId"
                                    placeholder="Enter Room ID"
                                    value={privateRoomId}
                                    onChange={(e) => setPrivateRoomId(e.target.value)}
                                />
                                <button
                                    className="join-private-btn"
                                    onClick={handlePrivateRoomJoin}
                                >
                                    Join Room
                                </button>
                            </div>
                        </div>
                    )}

                    {POPSelect === "Public" && (
                        <div className="public-rooms-section">
                            <div className="public-rooms-header">
                                <h2>Public Rooms</h2>
                                <button
                                    className="refresh-btn"
                                    onClick={fetchPublicRooms}
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Refresh"}
                                </button>
                            </div>

                            {loading ? (
                                <div className="loading">Loading public rooms...</div>
                            ) : publicRooms.length > 0 ? (
                                <div className="rooms-grid">
                                    {publicRooms.map((room) => (
                                        <JoinRoomCard
                                            key={room.id}
                                            roomId={room.id}
                                            roomName={room.roomname}
                                            gameType={room.gameType}
                                            numberOfPlayers={room.numberOfPlayers}
                                            currentPlayers={room.PlayersName?.length || 0}
                                            createdBy={room.createdBy}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="no-rooms">
                                    <p>No public rooms available at the moment.</p>
                                    <p>Create a new room or try refreshing!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default JoinRoom;