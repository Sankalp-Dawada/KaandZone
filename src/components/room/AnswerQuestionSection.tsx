/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface Props {
  roomData: any;
  roles: { [player: string]: string };
  username: string | null;
  answers: { [player: string]: string };
  votes: { [player: string]: string };
  showResults: boolean;
  handleAnswer: (answer: string) => void;
  handleVote: (voted: string) => void;
  question: string;
  imposter: string | null;
}

const AnswerQuestionSection: React.FC<Props> = ({
  roomData,
  roles,
  username,
  answers,
  votes,
  showResults,
  handleAnswer,
  handleVote,
  question,
  imposter,
}) => {
  return (
    <>
      <h3>Answer the Question</h3>
      <div className="game-info">
        <p><strong>Your question:</strong> {roles[username!] || "Loading..."}</p>
        <p><em>Answer your question. One player has a different question - find the imposter!</em></p>
      </div>
      {!answers[username!] && (
        <div className="answer-section">
          <input
            type="text"
            placeholder="Your answer"
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
      {Object.keys(answers).length >= (roomData?.PlayersName.length || 0) && (
        <>
          <div className="main-question">
            <strong>Main question (non-imposters):</strong> {question}
          </div>
          <h5>All Answers:</h5>
          <ul>
            {roomData.PlayersName.map((player: string) => (
              <li key={player}>
                <strong>{player}:</strong> {answers[player] || "No answer"}
              </li>
            ))}
          </ul>
          {!votes[username!] && (
            <div className="voting-section">
              <h4>Vote: Who is the imposter?</h4>
              <div className="vote-buttons">
                {roomData.PlayersName.filter((p: string) => p !== username).map((player: string) => (
                  <button className="vote-btn" key={player} onClick={() => handleVote(player)}>
                    {player}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {showResults && (
        <div className="results-section">
          <h4>Results</h4>
          <div><strong>Main question:</strong> {question}</div>
          <div><strong>Imposter was:</strong> {imposter}</div>
          <h5>All Answers:</h5>
          <ul>
            {roomData.PlayersName.map((player: string) => (
              <li key={player}>
                <strong>{player}:</strong> {answers[player] || "No answer"}
              </li>
            ))}
          </ul>
          <div>
            {Object.values(votes).filter((v: any) => v === imposter).length > (roomData.PlayersName.length / 2)
              ? "✅ Imposter caught!" : "❌ Imposter survived!"}
          </div>
        </div>
      )}
    </>
  );
};

export default AnswerQuestionSection;
