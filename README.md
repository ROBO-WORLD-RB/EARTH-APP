# EARTH: AI Brain Studio

A unique chat application where you can define the AI's personality and behavior. Craft your perfect conversation partner by giving it specific instructions, and watch it adapt in real-time.

## Features

- Customizable AI personality through system instructions
- Google authentication for user accounts
- Dark/light theme support
- File attachments and image support
- Message actions (copy, edit, delete, regenerate)
- Conversation management

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Gemini API key: `VITE_GEMINI_API_KEY=your_key_here`
   - Add Firebase configuration (see Firebase setup below)

3. Run the app:
   ```
   npm run dev
   ```

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication and select Google as a sign-in method
3. Get your Firebase configuration from Project Settings > General > Your apps
4. Add the configuration values to your `.env.local` file
5. Make sure to add your app's domain to the authorized domains in Firebase Authentication settings
