import React, { useState } from "react";

function CreateRoom() {
    const [selectedGame, setSelectedGame] = useState("Raja Rani Chor Police");

    return (
        <div flex-column>
            <div className="flex-row">
                <h1>Create Room</h1>
                <label htmlFor="room-name">Room Name: </label>
                <input
                    type="text"
                    id="room-name"
                    name="room-name"
                    required />
                    </div>

            <div className="flex-row">
                <label htmlFor="Numberofplayers">Number of Players: </label>
            <input
                type="number"
                id="Numberofplayers"
                name="Numberofplayers"
                required />
            </div>
            
            <div className="flex-row">
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
            
            {
                selectedGame === "Night Mafia"
                &&
                <>
                    <h2>Night Mafia</h2>
                    <label htmlFor="NumberofMafia">Number of Mafia: </label>
                    <select name="NumberofMafia" id="NumberofMafia">
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
                    <h2>Answer the Question</h2>
                    <label htmlFor="NumberofImposters">Number of Imposters: </label>
                    <select name="NumberofImposters" id="NumberofImposters">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="random">Random</option>
                    </select>
                </>
            }
            <button onClick={()=>{
                window.location.href = '/home';
            }}>Create Room</button>


        </div>
    )
}
export default CreateRoom;