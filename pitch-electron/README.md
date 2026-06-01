# Instagram Pitch Generator — Desktop App

AI-powered desktop app that analyzes Instagram screenshots and generates a Word document pitch proposal.

---

## Build the .exe (one-time setup)

### Requirements
- Windows 10 or 11 (64-bit)
- Node.js 18+ → https://nodejs.org (download LTS)

### Steps

**1. Open Command Prompt or PowerShell in this folder**
(Right-click the folder → "Open in Terminal")

**2. Install dependencies**
```
npm install
```

**3. Build the .exe installer**
```
npm run build
```

**4. Find your installer**
```
dist\Instagram Pitch Generator Setup.exe
```

Double-click it to install. A shortcut appears on your Desktop and Start Menu.

---

## Running without building (dev mode)

If you just want to run it without building an installer:
```
npm install
npm start
```

---

## How to use the app

1. Launch **Instagram Pitch Generator** from your desktop
2. Enter your Anthropic API key (get one free at https://console.anthropic.com)
3. Fill in your agency details
4. Upload 4–20 Instagram screenshots
5. Click **Analyze with AI**
6. Download the generated Word document pitch

---

## Replacing the icon

Replace `assets/icon.ico` with your own logo before building.
- Format: `.ico`
- Recommended size: 256×256 px
- Free converter: https://convertio.co/png-ico/

---

## Distributing to your team

After building, share the file:
```
dist\Instagram Pitch Generator Setup.exe
```

Anyone on your team can install it — they don't need Node.js or any technical setup.

---

## Troubleshooting

**"npm is not recognized"** → Install Node.js from https://nodejs.org and restart your terminal

**Build fails with "Python not found"** → Run: `npm install --global windows-build-tools`

**App opens but API call fails** → Check your API key at https://console.anthropic.com
