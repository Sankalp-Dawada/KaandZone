import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/CreateRoom.css";
import { db } from "../services/firebase";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

function CreateRoom() {
    const [selectedGame, setSelectedGame] = useState("Raja Rani Chor Police");
    const [roomname, setRoomname] = useState("");
    const [numberOfPlayers, setNumberOfPlayers] = useState(1);
    const [selectedNumber, setSelectedNumber] = useState("1");
    const [visibility, setVisibility] = useState("public");

    // Generate unique room ID
    const generateRoomId = () => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `${timestamp}${randomStr}`.toUpperCase();
    };

    const handleRoomCreation = async () => {
        if (roomname.trim() === "") {
            alert("Please enter a valid room name.");
            return;
        }
        if (numberOfPlayers < 4) {
            alert("Number of players must be minimum 4.");
            return;
        }

        const username = localStorage.getItem("username");
        if (!username) {
            alert("User not logged in.");
            return;
        }

        const uniqueRoomId = generateRoomId();
        
        const roomData = {
            roomId: uniqueRoomId,
            roomname,
            gameType: selectedGame,
            numberOfPlayers,
            createdBy: username,
            selectedNumber,
            visibility,
            createdAt: new Date().toISOString(),
            PlayersName: [username], 
            Points: [0] 
        };

        try {
            
            await setDoc(doc(db, "rooms", uniqueRoomId), roomData);

            
            await updateDoc(doc(db, "users", username), {
                isHost: true,
                roomId: arrayUnion(uniqueRoomId),
                gameType: arrayUnion(selectedGame)
            });

            localStorage.setItem("roomname", uniqueRoomId);
            window.location.href = "/room";

        } catch (e) {
            console.error("Error creating room: ", e);
            alert("Error creating room: " + e);
        }
    };

    return (
        <>
            <Header />
            <div className="background-effects">
                <div className="grid-overlay"></div>
            </div>
            <div className="content-wrapper">
                <div className="create-room-column">
                    <header className="create-room-header">Create Room</header>
                    
                    <div className="create-room-row">
                        <label htmlFor="room-name">Room Name: </label>
                        <input
                            type="text"
                            id="room-name"
                            name="room-name"
                            value={roomname}
                            onChange={(e) => setRoomname(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="create-room-row">
                        <label htmlFor="Numberofplayers">Number of Players: </label>
                        <input
                            type="number"
                            id="Numberofplayers"
                            name="Numberofplayers"
                            value={numberOfPlayers}
                            onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
                            min="4"
                            max="20"
                            required 
                        />
                    </div>

                    <div className="create-room-row">
                        <label htmlFor="visibility">Room Visibility: </label>
                        <select
                            name="visibility"
                            id="visibility"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    
                    <div className="create-room-row">
                        <label htmlFor="game-name">Choose a Game Type: </label>
                        <select
                            name="game-name"
                            id="game-name"
                            value={selectedGame}
                            onChange={(e) => setSelectedGame(e.target.value)}
                        >
                            <option value="Raja Rani Chor Police">Raja Rani Chor Police</option>
                            <option value="Night Mafia">Night Mafia</option>
                            <option value="Guess Character">Guess the character</option>
                            <option value="Answer the question">Answer the Question</option>
                        </select>
                    </div>
                    
                    <div className="create-room-row">
                        {selectedGame === "Night Mafia" && (
                            <>
                                <label htmlFor="NumberofMafia">Number of Mafia: </label>
                                <select
                                    name="NumberofMafia"
                                    id="NumberofMafia"
                                    value={selectedNumber}
                                    onChange={(e) => setSelectedNumber(e.target.value)}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="random">Random</option>
                                </select>
                            </>
                        )}
                        {selectedGame === "Answer the question" && (
                            <>
                                <label htmlFor="NumberofImposters">Number of Imposters: </label>
                                <select
                                    name="NumberofImposters"
                                    id="NumberofImposters"
                                    value={selectedNumber}
                                    onChange={(e) => setSelectedNumber(e.target.value)}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="random">Random</option>
                                </select>
                            </>
                        )}
                    </div>

                    <div className="button-center">
                        <button className="create-room-button" onClick={handleRoomCreation}>
                            Create Room
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateRoom;