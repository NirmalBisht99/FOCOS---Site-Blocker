# FOCOS (Desktop Site-Blocker & Focus App)

An Electron-based cross-platform productivity application built with **React** and **Tailwind CSS**.

FOCOS helps users maintain deep focus by blocking distracting websites during structured focus sessions. The application enforces time-based blocking, persists session state locally using **Local Storage**, and provides a clean, distraction-free experience.

FOCOS operates in **three powerful modes**:

- 🟢 Normal Mode  
- 🍅 Pomodoro Mode (Customizable)  
- 🔒 Strict Mode  

Core blocking logic and system-level controls operate inside the Electron desktop environment.

---

# 🚀 Tech Stack

## ⚛️ React

React is used to build the interactive user interface of FOCOS.

**Why React?**
- Component-based architecture for reusable UI
- Efficient state management using hooks
- Fast rendering with virtual DOM
- Clean separation between UI and logic

**Used For:**
- Mode selection screens  
- Timer components  
- Blocked website configuration UI  
- Session tracking dashboards  
- Dynamic state updates during focus sessions  

---

## 🎨 Tailwind CSS

Tailwind CSS is used for modern and responsive styling.

**Why Tailwind?**
- Utility-first styling approach  
- Rapid UI development  
- Fully responsive layouts  
- Clean and minimal design system  

**Used For:**
- Focus timer UI  
- Mode selection cards  
- Strict mode full-screen layout  
- Responsive desktop interface  

---

## 🖥 Electron

Electron powers the desktop environment of FOCOS.

**Why Electron?**
- Cross-platform desktop support (Windows, macOS, Linux)  
- Access to system-level controls  
- Ability to enforce website blocking  
- IPC communication between frontend and backend  

**Used For:**
- Main process handling system-level operations  
- Blocking websites during sessions  
- Enforcing Strict Mode restrictions  
- Desktop window management  

---

## 💾 Local Storage

Local Storage is used to persist user data locally.

**Why Local Storage?**
- No external database required  
- Fast local read/write operations  
- Session persistence across app restarts  

**Stores:**
- Blocked website list  
- Selected focus mode  
- Timer preferences (Pomodoro customization)  
- Daily focus tracking data  
- Session history  

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

Structured productivity mode based on the Pomodoro technique — fully customizable.

### Features:
- Custom focus duration (e.g., 25, 40, 50 minutes)  
- Custom short break duration  
- Custom long break duration  
- Configurable number of cycles before long break  
- Automatic session switching (Focus → Break → Focus)  
- Session counter & progress tracking  
- Real-time countdown timers  

Ideal for users who prefer disciplined work-break cycles with flexibility.

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
- 💾 Local data persistence  
- 🔔 Completion alerts and feedback  
- 📊 Focus session tracking  
- 🖥 Cross-platform desktop support  

---

# 🧠 Application Workflow

1. User selects one of the three modes  
2. Configures session duration (Normal/Pomodoro)  
3. Starts focus session  
4. Electron activates blocking engine  
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


## Development Mode


npm run dev


## Build Application

### Windows

npm run build:win


### macOS

npm run build:mac


### Linux

npm run build:linux


---

# 📁 Project Structure (Simplified)


FOCOS/
│
├── main/ # Electron main process
├── preload/ # Secure IPC bridge
├── renderer/ # React frontend
│ ├── components/
│ ├── pages/
│ └── hooks/
├── assets/
└── package.json


---

# 👨‍💻 Developed By

**Nirmal Bisht**
