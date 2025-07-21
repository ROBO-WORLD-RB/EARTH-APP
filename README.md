# EARTH: AI Brain Studio

A sophisticated chat application where you can define the AI's personality and behavior. Craft your perfect conversation partner by giving it specific instructions, and watch it adapt in real-time. Built with React, TypeScript, and powered by Google's Gemini AI.

## ✨ Features

- **Customizable AI Personality** - Define system instructions to shape the AI's behavior and responses
- **Google Authentication** - Secure user accounts with Firebase Auth
- **Modern UI/UX** - Clean, responsive design with dark/light theme support
- **Rich Message Actions** - Copy, edit, delete, and regenerate messages
- **File & Image Support** - Upload and share files with the AI
- **Real-time Chat** - Smooth, responsive conversation experience
- **Conversation Management** - Organize and manage your chat sessions
- **TypeScript Support** - Full type safety throughout the application

## 🚀 Quick Start

**Prerequisites:** Node.js (v18 or higher)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ROBO-WORLD-RB/EARTH-APP.git
   cd EARTH-APP
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Add your Gemini API key: `VITE_GEMINI_API_KEY=your_key_here`
   - Add Firebase configuration (see Firebase setup below)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication and select Google as a sign-in method
3. Get your Firebase configuration from Project Settings > General > Your apps
4. Add the configuration values to your `.env.local` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
5. Add your app's domain to the authorized domains in Firebase Authentication settings

### Gemini AI Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env.local` file:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript
- **Build Tool:** Vite
- **AI Integration:** Google Gemini AI
- **Authentication:** Firebase Auth
- **Styling:** CSS3 with custom properties
- **Icons:** Custom SVG components

## 📁 Project Structure

```
EARTH-APP/
├── components/
│   ├── icons/           # Custom SVG icons
│   ├── AuthPage.tsx     # Authentication component
│   ├── ChatPanel.tsx    # Main chat interface
│   ├── MessageActions.tsx # Message interaction buttons
│   └── UserProfile.tsx  # User profile component
├── services/
│   ├── authService.ts   # Firebase authentication
│   └── geminiService.ts # Gemini AI integration
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css          # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you have any questions or need help, please open an issue on GitHub.
