/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface Props {
  roomData: any;
  roles: { [player: string]: string };
  username: string | null;
  isHost: boolean;
  rrcpResult: any;
  showResults: boolean;
  handleRRCPAction: (action: any) => void;
  handleRRCPResult: (result: any) => void;
}

const RRCPSection: React.FC<Props> = ({
  roomData,
  roles,
  username,
  isHost,
  rrcpResult,
  showResults,
  handleRRCPAction,
  handleRRCPResult,
}) => {
  const playerRole = roles[username!];
  const allPlayers = roomData.PlayersName;

  const submittedResult = rrcpResult || {};

  const allSubmitted = () => {
    if (!submittedResult) return false;
    return allPlayers.every((p: string) => submittedResult[p]);
  };

  // Automatically show results when all have submitted (host triggers)
  React.useEffect(() => {
    if (
      isHost &&
      !showResults &&
      allSubmitted() &&
      Object.keys(submittedResult).length === allPlayers.length
    ) {
      handleRRCPResult(submittedResult);
    }
    // eslint-disable-next-line
  }, [isHost, showResults, submittedResult, allPlayers.length]);

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
          {playerRole === "Chor" && !submittedResult?.[username!] && (
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
                  handleRRCPAction({ chorTarget: select.value });
                }}
              >
                Submit
              </button>
            </div>
          )}
          {playerRole === "Police" && !submittedResult?.[username!] && (
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
                  handleRRCPAction({ policeGuess: select.value });
                }}
              >
                Submit
              </button>
            </div>
          )}
          {playerRole !== "Chor" && playerRole !== "Police" && !submittedResult?.[username!] && (
            <div>
              <button className="submit-btn" onClick={() => handleRRCPAction({ ready: true })}>
                Ready
              </button>
            </div>
          )}
          {submittedResult?.[username!] && (
            <div>
              <strong>Action submitted. Waiting for others...</strong>
            </div>
          )}
          {allSubmitted() && (
            <div>
              <strong>All players have submitted. Waiting for results...</strong>
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
              Object.entries(submittedResult || {}).forEach(([, action]: any) => {
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
