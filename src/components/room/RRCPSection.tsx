/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface Props {
  roomData: any;
  roles: { [player: string]: string };
  username: string | null;
  isHost: boolean;
  rrcpResult: any;
  showResults: boolean;
  setRRCPResult: (result: any) => void;
  handleRRCPResult: (result: any) => void;
}

const RRCPSection: React.FC<Props> = ({
  roomData,
  roles,
  username,
  rrcpResult,
  showResults,
  setRRCPResult,
  handleRRCPResult,
}) => {
  const playerRole = roles[username!];
  const allPlayers = roomData.PlayersName;
  
  const allSubmitted = () => {
    if (!rrcpResult) return false;
    return allPlayers.every((p: string) => rrcpResult[p]);
  };

  const handleAction = (action: any) => {
    setRRCPResult((prev: any) => ({
      ...prev,
      [username!]: action,
    }));
  };


  const handleSubmitAll = () => {
    handleRRCPResult(rrcpResult);
  };

  return (
    <>
      <h3>Raja Rani Chor Police</h3>
      <div className="game-info">
        <p>
          <strong>Your role:</strong> {playerRole || "Loading..."}
        </p>
    
        {Object.entries(roles).map(([player, role]) =>
          role === "Police" && player !== username ? (
            <p key={player}>
              <strong>Police:</strong> <strong>{player}</strong>
            </p>
          ) : null
        )}
      </div>
      <div className="players-roles">
        <h4>All Players:</h4>
        <ul>
          {allPlayers.map((player: string) => (
            <li key={player}>
              {player}: {player === username ? <strong>{roles[player]}</strong> : roles[player] === "Police" ? <strong>Police</strong> : "Hidden"}
            </li>
          ))}
        </ul>
      </div>
      {!showResults && (
        <div className="rrcp-actions">
          {playerRole === "Chor" && !rrcpResult?.[username!] && (
            <div>
              <label>Choose a player to steal from:</label>
              <select id="chor-steal">
                {allPlayers
                  .filter((p: string) => p !== username && roles[p] !== "Police")
                  .map((player: string) => (
                    <option key={player} value={player}>{player}</option>
                  ))}
              </select>
              <button
                className="submit-btn"
                onClick={() => {
                  const select = document.getElementById("chor-steal") as HTMLSelectElement;
                  handleAction({ chorTarget: select.value });
                }}
              >
                Submit
              </button>
            </div>
          )}
          {playerRole === "Police" && !rrcpResult?.[username!] && (
            <div>
              <label>Choose a player as Chor:</label>
              <select id="police-guess">
                {allPlayers.filter((p: string) => p !== username).map((player: string) => (
                  <option key={player} value={player}>{player}</option>
                ))}
              </select>
              <button
                className="submit-btn"
                onClick={() => {
                  const select = document.getElementById("police-guess") as HTMLSelectElement;
                  handleAction({ policeGuess: select.value });
                }}
              >
                Submit
              </button>
            </div>
          )}
          {playerRole !== "Chor" && playerRole !== "Police" && !rrcpResult?.[username!] && (
            <div>
              <button className="submit-btn" onClick={() => handleAction({ ready: true })}>
                Ready
              </button>
            </div>
          )}
          {rrcpResult?.[username!] && (
            <div>
              <strong>Action submitted. Waiting for others...</strong>
            </div>
          )}
          
          {allSubmitted() && (
            <div>
              <strong>All players have submitted.</strong>
              <button className="submit-btn" onClick={handleSubmitAll}>
                Show Results
              </button>
            </div>
          )}
        </div>
      )}
      {showResults && (
        <div className="results-section">
          <h4>Results</h4>
          <div>
            {(() => {
              
              let policeGuess = "";
              let chorTarget = "";
              Object.entries(rrcpResult || {}).forEach(([, action]: any) => {
                if (action.policeGuess) policeGuess = action.policeGuess;
                if (action.chorTarget) chorTarget = action.chorTarget;
              });
              return (
                <>
                  <div>Police guessed: {policeGuess}</div>
                  <div>Chor targeted: {chorTarget}</div>
                </>
              );
            })()}
          </div>
          <div>
            {Object.entries(roles).map(([player, role]) => (
              <div key={player}><strong>{player}:</strong> {role}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RRCPSection;
