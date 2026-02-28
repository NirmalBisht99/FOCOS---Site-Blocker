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
Used to build the interactive UI.
- Component-based architecture  
- State management using hooks  
- Dynamic timer updates  
- Mode switching UI  

## 🎨 Tailwind CSS
Used for responsive and modern styling.
- Utility-first design  
- Clean layout structure  
- Full-screen strict mode styling  
- Responsive desktop interface  

## 🖥 Electron
Used to convert the React app into a cross-platform desktop application.
- Access to system-level operations  
- File system manipulation  
- IPC (Inter-Process Communication)  
- Desktop window control  

## 💾 Local Storage
Used to persist data locally.
- Blocked websites list  
- Timer preferences  
- Selected mode  
- Session history  
- Daily tracking data  

---

# 🔒 How Website Blocking Works

FOCOS blocks websites by **configuring the system's host file**.

When a focus session starts, the app modifies the OS host file to redirect selected domains to `127.0.0.1`, preventing access.

---

## 🧩 Blocking Mechanism (Technical Flow)

| Step | What Happens | How It’s Done |
|------|--------------|--------------|
| 1️⃣ | User selects websites to block | Stored in Local Storage |
| 2️⃣ | Focus session starts | Renderer sends request via IPC |
| 3️⃣ | Electron main process receives request | Uses Node.js file system access |
| 4️⃣ | Host file is modified | Domains mapped to `127.0.0.1` |
| 5️⃣ | Browser tries to open blocked site | Redirected to localhost (fails) |
| 6️⃣ | Session ends | Host file entries removed |
| 7️⃣ | Websites restored | System returns to normal |

---

## 🖥 Host File Configuration Example

During blocking, entries like this are added:


127.0.0.1 facebook.com
127.0.0.1 www.facebook.com

127.0.0.1 instagram.com
127.0.0.1 www.instagram.com


This prevents the browser from reaching the real server.

When the session ends, FOCOS removes these entries automatically.

---

## ⚠️ Why Admin Permission Is Required

Modifying the host file requires:

- Windows → Administrator privileges  
- macOS/Linux → Root access  

Electron handles permission elevation to safely update the file.

---

# 🎯 Three Focus Modes

## 🟢 1. Normal Mode
- Custom focus duration  
- Website blocking active  
- Timer countdown  
- Notifications after completion  

---

## 🍅 2. Pomodoro Mode (Customizable)
- Custom focus duration  
- Custom short & long breaks  
- Configurable cycle count  
- Automatic switching between focus & break  
- Session counter  

---

## 🔒 3. Strict Mode
- Prevents app closing  
- Blocks minimizing  
- Disables early session termination  
- Full-screen enforced mode  
- Host file cannot be reverted until timer ends  

---

# ✨ Core Capabilities

- 🌐 Host-file based website blocking  
- ⏳ Real-time customizable timers  
- 💾 Local data persistence  
- 🔔 Session completion alerts  
- 📊 Focus tracking  
- 🖥 Cross-platform desktop support  

---

# 🧠 Application Workflow

1. User selects mode  
2. Configures session duration  
3. Starts focus session  
4. Electron modifies host file  
5. Timer runs  
6. Session completes  
7. Host file restored  

In **Strict Mode**, the host file remains locked until the timer finishes.

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
- │
- ├── main/ # Electron main process
- ├── preload/ # Secure IPC bridge
- ├── renderer/ # React frontend
- │ ├── components/
- │ ├── pages/
- │ └── hooks/
- ├── assets/
- └── package.json
---

# 👨‍💻 Developed By

**Nirmal Bisht**
