/* eslint-disable @typescript-eslint/no-explicit-any */

function RoomLeaderboard({ roomData, isHost, username, editingPoints, handlePointsChange, updatePoints, roundPoints }: any) {
  const rounds = roundPoints?.length || 0;
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {roomData?.PlayersName && roomData.PlayersName.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              {/* Show round columns */}
              {Array.from({length: rounds}, (_, i) => (
                <th key={i}>Round {i+1}</th>
              ))}
              <th>Total</th>
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
                  <td>
                    {playerData.player}
                    {playerData.player === username && " (You)"}
                    {playerData.player === roomData?.createdBy && " (Host)"}
                  </td>
                  {/* Show round points */}
                  {Array.from({length: rounds}, (_, i) => (
                    <td key={i}>
                      {roundPoints?.[i]?.[playerData.player] ?? "-"}
                    </td>
                  ))}
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
  );
}

export default RoomLeaderboard;
