/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "../styles/Room.css";
import Header from "../components/Header";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyABYhInt2kphW9Lk2kAXknwV9cq_Vvr-s4"; 

function Room() {
  const handlestartround = async () => {
    if (!roomData) return;
    setShowResults(false);
    setShowVoting(false);
    setAnswers({});
    setVotes({});
    setImposter(null);
    setQuestion("");
    setRoles({});
    setRRCPResult(null);

    if (roomData.gameType === "Guess Character" || roomData.gameType === "Guess the character") {
      const players = [...roomData.PlayersName];
      const imposterIdx = Math.floor(Math.random() * players.length);
      const imposterName = players[imposterIdx];
      setImposter(imposterName);
      const prompt = "Suggest a fun character for a guessing game, and a similar but different character for an imposter. Format: Main: <main>, Imposter: <imposter>";
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const aiResp = await model.generateContent(prompt);
      let mainChar = "Batman", impChar = "Superman";
      try {
        const txt = await aiResp.response.text();
        const mainMatch = txt.match(/Main:\s*(.+)/i);
        const impMatch = txt.match(/Imposter:\s*(.+)/i);
        if (mainMatch) mainChar = mainMatch[1].trim();
        if (impMatch) impChar = impMatch[1].trim();
      } catch {
        console.error("Error parsing Gemini response for character:", aiResp);
      }
      setQuestion(mainChar);
      const newRoles: { [player: string]: string } = {};
      players.forEach((p, i) => {
        newRoles[p] = i === imposterIdx ? impChar : mainChar;
      });
      setRoles(newRoles);
      setRoundStarted(true);
    } else if (roomData.gameType === "Answer the question") {
      const players = [...roomData.PlayersName];
      const imposterIdx = Math.floor(Math.random() * players.length);
      const imposterName = players[imposterIdx];
      setImposter(imposterName);
      const prompt = "Suggest a fun question for a social deduction game, and a similar but different question for an imposter. Format: Main: <main>, Imposter: <imposter>";
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const aiResp = await model.generateContent(prompt);
      let mainQ = "What's your favorite fruit?", impQ = "What's your favorite vegetable?";
      try {
        const txt = await aiResp.response.text();
        const mainMatch = txt.match(/Main:\s*(.+)/i);
        const impMatch = txt.match(/Imposter:\s*(.+)/i);
        if (mainMatch) mainQ = mainMatch[1].trim();
        if (impMatch) impQ = impMatch[1].trim();
      } 
      catch {
        console.error("Error parsing Gemini response for question:", aiResp);
      }
      setQuestion(mainQ);
      const newRoles: { [player: string]: string } = {};
      players.forEach((p, i) => {
        newRoles[p] = i === imposterIdx ? impQ : mainQ;
      });
      setRoles(newRoles);
      setRoundStarted(true);
    } else if (roomData.gameType === "Night Mafia") {
      const players = shuffle([...roomData.PlayersName]);
      const mafiaCount = 1; 
      const doctorCount = 1;
      const policeCount = 1;
      let idx = 0;
      const newRoles: { [player: string]: string } = {};
      for (let i = 0; i < mafiaCount; ++i) newRoles[players[idx++]] = "Mafia";
      for (let i = 0; i < doctorCount; ++i) newRoles[players[idx++]] = "Doctor";
      for (let i = 0; i < policeCount; ++i) newRoles[players[idx++]] = "Police";
      for (; idx < players.length; ++idx) newRoles[players[idx]] = "Civilian";
      setRoles(newRoles);
      setRoundStarted(true);
      setMafiaActions({});
    } else if (roomData.gameType === "Raja Rani Chor Police") {
      const players = shuffle([...roomData.PlayersName]);
      const newRoles: { [player: string]: string } = {};
      if (players.length < 4) {
        alert("Need at least 4 players for RRCP");
        return;
      }
      newRoles[players[0]] = "Raja";
      newRoles[players[1]] = "Rani";
      newRoles[players[2]] = "Police";
      newRoles[players[3]] = "Chor";
      for (let i = 4; i < players.length; ++i) newRoles[players[i]] = "Civilian";
      setRoles(newRoles);
      setRoundStarted(true);
      setRRCPResult(null);
    }
  };

  interface RoomData {
    roomname: string;
    gameType: string;
    numberOfPlayers: number;
    PlayersName: string[];
    Points: number[];
    visibility?: string;
    createdBy?: string;
  }

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPoints, setEditingPoints] = useState<{ [key: string]: number }>({});
  const [copySuccess, setCopySuccess] = useState(false);

  const [roundStarted, setRoundStarted] = useState(false);
  const [roles, setRoles] = useState<{ [player: string]: string }>({});
  const [question, setQuestion] = useState<string>("");
  const [imposter, setImposter] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [player: string]: string }>({});
  const [votes, setVotes] = useState<{ [player: string]: string }>({});
  const [showVoting, setShowVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mafiaActions, setMafiaActions] = useState<any>({});
  const [rrcpResult, setRRCPResult] = useState<any>(null);

  const roomname = localStorage.getItem("roomname");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!roomname) {
      setError("No room selected");
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const roomRef = doc(db, "rooms", roomname as string);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
          setError("Room not found");
        } else {
          const data = roomSnap.data() as RoomData;
          setRoomData(data);
          setEditingPoints(
            data.PlayersName?.reduce((acc: Record<string, number>, name: string, idx: number) => {
              acc[name] = data?.Points?.[idx] || 0;
              return acc;
            }, {} as Record<string, number>) || {}
          );
        }
      } catch (e) {
        console.error("Error fetching room:", e);
        setError("Failed to fetch room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomname]);

  const isHost = roomData?.createdBy === username;

  const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);


  function shuffle<T>(arr: T[]): T[] {
    return arr
      .map((a) => [Math.random(), a] as [number, T])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomname || "");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy room ID: ', err);

      const textArea = document.createElement("textarea");
      textArea.value = roomname || "";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handlePointsChange = (player: string, value: number) => {
    setEditingPoints((prev) => ({
      ...prev,
      [player]: value,
    }));
  };

  const updatePoints = async () => {
    if (!roomData) {
      alert("Room data is not available.");
      return;
    }
    const newPoints = roomData.PlayersName.map(
      (player: string) => editingPoints[player] || 0
    );

    try {
      const roomRef = doc(db, "rooms", roomname || "");
      await updateDoc(roomRef, {
        Points: newPoints,
      });

      setRoomData((prev: RoomData | null) => ({
        ...prev!,
        Points: newPoints,
      }));
      
      alert("Points updated successfully!");
    } catch (e) {
      alert("Failed to update points: " + e);
    }
  };

  const deleteRoom = async () => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    if (!roomname) {
      alert("No room selected to delete.");
      return;
    }
    try {
      await deleteDoc(doc(db, "rooms", roomname));
      localStorage.removeItem("roomname");
      window.location.href = "/";
    } catch (e) {
      alert("Failed to delete room: " + e);
    }
  };

  const exitRoom = () => {
    localStorage.removeItem("roomname");
    window.location.href = "/";
  };

  const handleVisibilityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVisibility = e.target.value;

    try {
      const roomRef = doc(db, "rooms", roomname || "");
      await updateDoc(roomRef, { visibility: newVisibility });

      setRoomData((prev: any) => ({
        ...prev,
        visibility: newVisibility,
      }));
    } catch (err) {
      alert("Failed to update visibility: " + err);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [username!]: answer }));
    if (Object.keys(answers).length + 1 >= (roomData?.PlayersName.length || 0)) {
      setShowVoting(true);
    }
  };
  const handleVote = (voted: string) => {
    setVotes((prev) => ({ ...prev, [username!]: voted }));
    if (Object.keys(votes).length + 1 >= (roomData?.PlayersName.length || 0)) {
      setShowResults(true);
    }
  };

  const handleMafiaActions = (actions: any) => {
    setMafiaActions(actions);
    setShowResults(true);
  };


  const handleRRCPResult = (result: any) => {
    setRRCPResult(result);
    setShowResults(true);
  };

  if (loading) return (
    <>
      <Header />
      <div className="background-effects">
        <div className="grid-overlay"></div>
      </div>
      <div className="content-wrapper">
        <div>Loading room...</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Header />
      <div className="background-effects">
        <div className="grid-overlay"></div>
      </div>
      <div className="content-wrapper">
        <div>{error}</div>
      </div>
    </>
  );

  return (
    <>
      <Header />
      <div className="background-effects">
        <div className="grid-overlay"></div>
      </div>
      <div className="content-wrapper">
        <header className="room-header">Room: {roomData?.roomname}</header>
        
        <div className="room-id-section">
          <div className="room-id-container">
            <span className="room-id-label">Room ID:</span>
            <span className="room-id-value">{roomname}</span>
            <button 
              className={`copy-btn ${copySuccess ? 'copied' : ''}`}
              onClick={copyRoomId}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="room-details">
          <div>Game Type: {roomData?.gameType}</div>
          <div>Number of Players: {roomData?.numberOfPlayers}</div>
          <div>Current Players: {roomData?.PlayersName?.length || 0}</div>
          <div className="visibility-control">
            <label htmlFor="visibility">Room Visibility: </label>
            <select
              id="visibility"
              value={roomData?.visibility || "public"}
              onChange={handleVisibilityChange}
              disabled={!isHost}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="leaderboard">
          <h2>Leaderboard</h2>
          {roomData?.PlayersName && roomData.PlayersName.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Points</th>
                  {isHost && <th>Edit</th>}
                </tr>
              </thead>
              <tbody>
                {roomData.PlayersName
                  .map((player: string, idx: number) => ({
                    player,
                    points: roomData?.Points?.[idx] || 0,
                    originalIndex: idx
                  }))
                  .sort((a: any, b: any) => b.points - a.points)
                  .map((playerData: any, rank: number) => (
                    <tr key={playerData.originalIndex}>
                      <td>{rank + 1}</td>
                      <td>{playerData.player}</td>
                      <td>
                        {isHost ? (
                          <input
                            type="number"
                            value={editingPoints[playerData.player] ?? playerData.points}
                            onChange={(e) => handlePointsChange(playerData.player, parseInt(e.target.value) || 0)}
                          />
                        ) : (
                          playerData.points
                        )}
                      </td>
                      {isHost && (
                        <td>
                          <button className="update-btn" onClick={updatePoints}>
                            Save
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No players yet</p>
          )}
        </div>

        <div className="room-actions">
          {isHost && (
            <>
              <button className="delete-btn" onClick={deleteRoom}>Delete Room</button>
              <button className="start-btn" onClick={handlestartround}>Start Round</button>
            </>
          )}
          <button className="exit-btn" onClick={exitRoom}>Exit Room</button>
        </div>


        {roundStarted && (
          <div className="round-section">
            {(roomData?.gameType === "Guess Character" || roomData?.gameType === "Guess the character" || roomData?.gameType === "Answer the question") && (
              <>
                <h3>Round Question</h3>
                <p>
                  {roles[username!] ? (
                    <>Your prompt: <strong>{roles[username!]}</strong></>
                  ) : (
                    <>Waiting for host to start round...</>
                  )}
                </p>
                {!answers[username!] && (
                  <div>
                    <input
                      type="text"
                      placeholder="Your answer"
                      onBlur={e => handleAnswer(e.target.value)}
                    />
                  </div>
                )}
                {showVoting && !votes[username!] && (
                  <div>
                    <h4>Vote: Who is the imposter?</h4>
                    {roomData.PlayersName.map(p => (
                      <button key={p} onClick={() => handleVote(p)} disabled={p === username}>{p}</button>
                    ))}
                  </div>
                )}
                {showResults && (
                  <div>
                    <h4>Results</h4>
                    <div>Common prompt: <strong>{question}</strong></div>
                    <div>
                      <ul>
                        {roomData.PlayersName.map(p => (
                          <li key={p}>
                            {p}: {p === imposter ? "(Imposter answer hidden)" : answers[p] || "No answer"}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Imposter was: {imposter}</strong>
                      <br />
                      {Object.values(votes).filter(v => v === imposter).length > (roomData.PlayersName.length / 2)
                        ? "Imposter caught!" : "Imposter survived!"}
                    </div>
                  </div>
                )}
              </>
            )}
            {roomData?.gameType === "Night Mafia" && (
              <>
                <h3>Roles</h3>
                <ul>
                  {Object.entries(roles).map(([p, r]) => (
                    <li key={p}>{p}: {p === username ? <b>{r}</b> : "?"}</li>
                  ))}
                </ul>
                {isHost && !showResults && (
                  <div>
                    <h4>Host: Enter Mafia/Doctor/Police actions</h4>
                    <input placeholder="Mafia kills" onBlur={e => setMafiaActions((a: any) => ({ ...a, mafia: e.target.value }))} />
                    <input placeholder="Doctor saves" onBlur={e => setMafiaActions((a: any) => ({ ...a, doctor: e.target.value }))} />
                    <input placeholder="Police guesses" onBlur={e => setMafiaActions((a: any) => ({ ...a, police: e.target.value }))} />
                    <button onClick={() => handleMafiaActions(mafiaActions)}>Submit Actions</button>
                  </div>
                )}
                {showResults && (
                  <div>
                    <h4>Results</h4>
                    <div>Mafia tried to kill: {mafiaActions.mafia}</div>
                    <div>Doctor saved: {mafiaActions.doctor}</div>
                    <div>Police guessed: {mafiaActions.police}</div>
                  </div>
                )}
              </>
            )}
            {roomData?.gameType === "Raja Rani Chor Police" && (
              <>
                <h3>Roles</h3>
                <ul>
                  {Object.entries(roles).map(([p, r]) => (
                    <li key={p}>{p}: {p === username ? <b>{r}</b> : "?"}</li>
                  ))}
                </ul>
                {isHost && !showResults && (
                  <div>
                    <h4>Host: Enter Police guess and Chor target</h4>
                    <input placeholder="Police guesses (player name)" onBlur={e => setRRCPResult((r: any) => ({ ...r, policeGuess: e.target.value }))} />
                    <input placeholder="Chor steals from (player name)" onBlur={e => setRRCPResult((r: any) => ({ ...r, chorTarget: e.target.value }))} />
                    <button onClick={() => handleRRCPResult(rrcpResult)}>Submit</button>
                  </div>
                )}
                {showResults && (
                  <div>
                    <h4>Results</h4>
                    <div>Police guessed: {rrcpResult?.policeGuess}</div>
                    <div>Chor stole from: {rrcpResult?.chorTarget}</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Room;