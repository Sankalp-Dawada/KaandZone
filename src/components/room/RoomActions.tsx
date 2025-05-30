/* eslint-disable @typescript-eslint/no-explicit-any */

function RoomActions({ isHost, roundStarted, handlestartround, handleEndRound, deleteRoom, exitRoom }: any) {
  return (
    <div className="room-actions">
      {isHost && (
        <>
          <button className="delete-btn" onClick={deleteRoom}>Delete Room</button>
          <button
            className="start-btn"
            onClick={handlestartround}
            disabled={roundStarted}
          >
            {roundStarted ? "Round In Progress" : "Start Round"}
          </button>
          {roundStarted && (
            <button className="end-btn" onClick={handleEndRound}>
              End Round
            </button>
          )}
        </>
      )}
      <button className="exit-btn" onClick={exitRoom}>Exit Room</button>
    </div>
  );
}

export default RoomActions;
