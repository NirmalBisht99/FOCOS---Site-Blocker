# FOCOS (Desktop Site-Blocker & Focus App)

An Electron-based cross-platform productivity application built with **React** and **Tailwind CSS**.

FOCOS helps users maintain deep focus by blocking distracting websites during structured focus sessions. The application enforces time-based blocking, persists session state locally, and provides a clean, distraction-free experience.

FOCOS operates in **three powerful modes**:

- 🟢 Normal Mode  
- 🍅 Pomodoro Mode (Customizable)  
- 🔒 Strict Mode  

Core blocking logic and system-level controls operate inside the Electron desktop environment.

---

# 🚀 Tech Stack

- **Electron** — Desktop application framework  
- **React** — Frontend UI  
- **Tailwind CSS** — Styling & responsive design  
- **Node.js** — Backend logic & system operations  

---

# 🎯 Three Focus Modes

## 🟢 1. Normal Mode

Standard website blocking mode for flexible focus sessions.

### Features:
- User-defined focus duration  
- Custom blocked website list  
- Session timer countdown  
- Daily blocking persistence  
- Completion notification  

Best for users who want simple time-based blocking without enforced restrictions.

---

## 🍅 2. Pomodoro Mode (Customizable)

Structured productivity mode based on the Pomodoro technique — fully customizable to match user preference.

### Features:
- Custom focus duration (e.g., 25, 40, 50 minutes)  
- Custom short break duration  
- Custom long break duration  
- Configurable number of cycles before long break  
- Automatic session switching (Focus → Break → Focus)  
- Session counter & progress tracking  
- Real-time countdown timers  

Ideal for users who prefer disciplined work-break cycles but want flexibility in timing.

---

## 🔒 3. Strict Mode

High-discipline mode for maximum focus enforcement.

### Features:
- Prevents closing or minimizing the application  
- Blocks task switching during active session  
- Disables bypass of blocked websites  
- Cannot stop session before timer completion  
- Enforces full-screen focus environment  

Designed for deep work and zero-distraction environments.

---

# ✨ Core Capabilities

- 🌐 Website blocking during active sessions  
- ⏳ Real-time customizable timers  
- 💾 Local persistence of session data  
- 🔔 Completion alerts and feedback  
- 📊 Focus session tracking  
- 🖥 Cross-platform desktop support  

---

# 🧠 Application Workflow

1. User selects one of the three modes  
2. Configures session duration (Normal/Pomodoro)  
3. Starts focus session  
4. App activates blocking engine  
5. Timer runs until completion  
6. Session ends → notification displayed  

In **Strict Mode**, user cannot exit until the timer finishes.

---

# 🛠 Recommended IDE Setup

- VSCode  
- ESLint  
- Prettier  

---

# 📦 Project Setup

## Install Dependencies

npm install

Development Mode

npm run dev

Build Application

Windows

npm run build:win

macOS

npm run build:mac

Linux

npm run build:linux
# 📁 Project Structure (Simplified)


FOCOS/
- │
- ├── main/            # Electron main process
- ├── preload/         # Secure IPC bridge
- ├── renderer/        # React frontend
- │   ├── components/
- │   ├── pages/
- │   └── hooks/
- ├── assets/
- └── package.json
# 👨‍💻 Developed By

Nirmal Bisht





