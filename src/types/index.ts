interface RRCP{
    Raja: number;
    Rani: number;
    Police: number;
    Chor: number;
    Civilians: number;
}
interface NightMafia{
    Mafia: number;
    Doctor: number;
    Police: number;
    Civilians: number;
}
interface GuessTheCharacter{
    Character: string;

}
interface AnswerTheQuestion{
    Question: string;
    Answer: string;
}
interface Game {
    name: string;
    roles: RRCP | NightMafia | GuessTheCharacter | AnswerTheQuestion;
}