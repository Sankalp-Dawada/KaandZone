/* eslint-disable @typescript-eslint/no-explicit-any */
export function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((a) => [Math.random(), a] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

export async function updateGameState(roomname: string, gameState: any, db: any) {
  if (!roomname) return;
  const { doc, updateDoc } = await import("firebase/firestore");
  try {
    const roomRef = doc(db, "rooms", roomname);
    await updateDoc(roomRef, { gameState });
  } catch (error) {
    console.error("Error updating game state:", error);
  }
}

export const CHARACTER_THEMES = [
  "Superheroes",
  "Cartoon Characters",
  "Movie Characters",
  "Famous Scientists",
  "Historical Figures",
  "Mythological Characters",
  "Disney Characters",
  "Fictional Detectives",
  "Video Game Characters",
  "Famous Athletes"
];
