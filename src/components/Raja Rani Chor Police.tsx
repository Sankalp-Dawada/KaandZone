function RRCP(){
    return(
        <div>
    <h1>Raja Rani Chor Police</h1>
    <p><strong>Raja Rani Chor Police</strong> is an exciting role-based strategy game where each player takes on a secret identity. The goal is to outwit the Chor, protect valuable roles, and earn the most points through deduction and clever choices.</p>

    <h2>Roles:</h2>
    <ul>
        <li><strong>Raja (King):</strong> High-value target, worth 100 points if not stolen from.</li>
        <li><strong>Rani (Queen):</strong> Second high-value target, worth 50 points if not stolen from.</li>
        <li><strong>Police:</strong> Revealed role. Must identify the Chor to earn points.</li>
        <li><strong>Chor (Thief):</strong> Secret role. Attempts to steal from another player to gain points.</li>
        <li><strong>Civilians:</strong> Low-value roles, each worth 10 points if not stolen from.</li>
    </ul>

    <h2>How to Play:</h2>
    <ol>
        <li>Each player is randomly assigned a role. Only the Police is revealed; all others remain hidden.</li>
        <li>The Chor secretly chooses a player to steal from.</li>
        <li>The Police then announces their guess about who the Chor is.</li>
        <li>Scoring is handled as follows:
            <ul>
                <li><strong>If the Police correctly identifies the Chor:</strong>
                    <ul>
                        <li>Police earns 100 points.</li>
                        <li>Chor earns 0 points.</li>
                        <li>The targeted player is safe and retains their role’s full point value.</li>
                    </ul>
                </li>
                <li><strong>If the Police guesses incorrectly:</strong>
                    <ul>
                        <li>The Chor successfully steals from their target.</li>
                        <li>Chor earns:
                            <ul>
                                <li>100 points if they steal from Raja</li>
                                <li>50 points from Rani</li>
                                <li>10 points from a Civilian</li>
                                <li>0 points from Police</li>
                            </ul>
                        </li>
                        <li>The player who was stolen from gets 0 points.</li>
                        <li>The Police also gets 0 points.</li>
                    </ul>
                </li>
                <li><strong>All other players who were not stolen from earn their full role points:</strong>
                    <ul>
                        <li>Raja: 100 points</li>
                        <li>Rani: 50 points</li>
                        <li>Each Civilian: 10 points</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>The game continues for multiple rounds, with roles being shuffled each time. Total scores are tallied at the end to determine the winner.</li>
    </ol>

    <p>This dynamic and strategic game encourages observation, deduction, and a little bit of bluffing. Will the Chor outsmart the Police, or will justice prevail?</p>
</div>

    )
}
export default RRCP;