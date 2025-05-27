import { useState } from "react";
import RRCP from "./Raja Rani Chor Police";
import NightMafia from "./Night Mafia";
import GuessTheCharacter from "./Guess the Character";
import AnswerTheQuestion from "./Answer the Question";
import "../styles/Hero.css";

function Hero() {
    const [selectedGame, setSelectedGame] = useState("Raja Rani Chor Police");

    return (
        <>
        <div className="flex-row">
            <label htmlFor="game-name">Choose a Game: </label>
            
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
            <br /><br />
            {
            selectedGame === "Raja Rani Chor Police" 
            && 
            <>
            <div className="flex-container"><RRCP /></div>
            </>}
            {
            selectedGame === "Night Mafia" 
            && 
            <>
            <div className="flex-container"><NightMafia /></div>
            </>
            }
            {
            selectedGame === "Guess Character" 
            && 
            <>
            <div className="flex-container"><GuessTheCharacter /></div>
            </>}
            {
            selectedGame === "Answer the question" 
            && 
            <>
            <div className="flex-container"><AnswerTheQuestion /></div>
            </>}
        </>
    );
}
export default Hero;