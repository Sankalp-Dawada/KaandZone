export interface RRCP{
    Raja: number;
    Rani: number;
    Police: number;
    Chor: number;
    Civilians: number;
}
export interface NightMafia{
    Mafia: number;
    Doctor: number;
    Police: number;
    Civilians: number;
}
export interface GuessTheCharacter{
    Character: string;
}
export interface AnswerTheQuestion{
    Question: string;
    Answer: string;
}
export interface User {
    username: string;
    roomId: Array<string>;
    gameType: Array<string>;
    isHost: boolean;
    setPlayerPoints: Array<number>;
    PlayersName: Array<string>;
}
export interface Admin {
    isAdmin: boolean;
    setplayer: boolean;
    roomId: Array<string>;
    gameType: Array<string>;
    IsHost: boolean;
}