# 📝 Quick Note Taker

A fast, lightweight desktop note-taking application built with [Electron](https://www.electronjs.org/).

---

## ✨ Features

- 🖥️ Cross-platform desktop app (Windows, macOS, Linux)
- ⚡ Fast and lightweight
- 💾 Save and manage your notes locally
- 🎨 Clean and minimal UI

---

## 🛠️ Tech Stack

| Technology | Version |
|------------|---------|
| Electron   | ^40.8.3 |
| Node.js    | ≥ 18.x  |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/dahalaayush000-hue/notetaker.git
cd notetaker
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the app**

```bash
npm start
```

---

## 📁 Project Structure

```
notetaker/
├── main.js          # Electron main process entry point
├── package.json     # Project configuration & dependencies
└── README.md        # You are here!
```

---

## 🐛 Common Issues

### `Missing script: "start"` error

If you see this error when running `npm start`, your `package.json` may be missing the scripts section. Make sure it contains:

```json
"scripts": {
  "start": "electron ."
}
```

Then run `npm install` again before `npm start`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**dahalaayush000-hue**

- GitHub: [@dahalaayush000-hue](https://github.com/dahalaayush000-hue)

---

> Made with ❤️ using Electron
