/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface Props {
  roomData: any;
  roles: { [player: string]: string };
  username: string | null;
  answers: { [player: string]: string };
  votes: { [player: string]: string };
  showVoting: boolean;
  showResults: boolean;
  handleAnswer: (answer: string) => void;
  handleVote: (voted: string) => void;
}

const GuessCharacterSection: React.FC<Props> = ({
  roomData,
  roles,
  username,
  answers,
  votes,
  showVoting,
  showResults,
  handleAnswer,
  handleVote,
}) => {
  return (
    <>
      <h3>Guess the Character</h3>
      <div className="theme-info">
        <strong>Theme:</strong> {roomData?.gameState?.theme || "Random"}
      </div>
      <div className="game-info">
        <p>
          <strong>Your character:</strong> {roles[username!] ? "???" : "Loading..."}
        </p>
        <p>
          <em>
            Everyone else can see your character, but you can't! Try to discuss and guess what your character is.
          </em>
        </p>
      </div>
      <div className="players-roles">
        <h4>Other Players:</h4>
        <ul>
          {roomData.PlayersName.filter((p: string) => p !== username).map((player: string) => (
            <li key={player}>
              {player}: {roles[player] || "Loading..."}
            </li>
          ))}
        </ul>
      </div>
      {!answers[username!] && (
        <div className="answer-section">
          <label>Your guess or description:</label>
          <input
            type="text"
            placeholder="Enter your answer"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAnswer(e.currentTarget.value);
              }
            }}
          />
          <button className="submit-btn" onClick={(e) => {
            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
            handleAnswer(input.value);
          }}>
            Submit Answer
          </button>
        </div>
      )}
      {answers[username!] && (
        <div>Your answer: <strong>{answers[username!]}</strong></div>
      )}
      {showVoting && !votes[username!] && (
        <div className="voting-section">
          <h4>Vote: Who guessed their character best?</h4>
          <div className="vote-buttons">
            {roomData.PlayersName.filter((p: string) => p !== username).map((player: string) => (
              <button className="vote-btn" key={player} onClick={() => handleVote(player)}>
                {player}
              </button>
            ))}
          </div>
        </div>
      )}
      {showResults && (
        <div className="results-section">
          <h4>Results</h4>
          <div><strong>The character was:</strong> {roomData.gameState?.question}</div>
          <h5>All Answers:</h5>
          <ul>
            {roomData.PlayersName.map((player: string) => (
              <li key={player}>
                <strong>{player}:</strong> {answers[player] || "No answer"}
              </li>
            ))}
          </ul>
          <h5>Voting Results:</h5>
          <div>
            {Object.entries(votes).length > 0
              ? Object.entries(votes).map(([voter, voted]) => (
                <div key={voter}>{voter} voted for {voted}</div>
              ))
              : "No votes yet"}
          </div>
        </div>
      )}
    </>
  );
};

export default GuessCharacterSection;
