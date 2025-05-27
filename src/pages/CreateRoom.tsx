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

        const roomData = {
            roomname,
            gameType: selectedGame,
            numberOfPlayers,
            createdBy: username,
            selectedNumber,
            createdAt: new Date().toISOString(),
        };

        try {
            // Save room info
            await setDoc(doc(db, "rooms", roomname), roomData);

            // Update user with host info
            await updateDoc(doc(db, "users", username), {
                isHost: true,
                roomId: arrayUnion(roomname),
                gameType: arrayUnion(selectedGame)
            });

            localStorage.setItem("roomname", roomname);
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
                {/* <div className="glow-orb glow-orb-1"></div>
                <div className="glow-orb glow-orb-2"></div>
                <div className="glow-orb glow-orb-3"></div> */}
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
                            required />
                    </div>

                    <div className="create-room-row">
                        <label htmlFor="Numberofplayers">Number of Players: </label>
                        <input
                            type="number"
                            id="Numberofplayers"
                            name="Numberofplayers"
                            value={numberOfPlayers}
                            onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
                            required />
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
                        {
                            selectedGame === "Night Mafia"
                            &&
                            <>
                                {/* <h2>Night Mafia</h2> */}
                                <label htmlFor="NumberofMafia">Number of Mafia: </label>
                                <select
                                    name="NumberofMafia"
                                    id="NumberofMafia"
                                    value={selectedNumber}
                                    onChange={(e) => setSelectedNumber(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="random">Random</option>
                                </select>
                            </>
                        }
                        {
                            selectedGame === "Answer the question"
                            &&
                            <>
                                {/* <h2>Answer the Question</h2> */}
                                <label htmlFor="NumberofImposters">Number of Imposters: </label>
                                <select
                                    name="NumberofImposters"
                                    id="NumberofImposters"
                                    value={selectedNumber}
                                    onChange={(e) => setSelectedNumber(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="random">Random</option>
                                </select>
                            </>
                        }

                    </div>

                    <div className="button-center">
                        <button className="create-room-button" onClick={handleRoomCreation}>Create Room</button>
                    </div>

                </div>
            </div>

        </>
    )
}
export default CreateRoom; 
