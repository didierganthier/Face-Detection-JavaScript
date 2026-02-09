# 🎙️ ConfidentSpeak - AI Presentation Coach

Practice public speaking with real-time AI feedback on your confidence, expressions, and eye contact.

## ✨ Features

### Core Features
- **🎯 Real-time Confidence Score** - AI analyzes your facial expressions to calculate a confidence score
- **👁️ Eye Contact Tracking** - Get feedback on whether you're looking at the camera
- **😊 Expression Analysis** - See live breakdown of your expressions (happy, neutral, surprised, worried)
- **💡 Live Coaching Tips** - Contextual advice based on your performance

### Practice Tools
- **⏱️ Practice Modes** - Choose from 30s, 1min, 5min, or unlimited sessions
- **🎲 Practice Prompts** - Random interview, presentation, storytelling, and impromptu topics
- **📝 Teleprompter** - Add your script and display it on screen while practicing
- **🧘 Breathing Exercise** - Calm your nerves before starting

### Progress & Gamification
- **📊 Progress Chart** - Visual graph of your confidence scores over time
- **🏆 Achievement Badges** - Unlock 8 badges as you improve
- **🔥 Streak Tracking** - Build daily practice streaks
- **📝 Session Notes** - Add personal notes to each session

### Quality of Life
- **🔊 Sound Effects** - Audio feedback for session events
- **⌨️ Keyboard Shortcuts** - Space, T, N, M, Esc for quick controls
- **🎊 Confetti Celebration** - Reward for 80%+ confidence scores
- **📱 Responsive Design** - Works on desktop and mobile

## 🚀 Live Demo

**[Try ConfidentSpeak Now →](https://didierganthier.github.io/Face-Detection-JavaScript/)**

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI/ML**: [face-api.js](https://github.com/justadudewhohacks/face-api.js) (TensorFlow.js)
- **Models**: TinyFaceDetector, FaceLandmark68, FaceExpression, AgeGender
- **Storage**: LocalStorage for session history and settings

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/didierganthier/Face-Detection-JavaScript.git
   cd Face-Detection-JavaScript
   ```

2. **Start a local server** (required for camera access)
   ```bash
   # Python 3
   python3 -m http.server 8080
   
   # Or Node.js
   npx serve
   ```

3. **Open in browser**
   ```
   http://localhost:8080
   ```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Pause session |
| `Esc` | End session |
| `T` | Toggle teleprompter |
| `N` | New practice prompt |
| `M` | Mute/unmute sounds |

## 🏆 Achievements

| Badge | Name | How to Unlock |
|-------|------|---------------|
| 🎬 | First Take | Complete your first session |
| ⭐ | Rising Star | Complete 5 sessions |
| 🌟 | Dedicated | Complete 10 sessions |
| 🔥 | On Fire | 3-day practice streak |
| 💎 | Unstoppable | 7-day practice streak |
| 💪 | Confident | Score 80%+ confidence |
| 🏆 | Master | Score 95%+ confidence |
| 😊 | Smile Champ | Average 50%+ smiling |

## 🔒 Privacy

- **100% Client-Side** - All processing happens in your browser
- **No Data Upload** - Your video never leaves your device
- **Local Storage Only** - Session history stored locally

## 📁 Project Structure

```
Face-Detection-JavaScript/
├── index.html          # Main application
├── script.js           # Application logic
├── face-api.min.js     # Face detection library
├── README.md           # This file
└── models/             # AI model weights
    ├── tiny_face_detector_model-*
    ├── face_landmark_68_model-*
    ├── face_expression_model-*
    ├── face_recognition_model-*
    └── age_gender_model-*
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) by Vincent Mühler

---

**Made with ❤️ for better public speakers everywhere**
