function NightMafia() {
  return (
    <div>
    <h1>Night Mafia</h1>
    <p>
        <strong>Night Mafia</strong> is a thrilling social deduction game where players secretly take on different roles and try to outwit each other. The game is played in alternating night and day phases. The objective is simple: eliminate the opposing side before they eliminate you.
    </p>

    <h2>Roles:</h2>
    <ul>
        <li><strong>Mafia:</strong> Secretly eliminate one player each night. Their goal is to outnumber or eliminate all non-mafia players.</li>
        <li><strong>Doctor:</strong> Secretly chooses one player to save each night. If the Mafia targets that player, the kill is prevented.</li>
        <li><strong>Police:</strong> Each night, investigates one player to discover whether they are part of the Mafia.</li>
        <li><strong>Civilians:</strong> Ordinary townspeople with no special powers. They participate in discussion and voting during the day.</li>
    </ul>

    <h2>How to Play:</h2>
    <ol>
        <li>Each player is randomly assigned one of the roles. Roles are kept secret except during specific phases.</li>
        <li><strong>Night Phase:</strong>
            <ul>
                <li>The Mafia silently chooses a player to eliminate.</li>
                <li>The Doctor selects one player to protect from elimination.</li>
                <li>The Police investigates one player to determine if they are Mafia.</li>
            </ul>
        </li>
        <li><strong>Day Phase:</strong>
            <ul>
                <li>All players wake up (except the one eliminated by the Mafia, unless saved by the Doctor).</li>
                <li>Players discuss, share suspicions, and may share investigation results (if they believe the Police).</li>
                <li>Everyone votes to eliminate one player suspected of being Mafia.</li>
            </ul>
        </li>
        <li>The game continues with alternating night and day phases.</li>
        <li><strong>Win Conditions:</strong>
            <ul>
                <li><strong>Mafia wins</strong> if they equal or outnumber the remaining players.</li>
                <li><strong>Townsfolk win</strong> (Civilians, Doctor, Police) if all Mafia members are eliminated.</li>
            </ul>
        </li>
    </ol>

    <p>
        Night Mafia combines deception, teamwork, and strategy. Can you protect your town or take it over from the shadows?
    </p>
</div>

  );
}
export default NightMafia;