<img src="./src/assets/logo.png" height="80" style="vertical-align:middle;" />

# KaandZone

**KaandZone** is a web-based platform for playing social deduction and party games online with friends. Play classics like Raja Rani Chor Police, Night Mafia, Guess the Character, and Answer the Question — all in your browser!

## Features

- User and Admin login
- Create and join public/private game rooms
- Multiple game types with unique rules:
  - Raja Rani Chor Police
  - Night Mafia
  - Guess the Character
  - Answer the Question
- Responsive, modern UI with dark theme
- Leaderboard and room management
- Gemini AI API integration for advanced game logic
- Hosted live at: [https://kaandzone.netlify.app/](https://kaandzone.netlify.app/)
- Built with React, TypeScript, Firebase, and React Router

## Project Structure

```
src/
  assets/           # Static assets (logo, images)
  components/       # Reusable React components (Header, Hero, Game Info, etc.)
  pages/            # Page-level React components (Home, Login, Room, Profile, etc.)
  services/         # Firebase service
  styles/           # CSS files for each page/component
  types/            # TypeScript types
  App.tsx           # Main app component (routing)
  main.tsx          # Entry point
  index.css         # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Sankalp-Dawada/KaandZone.git
   cd KaandZone
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase:**
   - Update `src/services/firebase.ts` with your Firebase project credentials.

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. **Open in your browser:**
   ```
   http://localhost:5173
   ```

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Gemini AI API](https://ai.google.dev/)

## Live Demo

Try it now: [https://kaandzone.netlify.app/](https://kaandzone.netlify.app/)

## TODO

- Fix the Exit button so users can reliably leave a room
- Add user signup functionality
- Implement admin special features

## License

This project is for educational and personal use.

---

Enjoy playing with your friends on **KaandZone**!