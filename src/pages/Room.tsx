/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import "../styles/Room.css";
import Header from "../components/Header";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { shuffle, updateGameState, CHARACTER_THEMES } from "../components/room/roomUtils";
import RoomLeaderboard from "../components/room/RoomLeaderboard";
import RoomActions from "../components/room/RoomActions";
import GuessCharacterSection from "../components/room/GuessCharacterSection";
import AnswerQuestionSection from "../components/room/AnswerQuestionSection";
import NightMafiaSection from "../components/room/NightMafiaSection";
import RRCPSection from "../components/room/RRCPSection";

const GEMINI_API_KEY = "AIzaSyABYhInt2kphW9Lk2kAXknwV9cq_Vvr-s4";

interface RoomData {
  roomname: string;
  gameType: string;
  numberOfPlayers: number;
  PlayersName: string[];
  Points: number[];
  visibility?: string;
  createdBy?: string;
  gameState?: {
    roundStarted: boolean;
    roles: { [player: string]: string };
    question: string;
    imposter: string | null;
    answers: { [player: string]: string };
    votes: { [player: string]: string };
    showVoting: boolean;
    showResults: boolean;
    mafiaActions: any;
    rrcpResult: any;
    theme?: string;
  };
}

function Room() {
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

  const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);

  useEffect(() => {
    if (!roomname) {
      setError("No room selected");
      setLoading(false);
      return;
    }

    const roomRef = doc(db, "rooms", roomname as string);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (!doc.exists()) {
        setError("Room not found");
        setLoading(false);
        return;
      }

      const data = doc.data() as RoomData;
      setRoomData(data);


      setEditingPoints(
        data.PlayersName?.reduce((acc: Record<string, number>, name: string, idx: number) => {
          acc[name] = data?.Points?.[idx] || 0;
          return acc;
        }, {} as Record<string, number>) || {}
      );

      if (data.gameState) {
        setRoundStarted(data.gameState.roundStarted);
        setRoles(data.gameState.roles || {});
        setQuestion(data.gameState.question || "");
        setImposter(data.gameState.imposter);
        setAnswers(data.gameState.answers || {});
        setVotes(data.gameState.votes || {});
        setShowVoting(data.gameState.showVoting || false);
        setShowResults(data.gameState.showResults || false);
        setMafiaActions(data.gameState.mafiaActions || {});
        setRRCPResult(data.gameState.rrcpResult);
      }

      setLoading(false);
    }, (error) => {
      console.error("Error listening to room:", error);
      setError("Failed to fetch room");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomname]);

  const isHost = roomData?.createdBy === username;

  const handlestartround = async () => {
    if (!roomData || !isHost) return;

    const theme = CHARACTER_THEMES[Math.floor(Math.random() * CHARACTER_THEMES.length)];

    const initialGameState = {
      roundStarted: true,
      roles: {},
      question: "",
      imposter: "",
      answers: {},
      votes: {},
      showVoting: false,
      showResults: false,
      mafiaActions: {},
      rrcpResult: null,
      theme
    };

    if (roomData.gameType === "Guess Character" || roomData.gameType === "Guess the character") {
      const players = [...roomData.PlayersName];

      const prompt = `Suggest ${players.length} unique, well-known ${theme} for a guessing game. Respond as a comma-separated list, no extra text.`;
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

      let characterList: string[] = [];
      try {
        const aiResp = await model.generateContent(prompt);
        const txt = await aiResp.response.text();
        characterList = txt.split(",").map(s => s.trim()).filter(Boolean);

        while (characterList.length < players.length) {
          characterList.push(`Character${characterList.length + 1}`);
        }
      } catch {
        characterList = [
          "Batman", "Sherlock Holmes", "Harry Potter", "Iron Man", "Spiderman", "Wonder Woman",
          "Albert Einstein", "Cleopatra", "Zeus", "Mickey Mouse"
        ].slice(0, players.length);
      }

      const shuffledCharacters = shuffle(characterList);

      const newRoles: { [player: string]: string } = {};
      players.forEach((player, idx) => {
        newRoles[player] = shuffledCharacters[idx];
      });

      initialGameState.roles = newRoles;
      initialGameState.question = "";
      initialGameState.imposter = "";

      await updateGameState(roomname!, initialGameState, db);
      return;
    } else if (roomData.gameType === "Answer the question") {
      const players = [...roomData.PlayersName];
      const imposterIdx = Math.floor(Math.random() * players.length);
      const imposterName = players[imposterIdx];

      const prompt = "Suggest a fun question for a social deduction game, and a similar but different question for an imposter. Format: Main: <main>, Imposter: <imposter>";
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

      let mainQ = "";
      let impQ = "";
      try {
        const aiResp = await model.generateContent(prompt);
        const txt = await aiResp.response.text();
        const mainMatch = txt.match(/Main:\s*(.+)/i);
        const impMatch = txt.match(/Imposter:\s*(.+)/i);
        if (mainMatch) mainQ = mainMatch[1].trim();
        if (impMatch) impQ = impMatch[1].trim();
      } catch (error) {
        console.error("Error parsing Gemini response for question:", error);

        const fallbackPairs = [
          [
            "What's your favorite food?",
            "What's your favorite drink?"
          ],
          [
            "Which city would you love to visit?",
            "Which country would you love to visit?"
          ],
          [
            "What's your favorite movie genre?",
            "What's your favorite music genre?"
          ],
          [
            "If you could have any pet, what would it be?",
            "If you could have any car, what would it be?"
          ],
          [
            "What's your favorite season?",
            "What's your favorite month?"
          ]
        ];
        const pair = fallbackPairs[Math.floor(Math.random() * fallbackPairs.length)];
        mainQ = pair[0];
        impQ = pair[1];
      }
      if (!mainQ) mainQ = "What's your favorite food?";
      if (!impQ) impQ = "What's your favorite drink?";

      const newRoles: { [player: string]: string } = {};
      players.forEach((player, idx) => {
        newRoles[player] = idx === imposterIdx ? impQ : mainQ;
      });

      initialGameState.roles = newRoles;
      initialGameState.question = mainQ;
      initialGameState.imposter = imposterName;
      await updateGameState(roomname!, initialGameState, db);
      return;
    } else if (roomData.gameType === "Night Mafia") {
      const players = shuffle([...roomData.PlayersName]);
      const mafiaCount = Math.max(1, Math.floor(players.length / 4));

      let idx = 0;
      const newRoles: { [player: string]: string } = {};

      for (let i = 0; i < mafiaCount && idx < players.length; i++) {
        newRoles[players[idx++]] = "Mafia";
      }
      if (idx < players.length) newRoles[players[idx++]] = "Doctor";
      if (idx < players.length) newRoles[players[idx++]] = "Police";

      for (; idx < players.length; idx++) {
        newRoles[players[idx]] = "Civilian";
      }

      initialGameState.roles = newRoles;
      await updateGameState(roomname!, initialGameState, db);
      return;
    } else if (roomData.gameType === "Raja Rani Chor Police") {
      const players = shuffle([...roomData.PlayersName]);

      if (players.length < 4) {
        alert("Need at least 4 players for RRCP");
        return;
      }

      const newRoles: { [player: string]: string } = {};
      newRoles[players[0]] = "Raja";
      newRoles[players[1]] = "Rani";
      newRoles[players[2]] = "Police";
      newRoles[players[3]] = "Chor";

      for (let i = 4; i < players.length; i++) {
        newRoles[players[i]] = "Civilian";
      }

      initialGameState.roles = newRoles;
      await updateGameState(roomname!, initialGameState, db);
      return;
    }

    // fallback
    await updateGameState(roomname!, initialGameState, db);
  };

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
    if (!roomData || !roomname) {
      alert("Room data is not available.");
      return;
    }

    const newPoints = roomData.PlayersName.map(
      (player: string) => editingPoints[player] || 0
    );

    try {
      const roomRef = doc(db, "rooms", roomname);
      await updateDoc(roomRef, {
        Points: newPoints,
      });
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
    if (!roomname) return;

    try {
      const roomRef = doc(db, "rooms", roomname);
      await updateDoc(roomRef, { visibility: newVisibility });
    } catch (err) {
      alert("Failed to update visibility: " + err);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (!answer.trim() || !username || !roomname) return;

    const newAnswers = { ...answers, [username]: answer };
    const newGameState = {
      ...roomData?.gameState,
      answers: newAnswers,
      showVoting: Object.keys(newAnswers).length >= (roomData?.PlayersName.length || 0)
    };

    await updateGameState(roomname!, newGameState, db);
  };

  const handleVote = async (voted: string) => {
    if (!username || !roomname) return;

    const newVotes = { ...votes, [username]: voted };
    const newGameState = {
      ...roomData?.gameState,
      votes: newVotes,
      showResults: Object.keys(newVotes).length >= (roomData?.PlayersName.length || 0)
    };

    await updateGameState(roomname!, newGameState, db);
  };

  const handleRRCPResult = async (result: any) => {
    const newGameState = {
      ...roomData?.gameState,
      rrcpResult: result,
      showResults: true
    };
    await updateGameState(roomname!, newGameState, db);
  };


  const handleEndRound = async () => {
    if (!roomname || !isHost) return;
    try {
      const roomRef = doc(db, "rooms", roomname);
      await updateDoc(roomRef, {
        gameState: {
          roundStarted: false,
          roles: {},
          question: "",
          imposter: "",
          answers: {},
          votes: {},
          showVoting: false,
          showResults: false,
          mafiaActions: {},
          rrcpResult: null,
        }
      });
    } catch (error) {
      alert("Failed to end round: " + error);
    }
  };


  const handleGameTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGameType = e.target.value;
    if (!roomname || !isHost) return;
    try {
      const roomRef = doc(db, "rooms", roomname);
      await updateDoc(roomRef, { gameType: newGameType });
    } catch (error) {
      alert("Failed to update game type: " + error);
    }
  };


  const handleNightMafiaAction = async (action: any) => {
    if (!roomData || !roomData.gameState || !username) return;
    const updatedActions = { ...roomData.gameState.mafiaActions, [username]: action };

    const allSubmitted = Object.keys(updatedActions).length >= roomData.PlayersName.length;
    const newGameState = {
      ...roomData.gameState,
      mafiaActions: updatedActions,
      showResults: allSubmitted
    };
    await updateGameState(roomname!, newGameState, db);
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

          <div>
            Game Type:{" "}
            {isHost ? (
              <select
                value={roomData?.gameType || ""}
                onChange={handleGameTypeChange}
                disabled={roundStarted}
              >

                <option value="Guess the character">Guess the character</option>
                <option value="Answer the question">Answer the question</option>
                <option value="Night Mafia">Night Mafia</option>
                <option value="Raja Rani Chor Police">Raja Rani Chor Police</option>
              </select>
            ) : (
              roomData?.gameType
            )}
          </div>
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

        <RoomLeaderboard
          roomData={roomData}
          isHost={isHost}
          username={username}
          editingPoints={editingPoints}
          handlePointsChange={handlePointsChange}
          updatePoints={updatePoints}
        />

        <RoomActions
          isHost={isHost}
          roundStarted={roundStarted}
          handlestartround={handlestartround}
          handleEndRound={handleEndRound}
          deleteRoom={deleteRoom}
          exitRoom={exitRoom}
        />

        {roundStarted && (
          <div className="round-section">
            {roomData?.gameType === "Guess the character" && (
              <GuessCharacterSection
                roomData={roomData}
                roles={roles}
                username={username}
                answers={answers}
                votes={votes}
                showVoting={showVoting}
                showResults={showResults}
                handleAnswer={handleAnswer}
                handleVote={handleVote}
              />
            )}
            {roomData?.gameType === "Answer the question" && (
              <AnswerQuestionSection
                roomData={roomData}
                roles={roles}
                username={username}
                answers={answers}
                votes={votes}
                showResults={showResults}
                handleAnswer={handleAnswer}
                handleVote={handleVote}
                question={question}
                imposter={imposter}
              />
            )}
            {roomData?.gameType === "Night Mafia" && (
              <NightMafiaSection
                roomData={roomData}
                roles={roles}
                username={username}
                mafiaActions={mafiaActions}
                showResults={showResults}
                handleNightMafiaAction={handleNightMafiaAction}
              />
            )}
            {roomData?.gameType === "Raja Rani Chor Police" && (
              <RRCPSection
                roomData={roomData}
                roles={roles}
                username={username}
                isHost={isHost}
                rrcpResult={rrcpResult}
                showResults={showResults}
                setRRCPResult={setRRCPResult}
                handleRRCPResult={handleRRCPResult}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Room;