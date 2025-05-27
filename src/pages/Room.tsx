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

function Room() {
  interface RoomData {
    roomname: string;
    gameType: string;
    numberOfPlayers: number;
    PlayersName: string[];
    Points: number[];
    visibility?: string;
  }
  
    const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPoints, setEditingPoints] = useState<{ [key: string]: number }>({});
  const [copySuccess, setCopySuccess] = useState(false);

  const roomname = localStorage.getItem("roomname");

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

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomname || "");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy room ID: ', err);
      // Fallback for older browsers
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
        
        {/* Room ID Section */}
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
                  <th>Edit</th>
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
                        <input
                          type="number"
                          value={editingPoints[playerData.player] ?? playerData.points}
                          onChange={(e) => handlePointsChange(playerData.player, parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td>
                        <button className="update-btn" onClick={updatePoints}>
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No players yet</p>
          )}
        </div>

        <div className="room-actions">
          <button className="delete-btn" onClick={deleteRoom}>Delete Room</button>
          <button className="exit-btn" onClick={exitRoom}>Exit Room</button>
        </div>
      </div>
    </>
  );
}

export default Room;