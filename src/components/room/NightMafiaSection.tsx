/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface Props {
  roomData: any;
  roles: { [player: string]: string };
  username: string | null;
  mafiaActions: any;
  showResults: boolean;
  handleNightMafiaAction: (action: any) => void;
}

const NightMafiaSection: React.FC<Props> = ({
  roomData,
  roles,
  username,
  mafiaActions,
  showResults,
  handleNightMafiaAction,
}) => {
  return (
    <>
      <h3>Night Mafia</h3>
      <div className="game-info">
        <p><strong>Your role:</strong> {roles[username!] || "Loading..."}</p>
      </div>
      <div className="players-roles">
        <h4>All Players:</h4>
        <ul>
          {roomData.PlayersName.map((player: string) => (
            <li key={player}>
              {player}: {player === username ? <strong>{roles[player]}</strong> : "Hidden"}
            </li>
          ))}
        </ul>
      </div>
      {!showResults && (
        <div className="night-actions">
          {(!mafiaActions[username!]) ? (
            <>
              {roles[username!] === "Mafia" && (
                <div>
                  <label>Choose someone to kill:</label>
                  <select id="mafia-kill">
                    {roomData.PlayersName.filter((p: string) => p !== username).map((player: string) => (
                      <option key={player} value={player}>{player}</option>
                    ))}
                  </select>
                  <button
                    className="submit-btn"
                    onClick={() => {
                      const select = document.getElementById("mafia-kill") as HTMLSelectElement;
                      handleNightMafiaAction({ mafia: select.value });
                    }}
                  >
                    Submit
                  </button>
                </div>
              )}
              {roles[username!] === "Doctor" && (
                <div>
                  <label>Choose someone to save:</label>
                  <select id="doctor-save">
                    {roomData.PlayersName.map((player: string) => (
                      <option key={player} value={player}>{player}</option>
                    ))}
                  </select>
                  <button
                    className="submit-btn"
                    onClick={() => {
                      const select = document.getElementById("doctor-save") as HTMLSelectElement;
                      handleNightMafiaAction({ doctor: select.value });
                    }}
                  >
                    Submit
                  </button>
                </div>
              )}
              {roles[username!] === "Police" && (
                <div>
                  <label>Choose someone to investigate:</label>
                  <select id="police-investigate">
                    {roomData.PlayersName.filter((p: string) => p !== username).map((player: string) => (
                      <option key={player} value={player}>{player}</option>
                    ))}
                  </select>
                  <button
                    className="submit-btn"
                    onClick={() => {
                      const select = document.getElementById("police-investigate") as HTMLSelectElement;
                      handleNightMafiaAction({ police: select.value });
                    }}
                  >
                    Submit
                  </button>
                </div>
              )}
              {roles[username!] === "Civilian" && (
                <div>
                  <button className="submit-btn" onClick={() => handleNightMafiaAction({ ready: true })}>
                    Ready
                  </button>
                </div>
              )}
            </>
          ) : (
            <div>
              <strong>Action submitted. Waiting for others...</strong>
            </div>
          )}
        </div>
      )}
      {showResults && (
        <div className="results-section">
          <h4>Night Results</h4>
          <div>
            {Object.entries(mafiaActions).map(([player, action]) => (
              <div key={player}>
                <strong>{player}:</strong>{" "}
                {typeof action === "object" && action !== null && "mafia" in action && (action as any).mafia && `Mafia tried to kill ${(action as any).mafia}`}
                {typeof action === "object" && action !== null && "doctor" in action && (action as any).doctor && `Doctor tried to save ${(action as any).doctor}`}
                {typeof action === "object" && action !== null && "police" in action && (action as any).police && `Police investigated ${(action as any).police}`}
                {typeof action === "object" && action !== null && "ready" in action && (action as any).ready && "Ready"}
              </div>
            ))}
          </div>
          {(() => {
            const mafiaAction = Object.values(mafiaActions).find(
              (a: any) => typeof a === "object" && a !== null && "mafia" in a
            );
            const doctorAction = Object.values(mafiaActions).find(
              (a: any) => typeof a === "object" && a !== null && "doctor" in a
            );
            let result = "";
            if (
              mafiaAction &&
              doctorAction &&
              typeof mafiaAction === "object" &&
              typeof doctorAction === "object" &&
              mafiaAction !== null &&
              doctorAction !== null &&
              "mafia" in mafiaAction &&
              "doctor" in doctorAction &&
              (mafiaAction as any).mafia === (doctorAction as any).doctor
            ) {
              result = `${(mafiaAction as any).mafia} was saved by the doctor!`;
            } else if (
              mafiaAction &&
              typeof mafiaAction === "object" &&
              mafiaAction !== null &&
              "mafia" in mafiaAction
            ) {
              result = `${(mafiaAction as any).mafia} was eliminated!`;
            } else {
              result = "No one was eliminated.";
            }
            return <div>{result}</div>;
          })()}
        </div>
      )}
    </>
  );
};

export default NightMafiaSection;
