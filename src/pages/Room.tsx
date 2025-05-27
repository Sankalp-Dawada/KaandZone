import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

function Room() {
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPlayer, setNewPlayer] = useState("");


  const roomname = localStorage.getItem("roomname");

  useEffect(() => {
    if (!roomname) {
      setError("No room selected");
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const roomRef = doc(db, "rooms", roomname);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
          setError("Room not found");
        } else {
          setRoomData(roomSnap.data());
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


  const addPlayer = async () => {
    if (!newPlayer.trim()) return;

    try {
      const roomRef = doc(db, "rooms", roomname);
      await updateDoc(roomRef, {
        PlayersName: arrayUnion(newPlayer),
      });

      setRoomData((prev: any) => ({
        ...prev,
        PlayersName: prev.PlayersName ? [...prev.PlayersName, newPlayer] : [newPlayer],
      }));

      setNewPlayer("");
    } catch (e) {
      alert("Failed to add player: " + e);
    }
  };

  if (loading) return <div>Loading room...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <header>Room: {roomData.roomname}</header>
      <div>Game Type: {roomData.gameType}</div>
      <div>Number of Players: {roomData.numberOfPlayers}</div>
      <div>
        <label htmlFor="public-or-private">Room Visibility: </label>
        <select name="public-or-private" id="pop">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div className="players-present-in-room">
        <h3>Players List:</h3>
        {roomData.PlayersName && roomData.PlayersName.length > 0 ? (
          <ul>
            {roomData.PlayersName.map((player: string, idx: number) => (
              <li key={idx}>{player}</li>
            ))}
          </ul>
        ) : (
          <p>No players yet</p>
        )}

        <input
          type="text"
          placeholder="Add player name"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
        />
        <button onClick={addPlayer}>Add Player</button>
      </div>
    </div>
  );
}

export default Room;
