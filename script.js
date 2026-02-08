// ========================================
// ConfidentSpeak - AI Presentation Coach
// ========================================

// DOM Elements
const video = document.getElementById('video')
const loading = document.getElementById('loading')
const loadingText = document.getElementById('loadingText')
const welcomeScreen = document.getElementById('welcomeScreen')
const videoContainer = document.getElementById('videoContainer')
const errorDiv = document.getElementById('error')
const statusDot = document.getElementById('statusDot')
const statusText = document.getElementById('statusText')

// Session Controls
const startAppBtn = document.getElementById('startAppBtn')
const startSessionBtn = document.getElementById('startSessionBtn')
const endSessionBtn = document.getElementById('endSessionBtn')
const pauseSessionBtn = document.getElementById('pauseSessionBtn')

// Timer
const sessionTimer = document.getElementById('sessionTimer')
const timerDisplay = document.getElementById('timerDisplay')
const timeRemaining = document.getElementById('timeRemaining')

// Practice Mode
const modeSelector = document.getElementById('modeSelector')
const modeBtns = document.querySelectorAll('.mode-btn')

// Teleprompter
const teleprompterInput = document.getElementById('teleprompterInput')
const teleprompterOverlay = document.getElementById('teleprompterOverlay')
const teleprompterDisplay = document.getElementById('teleprompterDisplay')
const toggleTeleprompterBtn = document.getElementById('toggleTeleprompter')
const clearTeleprompterBtn = document.getElementById('clearTeleprompter')

// Confidence Score
const scoreCircle = document.getElementById('scoreCircle')
const confidenceScore = document.getElementById('confidenceScore')
const scoreLabel = document.getElementById('scoreLabel')

// Tips
const tipsContainer = document.getElementById('tipsContainer')

// Expression Metrics
const happyBar = document.getElementById('happyBar')
const happyValue = document.getElementById('happyValue')
const neutralBar = document.getElementById('neutralBar')
const neutralValue = document.getElementById('neutralValue')
const surprisedBar = document.getElementById('surprisedBar')
const surprisedValue = document.getElementById('surprisedValue')
const sadBar = document.getElementById('sadBar')
const sadValue = document.getElementById('sadValue')

// Summary Modal
const summaryModal = document.getElementById('summaryModal')
const closeModalBtn = document.getElementById('closeModalBtn')
const newSessionBtn = document.getElementById('newSessionBtn')
const summaryScore = document.getElementById('summaryScore')
const summaryDuration = document.getElementById('summaryDuration')
const summarySmiles = document.getElementById('summarySmiles')
const summaryEngagement = document.getElementById('summaryEngagement')
const summaryFeedback = document.getElementById('summaryFeedback')

// History Modal
const historyBtn = document.getElementById('historyBtn')
const historyModal = document.getElementById('historyModal')
const historyList = document.getElementById('historyList')
const streakContainer = document.getElementById('streakContainer')
const clearHistoryBtn = document.getElementById('clearHistoryBtn')
const closeHistoryBtn = document.getElementById('closeHistoryBtn')

// Practice Prompts
const promptCategory = document.getElementById('promptCategory')
const promptText = document.getElementById('promptText')
const newPromptBtn = document.getElementById('newPromptBtn')

// Achievement Badges
const badgesGrid = document.getElementById('badgesGrid')

// Breathing Exercise
const breatheBtn = document.getElementById('breatheBtn')
const breathingModal = document.getElementById('breathingModal')
const breathingText = document.getElementById('breathingText')
const breathingProgress = document.getElementById('breathingProgress')
const skipBreathingBtn = document.getElementById('skipBreathingBtn')

// Eye Contact Indicator
const eyeContactIndicator = document.getElementById('eyeContactIndicator')
const eyeContactText = document.getElementById('eyeContactText')

// Confetti
const confettiContainer = document.getElementById('confettiContainer')

// Session Notes
const sessionNotesInput = document.getElementById('sessionNotesInput')

// ========================================
// State
// ========================================

let canvas
let displaySize
let detectionInterval
let isSessionActive = false
let isPaused = false
let sessionStartTime = null
let timerInterval = null
let teleprompterVisible = false

// Practice Mode Settings
let currentMode = {
  name: 'presentation',
  duration: 300, // seconds (0 = unlimited)
  timeLeft: 300
}

// Session Statistics
let sessionStats = {
  confidenceScores: [],
  expressions: { happy: [], neutral: [], surprised: [], sad: [] },
  faceDetected: 0,
  totalFrames: 0
}

// Session History (localStorage)
const HISTORY_KEY = 'confidentspeak_history'
const STREAK_KEY = 'confidentspeak_streak'
const BADGES_KEY = 'confidentspeak_badges'

// Practice Prompts Database
const practicePrompts = {
  interview: [
    "Tell me about yourself and your background.",
    "What's your greatest professional achievement?",
    "Describe a challenge you overcame at work.",
    "Where do you see yourself in 5 years?",
    "Why should we hire you over other candidates?",
    "Tell me about a time you showed leadership.",
    "What are your biggest strengths and weaknesses?",
    "Describe your ideal work environment."
  ],
  presentation: [
    "Introduce your company's new product or service.",
    "Present the quarterly results to stakeholders.",
    "Pitch your startup idea in 2 minutes.",
    "Explain a complex concept to a non-technical audience.",
    "Present your team's project achievements.",
    "Deliver a keynote about industry trends."
  ],
  storytelling: [
    "Share a moment that changed your perspective.",
    "Tell a story about an unexpected adventure.",
    "Describe the most interesting person you've met.",
    "Share a lesson you learned the hard way.",
    "Tell about a time you faced your fears."
  ],
  impromptu: [
    "If you could have dinner with anyone, who and why?",
    "What would you do with a million dollars?",
    "Describe your perfect day from start to finish.",
    "If you could change one thing about the world, what?",
    "What advice would you give your younger self?",
    "Explain why your favorite hobby matters to you."
  ]
}

// Achievement Badges System
const badgeDefinitions = {
  first_session: { icon: '🎬', name: 'First Take', description: 'Complete your first session', condition: (stats) => stats.totalSessions >= 1 },
  five_sessions: { icon: '⭐', name: 'Rising Star', description: 'Complete 5 sessions', condition: (stats) => stats.totalSessions >= 5 },
  ten_sessions: { icon: '🌟', name: 'Dedicated', description: 'Complete 10 sessions', condition: (stats) => stats.totalSessions >= 10 },
  streak_3: { icon: '🔥', name: 'On Fire', description: '3-day practice streak', condition: (stats) => stats.currentStreak >= 3 },
  streak_7: { icon: '💎', name: 'Unstoppable', description: '7-day practice streak', condition: (stats) => stats.currentStreak >= 7 },
  confidence_80: { icon: '💪', name: 'Confident', description: 'Score 80%+ confidence', condition: (stats) => stats.bestConfidence >= 80 },
  confidence_95: { icon: '🏆', name: 'Master', description: 'Score 95%+ confidence', condition: (stats) => stats.bestConfidence >= 95 },
  smile_champion: { icon: '😊', name: 'Smile Champ', description: 'Average 50%+ smiling', condition: (stats) => stats.avgSmiling >= 50 }
}

let breathingInterval = null

// Eye Contact Tracking
let eyeContactGoodFrames = 0
let eyeContactTotalFrames = 0
let lastEyeContactUpdate = 0

// Session Notes Key
const NOTES_KEY = 'confidentspeak_notes'

// Coaching Tips
const coachingTips = {
  smile: { icon: '😊', title: 'Try smiling more!', description: 'A warm smile helps connect with your audience.', type: 'warning' },
  great_smile: { icon: '🌟', title: 'Great energy!', description: 'Your smile is engaging. Keep it up!', type: 'success' },
  no_face: { icon: '👀', title: 'Stay in frame', description: 'Make sure your face is visible for best results.', type: 'warning' },
  nervous: { icon: '💪', title: 'Take a deep breath', description: 'Relax your shoulders and breathe slowly.', type: 'warning' },
  confident: { icon: '🎯', title: 'Looking confident!', description: 'You\'re projecting great confidence!', type: 'success' },
  neutral_too_long: { icon: '🎭', title: 'Add expression', description: 'Vary your expressions to engage your audience.', type: 'info' },
  time_warning: { icon: '⏰', title: 'Time check!', description: 'One minute remaining. Start wrapping up!', type: 'warning' },
  halfway: { icon: '🎯', title: 'Halfway there!', description: 'You\'re doing great. Keep the momentum!', type: 'info' },
  eye_contact: { icon: '👁️', title: 'Look at the camera', description: 'Maintain eye contact with your audience.', type: 'warning' },
  great_eye_contact: { icon: '👍', title: 'Great eye contact!', description: 'You\'re connecting well with your audience!', type: 'success' }
}

let lastTipTime = 0
let currentTipKey = null
const TIP_COOLDOWN = 5000

// ========================================
// Initialization
// ========================================

async function initialize() {
  try {
    loadingText.textContent = 'Loading AI models...'
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
      faceapi.nets.faceExpressionNet.loadFromUri('./models'),
      faceapi.nets.ageGenderNet.loadFromUri('./models')
    ])

    loadingText.textContent = 'Starting camera...'
    await startVideo()
    
  } catch (error) {
    showError('Failed to initialize: ' + error.message)
    console.error('Initialization error:', error)
  }
}

function startVideo() {
  return new Promise((resolve, reject) => {
    const constraints = {
      video: { width: { ideal: 720 }, height: { ideal: 560 }, facingMode: 'user' }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => { video.srcObject = stream; resolve() })
        .catch(reject)
    } else {
      reject(new Error('Camera not supported'))
    }
  })
}

video.addEventListener('loadedmetadata', () => {
  setupCanvas()
  hideLoading()
  updateStatus('active', 'Camera Ready')
  loadHistory()
})

function setupCanvas() {
  canvas = faceapi.createCanvasFromMedia(video)
  videoContainer.appendChild(canvas)
  displaySize = { width: video.videoWidth, height: video.videoHeight }
  faceapi.matchDimensions(canvas, displaySize)
}

function hideLoading() { loading.classList.add('hidden') }

function showError(message) {
  errorDiv.textContent = message
  errorDiv.style.display = 'block'
  loading.classList.add('hidden')
  updateStatus('error', 'Error')
}

function updateStatus(type, text) {
  statusDot.className = `status-dot ${type}`
  statusText.textContent = text
}

// ========================================
// Practice Modes
// ========================================

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (isSessionActive) return
    
    modeBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    
    currentMode = {
      name: btn.dataset.mode,
      duration: parseInt(btn.dataset.duration),
      timeLeft: parseInt(btn.dataset.duration)
    }
  })
})

// ========================================
// Teleprompter
// ========================================

toggleTeleprompterBtn.addEventListener('click', () => {
  teleprompterVisible = !teleprompterVisible
  
  if (teleprompterVisible) {
    teleprompterDisplay.textContent = teleprompterInput.value || 'No notes added yet...'
    teleprompterOverlay.classList.add('active')
    toggleTeleprompterBtn.innerHTML = '<span>👁️</span> Hide'
  } else {
    teleprompterOverlay.classList.remove('active')
    toggleTeleprompterBtn.innerHTML = '<span>👁️</span> Show'
  }
})

clearTeleprompterBtn.addEventListener('click', () => {
  teleprompterInput.value = ''
  teleprompterDisplay.textContent = ''
  if (teleprompterVisible) {
    teleprompterDisplay.textContent = 'No notes added yet...'
  }
})

teleprompterInput.addEventListener('input', () => {
  if (teleprompterVisible) {
    teleprompterDisplay.textContent = teleprompterInput.value || 'No notes added yet...'
  }
})

// ========================================
// Practice Prompts
// ========================================

function getRandomPrompt() {
  const categories = Object.keys(practicePrompts)
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const prompts = practicePrompts[randomCategory]
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
  
  return {
    category: randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1),
    text: randomPrompt
  }
}

function displayNewPrompt() {
  const prompt = getRandomPrompt()
  promptCategory.textContent = prompt.category
  promptText.textContent = prompt.text
  
  // Add a subtle animation
  promptText.style.opacity = '0'
  promptText.style.transform = 'translateY(10px)'
  setTimeout(() => {
    promptText.style.transition = 'all 0.3s ease'
    promptText.style.opacity = '1'
    promptText.style.transform = 'translateY(0)'
  }, 50)
}

newPromptBtn.addEventListener('click', displayNewPrompt)

// ========================================
// Session Management
// ========================================

function startSession() {
  isSessionActive = true
  isPaused = false
  sessionStartTime = Date.now()
  currentMode.timeLeft = currentMode.duration
  
  sessionStats = {
    confidenceScores: [],
    expressions: { happy: [], neutral: [], surprised: [], sad: [] },
    faceDetected: 0,
    totalFrames: 0,
    eyeContactGood: 0,
    eyeContactTotal: 0
  }

  // Reset eye contact tracking
  eyeContactGoodFrames = 0
  eyeContactTotalFrames = 0
  eyeContactIndicator.classList.add('active')

  // UI Updates
  startSessionBtn.style.display = 'none'
  breatheBtn.style.display = 'none'
  endSessionBtn.style.display = 'flex'
  pauseSessionBtn.style.display = 'flex'
  sessionTimer.classList.add('recording')
  updateStatus('active', 'Recording')
  scoreLabel.textContent = 'Analyzing your presentation...'

  // Show countdown for timed modes
  if (currentMode.duration > 0) {
    timeRemaining.classList.add('active')
    updateTimeRemaining()
  }

  // Start timer
  timerInterval = setInterval(updateTimer, 1000)
  
  // Start detection
  startDetection()
  
  showTip('confident')
}

function endSession() {
  isSessionActive = false
  isPaused = false
  
  if (detectionInterval) clearInterval(detectionInterval)
  if (timerInterval) clearInterval(timerInterval)

  // Store eye contact stats before resetting
  sessionStats.eyeContactGood = eyeContactGoodFrames
  sessionStats.eyeContactTotal = eyeContactTotalFrames

  // Hide eye contact indicator
  eyeContactIndicator.classList.remove('active')

  // UI Updates
  startSessionBtn.style.display = 'flex'
  breatheBtn.style.display = 'flex'
  endSessionBtn.style.display = 'none'
  pauseSessionBtn.style.display = 'none'
  sessionTimer.classList.remove('recording')
  timeRemaining.classList.remove('active')
  timeRemaining.classList.remove('warning', 'danger')
  updateStatus('active', 'Camera Ready')

  // Clear notes input
  sessionNotesInput.value = ''

  // Save to history and show summary
  saveSession()
  checkAndUnlockBadges()
  showSessionSummary()
}

function togglePause() {
  isPaused = !isPaused
  
  if (isPaused) {
    pauseSessionBtn.innerHTML = '<span>▶️</span> Resume'
    updateStatus('active', 'Paused')
    if (detectionInterval) clearInterval(detectionInterval)
    if (timerInterval) clearInterval(timerInterval)
  } else {
    pauseSessionBtn.innerHTML = '<span>⏸️</span> Pause'
    updateStatus('active', 'Recording')
    timerInterval = setInterval(updateTimer, 1000)
    startDetection()
  }
}

function updateTimer() {
  const elapsed = Date.now() - sessionStartTime
  const minutes = Math.floor(elapsed / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  // Update countdown for timed modes
  if (currentMode.duration > 0) {
    currentMode.timeLeft = Math.max(0, currentMode.duration - Math.floor(elapsed / 1000))
    updateTimeRemaining()

    // Auto-end when time is up
    if (currentMode.timeLeft <= 0) {
      endSession()
    }

    // Time-based tips
    if (currentMode.timeLeft === 60) showTip('time_warning')
    if (currentMode.timeLeft === Math.floor(currentMode.duration / 2)) showTip('halfway')
  }
}

function updateTimeRemaining() {
  const mins = Math.floor(currentMode.timeLeft / 60)
  const secs = currentMode.timeLeft % 60
  timeRemaining.textContent = `${mins}:${secs.toString().padStart(2, '0')}`

  // Visual warnings
  timeRemaining.classList.remove('warning', 'danger')
  if (currentMode.timeLeft <= 30) {
    timeRemaining.classList.add('danger')
  } else if (currentMode.timeLeft <= 60) {
    timeRemaining.classList.add('warning')
  }
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// ========================================
// Face Detection
// ========================================

function startDetection() {
  if (detectionInterval) clearInterval(detectionInterval)

  detectionInterval = setInterval(async () => {
    if (!isPaused) await detectFaces()
  }, 100)
}

async function detectFaces() {
  try {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))      .withFaceLandmarks()
      .withFaceExpressions()

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)

    if (resizedDetections.length > 0) {
      resizedDetections.forEach(detection => {
        const box = detection.detection.box
        context.strokeStyle = 'rgba(74, 222, 128, 0.6)'
        context.lineWidth = 2
        context.strokeRect(box.x, box.y, box.width, box.height)
      })
    }

    if (isSessionActive) {
      sessionStats.totalFrames++
      
      if (resizedDetections.length > 0) {
        sessionStats.faceDetected++
        updateMetrics(resizedDetections[0])
        
        // Eye contact detection using face landmarks
        checkEyeContact(resizedDetections[0])
      } else {
        showTip('no_face')
        updateEyeContactIndicator(false)
      }
    }

  } catch (error) {
    console.error('Detection error:', error)
  }
}

function updateMetrics(detection) {
  const expressions = detection.expressions
  
  const happy = Math.round(expressions.happy * 100)
  const neutral = Math.round(expressions.neutral * 100)
  const surprised = Math.round(expressions.surprised * 100)
  const sad = Math.round((expressions.sad + expressions.fearful) * 50)

  happyBar.style.width = `${happy}%`
  happyValue.textContent = `${happy}%`
  neutralBar.style.width = `${neutral}%`
  neutralValue.textContent = `${neutral}%`
  surprisedBar.style.width = `${surprised}%`
  surprisedValue.textContent = `${surprised}%`
  sadBar.style.width = `${sad}%`
  sadValue.textContent = `${sad}%`

  sessionStats.expressions.happy.push(happy)
  sessionStats.expressions.neutral.push(neutral)
  sessionStats.expressions.surprised.push(surprised)
  sessionStats.expressions.sad.push(sad)

  const positiveScore = (expressions.happy * 40) + (expressions.neutral * 30) + (expressions.surprised * 15)
  const negativeScore = (expressions.sad * 20) + (expressions.fearful * 25) + (expressions.angry * 20)
  const detectionConfidence = detection.detection.score * 15
  
  let confidence = Math.min(100, Math.max(0, (positiveScore - negativeScore + detectionConfidence + 50)))
  confidence = Math.round(confidence)
  
  sessionStats.confidenceScores.push(confidence)
  updateConfidenceScore(confidence)
  generateCoachingTip(expressions, confidence)
}

function updateConfidenceScore(score) {
  const recentScores = sessionStats.confidenceScores.slice(-10)
  const avgScore = Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
  
  confidenceScore.textContent = avgScore
  scoreCircle.style.setProperty('--score', avgScore)
  
  let color = '#4ade80'
  if (avgScore < 40) color = '#ef4444'
  else if (avgScore < 60) color = '#fbbf24'
  
  scoreCircle.style.background = `conic-gradient(${color} 0deg, ${color} ${avgScore * 3.6}deg, rgba(255,255,255,0.1) ${avgScore * 3.6}deg)`

  if (avgScore >= 80) scoreLabel.textContent = 'Excellent! You\'re killing it! 🔥'
  else if (avgScore >= 60) scoreLabel.textContent = 'Good job! Keep the energy up!'
  else if (avgScore >= 40) scoreLabel.textContent = 'Try smiling more!'
  else scoreLabel.textContent = 'Relax and take a deep breath.'
}

function generateCoachingTip(expressions, confidence) {
  const now = Date.now()
  if (now - lastTipTime < TIP_COOLDOWN) return

  let tipKey = null

  if (expressions.happy > 0.5) tipKey = 'great_smile'
  else if (expressions.happy < 0.1 && expressions.neutral > 0.7) tipKey = 'neutral_too_long'
  else if (expressions.happy < 0.15 && confidence < 50) tipKey = 'smile'
  else if (expressions.fearful > 0.3 || expressions.sad > 0.3) tipKey = 'nervous'
  else if (confidence > 75) tipKey = 'confident'

  if (tipKey && tipKey !== currentTipKey) {
    showTip(tipKey)
    currentTipKey = tipKey
    lastTipTime = now
  }
}

function showTip(tipKey) {
  const tip = coachingTips[tipKey]
  if (!tip) return

  tipsContainer.innerHTML = `
    <div class="tip-card ${tip.type || ''}">
      <span class="tip-icon">${tip.icon}</span>
      <div class="tip-content">
        <div class="tip-title">${tip.title}</div>
        <div class="tip-description">${tip.description}</div>
      </div>
    </div>
  `
}

// ========================================
// Eye Contact Detection
// ========================================

function checkEyeContact(detection) {
  const landmarks = detection.landmarks
  const positions = landmarks.positions
  
  // Get face bounding box
  const box = detection.detection.box
  const faceCenterX = box.x + box.width / 2
  const faceCenterY = box.y + box.height / 2
  
  // Get video center
  const videoCenterX = displaySize.width / 2
  const videoCenterY = displaySize.height / 2
  
  // Calculate how far off-center the face is (as a percentage)
  const offsetX = Math.abs(faceCenterX - videoCenterX) / (displaySize.width / 2)
  const offsetY = Math.abs(faceCenterY - videoCenterY) / (displaySize.height / 2)
  
  // Get nose position to detect head rotation
  const nose = positions[30] // Tip of nose
  const leftEye = landmarks.getLeftEye()
  const rightEye = landmarks.getRightEye()
  
  // Calculate eye centers
  const leftEyeCenter = {
    x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
    y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length
  }
  const rightEyeCenter = {
    x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
    y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length
  }
  
  // Check if nose is relatively centered between eyes (indicates looking forward)
  const eyeMidpointX = (leftEyeCenter.x + rightEyeCenter.x) / 2
  const noseOffset = Math.abs(nose.x - eyeMidpointX) / box.width
  
  // Good eye contact: face centered, not rotated too much
  const isGoodEyeContact = offsetX < 0.4 && offsetY < 0.5 && noseOffset < 0.15
  
  eyeContactTotalFrames++
  if (isGoodEyeContact) {
    eyeContactGoodFrames++
  }
  
  updateEyeContactIndicator(isGoodEyeContact)
  
  // Generate eye contact tips periodically
  const now = Date.now()
  if (now - lastEyeContactUpdate > 3000) {
    const recentGoodRatio = eyeContactGoodFrames / Math.max(1, eyeContactTotalFrames)
    if (recentGoodRatio < 0.5 && eyeContactTotalFrames > 20) {
      // Only show tip if not showing another tip recently
      if (now - lastTipTime > TIP_COOLDOWN) {
        showTip('eye_contact')
        lastTipTime = now
      }
    } else if (recentGoodRatio > 0.8 && eyeContactTotalFrames > 30) {
      if (now - lastTipTime > TIP_COOLDOWN * 2) {
        showTip('great_eye_contact')
        lastTipTime = now
      }
    }
    lastEyeContactUpdate = now
  }
}

function updateEyeContactIndicator(isGood) {
  eyeContactIndicator.classList.remove('good', 'poor')
  
  if (isGood) {
    eyeContactIndicator.classList.add('good')
    eyeContactText.textContent = 'Good eye contact!'
  } else {
    eyeContactIndicator.classList.add('poor')
    eyeContactText.textContent = 'Look at camera'
  }
}

// ========================================
// Session History
// ========================================

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
  } catch {
    return []
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

function getStreak() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY)) || { count: 0, lastDate: null }
  } catch {
    return { count: 0, lastDate: null }
  }
}

function saveStreak(streak) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak))
}

function updateStreak() {
  const streak = getStreak()
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  if (streak.lastDate === today) {
    // Already practiced today
    return streak
  } else if (streak.lastDate === yesterday) {
    // Continuing streak
    streak.count++
    streak.lastDate = today
  } else {
    // Streak broken or first session
    streak.count = 1
    streak.lastDate = today
  }

  saveStreak(streak)
  return streak
}

function saveSession() {
  const duration = Date.now() - sessionStartTime
  
  const avgConfidence = sessionStats.confidenceScores.length > 0
    ? Math.round(sessionStats.confidenceScores.reduce((a, b) => a + b, 0) / sessionStats.confidenceScores.length)
    : 0

  const avgHappy = sessionStats.expressions.happy.length > 0
    ? Math.round(sessionStats.expressions.happy.reduce((a, b) => a + b, 0) / sessionStats.expressions.happy.length)
    : 0

  const session = {
    id: Date.now(),
    date: new Date().toISOString(),
    mode: currentMode.name,
    duration: duration,
    confidence: avgConfidence,
    smiling: avgHappy,
    engagement: avgConfidence >= 70 && avgHappy >= 20 ? 'High' : avgConfidence >= 50 ? 'Medium' : 'Low'
  }

  const history = getHistory()
  history.unshift(session)
  
  // Keep only last 50 sessions
  if (history.length > 50) history.pop()
  
  saveHistory(history)
  updateStreak()
}

function loadHistory() {
  renderHistory()
  renderBadges()
}

function renderHistory() {
  const history = getHistory()
  const streak = getStreak()

  // Streak badge
  if (streak.count > 0) {
    streakContainer.innerHTML = `
      <div class="streak-badge">
        <span class="streak-fire">🔥</span>
        <span class="streak-text">Current Streak:</span>
        <span class="streak-count">${streak.count} day${streak.count > 1 ? 's' : ''}</span>
      </div>
    `
  } else {
    streakContainer.innerHTML = ''
  }

  // History list
  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No sessions yet. Start practicing!</div>'
    return
  }

  historyList.innerHTML = history.slice(0, 10).map(session => {
    const date = new Date(session.date)
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const notesHtml = session.notes ? `<div class="history-item-notes">📝 ${session.notes}</div>` : ''
    
    return `
      <div class="history-item">
        <div>
          <div>${getModeEmoji(session.mode)} ${formatDuration(session.duration)}</div>
          <div class="history-date">${dateStr} at ${timeStr}</div>
          ${notesHtml}
        </div>
        <div class="history-score">${session.confidence}%</div>
      </div>
    `
  }).join('')
}

function getModeEmoji(mode) {
  const emojis = { elevator: '⚡', intro: '👋', presentation: '🎯', unlimited: '♾️' }
  return emojis[mode] || '🎤'
}

function clearHistory() {
  if (confirm('Clear all session history? This cannot be undone.')) {
    localStorage.removeItem(HISTORY_KEY)
    localStorage.removeItem(STREAK_KEY)
    renderHistory()
  }
}

// ========================================
// Achievement Badges
// ========================================

function getBadges() {
  try {
    return JSON.parse(localStorage.getItem(BADGES_KEY)) || {}
  } catch {
    return {}
  }
}

function saveBadges(badges) {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges))
}

function getPlayerStats() {
  const history = getHistory()
  const streak = getStreak()
  const badges = getBadges()
  
  const totalSessions = history.length
  const currentStreak = streak.count
  const bestConfidence = history.length > 0 ? Math.max(...history.map(s => s.confidence)) : 0
  const avgSmiling = history.length > 0 
    ? Math.round(history.reduce((sum, s) => sum + (s.smiling || 0), 0) / history.length)
    : 0

  return { totalSessions, currentStreak, bestConfidence, avgSmiling, unlockedBadges: badges }
}

function checkAndUnlockBadges() {
  const stats = getPlayerStats()
  const badges = getBadges()
  let newBadgesUnlocked = []

  Object.entries(badgeDefinitions).forEach(([key, badge]) => {
    if (!badges[key] && badge.condition(stats)) {
      badges[key] = { unlockedAt: new Date().toISOString(), isNew: true }
      newBadgesUnlocked.push(badge)
    }
  })

  saveBadges(badges)
  renderBadges()

  // Show notification for new badges
  if (newBadgesUnlocked.length > 0) {
    setTimeout(() => {
      alert(`🎉 Badge Unlocked: ${newBadgesUnlocked.map(b => b.name).join(', ')}!`)
    }, 500)
  }
}

function renderBadges() {
  const badges = getBadges()
  
  badgesGrid.innerHTML = Object.entries(badgeDefinitions).map(([key, badge]) => {
    const isUnlocked = badges[key]
    const isNew = isUnlocked && badges[key].isNew
    
    return `
      <div class="badge ${isUnlocked ? 'unlocked' : 'locked'} ${isNew ? 'new' : ''}" data-badge="${key}">
        <span class="badge-icon">${badge.icon}</span>
        <span class="badge-name">${badge.name}</span>
        <div class="badge-tooltip">${badge.description}</div>
      </div>
    `
  }).join('')

  // Mark new badges as seen after render
  Object.keys(badges).forEach(key => {
    if (badges[key].isNew) {
      badges[key].isNew = false
    }
  })
  saveBadges(badges)
}

// ========================================
// Confetti Celebration
// ========================================

function launchConfetti() {
  const colors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#ef4444']
  const confettiCount = 100
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti'
    confetti.style.left = `${Math.random() * 100}%`
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.width = `${Math.random() * 10 + 5}px`
    confetti.style.height = `${Math.random() * 10 + 5}px`
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
    confetti.style.animationDelay = `${Math.random() * 0.5}s`
    confetti.style.animationDuration = `${Math.random() * 2 + 2}s`
    
    confettiContainer.appendChild(confetti)
    
    // Trigger animation
    setTimeout(() => confetti.classList.add('active'), 10)
    
    // Remove after animation
    setTimeout(() => confetti.remove(), 4000)
  }
}

// ========================================
// Breathing Exercise
// ========================================

function startBreathingExercise() {
  breathingModal.classList.add('active')
  
  const totalDuration = 24000 // 24 seconds (3 breath cycles)
  const cycleTime = 8000 // 8 seconds per cycle
  let elapsed = 0
  
  // Update breathing text based on phase
  function updateBreathingPhase() {
    const cyclePosition = elapsed % cycleTime
    
    if (cyclePosition < 4000) {
      breathingText.textContent = 'Breathe In'
      breathingText.style.color = '#4ade80'
    } else {
      breathingText.textContent = 'Breathe Out'
      breathingText.style.color = '#60a5fa'
    }
  }
  
  // Start the exercise
  updateBreathingPhase()
  
  breathingInterval = setInterval(() => {
    elapsed += 100
    
    // Update progress bar
    const progress = (elapsed / totalDuration) * 100
    breathingProgress.style.width = `${progress}%`
    
    // Update breathing phase
    updateBreathingPhase()
    
    // End exercise
    if (elapsed >= totalDuration) {
      endBreathingExercise(true)
    }
  }, 100)
}

function endBreathingExercise(autoStart = false) {
  if (breathingInterval) {
    clearInterval(breathingInterval)
    breathingInterval = null
  }
  
  breathingModal.classList.remove('active')
  breathingProgress.style.width = '0%'
  
  if (autoStart) {
    // Small delay before starting session
    setTimeout(() => {
      startSession()
    }, 300)
  }
}

skipBreathingBtn.addEventListener('click', () => {
  endBreathingExercise(true)
})

breatheBtn.addEventListener('click', () => {
  startBreathingExercise()
})

// ========================================
// Session Summary
// ========================================

function showSessionSummary() {
  const duration = Date.now() - sessionStartTime
  
  const avgConfidence = sessionStats.confidenceScores.length > 0
    ? Math.round(sessionStats.confidenceScores.reduce((a, b) => a + b, 0) / sessionStats.confidenceScores.length)
    : 0

  const avgHappy = sessionStats.expressions.happy.length > 0
    ? Math.round(sessionStats.expressions.happy.reduce((a, b) => a + b, 0) / sessionStats.expressions.happy.length)
    : 0

  // Calculate eye contact percentage
  const eyeContactPercent = eyeContactTotalFrames > 0
    ? Math.round((eyeContactGoodFrames / eyeContactTotalFrames) * 100)
    : 0

  let engagement = 'Low'
  if (avgConfidence >= 70 && avgHappy >= 20) engagement = 'High'
  else if (avgConfidence >= 50 || avgHappy >= 15) engagement = 'Medium'

  summaryScore.textContent = avgConfidence
  summaryDuration.textContent = formatDuration(duration)
  summarySmiles.textContent = `${avgHappy}%`
  summaryEngagement.textContent = engagement

  let feedback = ''
  if (avgConfidence >= 80) {
    feedback = '🌟 Outstanding! You projected confidence and warmth!'
    // Launch confetti for high scores!
    setTimeout(() => launchConfetti(), 300)
  } else if (avgConfidence >= 60) {
    feedback = '👍 Good job! Try smiling more for even better results.'
  } else if (avgConfidence >= 40) {
    feedback = '💪 You\'re improving! Focus on relaxing and positive expressions.'
  } else {
    feedback = '🎯 Keep practicing! Remember to breathe and smile.'
  }
  
  // Add eye contact feedback
  if (eyeContactPercent >= 70) {
    feedback += `<br><span style="color: #4ade80;">👁️ Excellent eye contact: ${eyeContactPercent}%</span>`
  } else if (eyeContactPercent >= 40) {
    feedback += `<br><span style="color: #fbbf24;">👁️ Eye contact: ${eyeContactPercent}% - Try looking at the camera more!</span>`
  } else if (eyeContactTotalFrames > 0) {
    feedback += `<br><span style="color: #f87171;">👁️ Eye contact: ${eyeContactPercent}% - Focus on the camera next time!</span>`
  }
  
  summaryFeedback.innerHTML = `<p>${feedback}</p>`

  // Show streak info
  const streak = getStreak()
  if (streak.count > 1) {
    summaryFeedback.innerHTML += `<p style="margin-top: 0.5rem; color: #fbbf24;">🔥 ${streak.count} day streak!</p>`
  }

  summaryModal.classList.add('active')
}

function closeModal() {
  // Save notes if entered
  const notes = sessionNotesInput.value.trim()
  if (notes) {
    saveSessionNotes(notes)
  }
  summaryModal.classList.remove('active')
}

function saveSessionNotes(notes) {
  const history = getHistory()
  if (history.length > 0) {
    history[0].notes = notes
    saveHistory(history)
  }
}

function resetSession() {
  closeModal()
  timerDisplay.textContent = '00:00'
  confidenceScore.textContent = '0'
  scoreCircle.style.setProperty('--score', 0)
  scoreLabel.textContent = 'Start a session to see your score'
  
  happyBar.style.width = '0%'
  happyValue.textContent = '0%'
  neutralBar.style.width = '0%'
  neutralValue.textContent = '0%'
  surprisedBar.style.width = '0%'
  surprisedValue.textContent = '0%'
  sadBar.style.width = '0%'
  sadValue.textContent = '0%'

  tipsContainer.innerHTML = `
    <div class="tip-card">
      <span class="tip-icon">👋</span>
      <div class="tip-content">
        <div class="tip-title">Ready for another round?</div>
        <div class="tip-description">Click "Start Session" to begin!</div>
      </div>
    </div>
  `
}

// ========================================
// Event Listeners
// ========================================

startAppBtn.addEventListener('click', () => welcomeScreen.classList.add('hidden'))

startSessionBtn.addEventListener('click', startSession)
endSessionBtn.addEventListener('click', endSession)
pauseSessionBtn.addEventListener('click', togglePause)

closeModalBtn.addEventListener('click', closeModal)
newSessionBtn.addEventListener('click', () => { resetSession(); startSession() })

// History Modal
historyBtn.addEventListener('click', () => { renderHistory(); historyModal.classList.add('active') })
closeHistoryBtn.addEventListener('click', () => historyModal.classList.remove('active'))
clearHistoryBtn.addEventListener('click', clearHistory)

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (welcomeScreen.classList.contains('hidden') && !historyModal.classList.contains('active') && !summaryModal.classList.contains('active')) {
    if (e.code === 'Space') {
      e.preventDefault()
      if (isSessionActive) togglePause()
      else startSession()
    } else if (e.code === 'Escape' && isSessionActive) {
      endSession()
    } else if (e.code === 'KeyT') {
      toggleTeleprompterBtn.click()
    }
  }
})

// Error handling
video.addEventListener('error', (e) => showError('Video error: ' + e.message))
window.addEventListener('error', (e) => showError('Application error: ' + e.message))

// ========================================
// Start Application
// ========================================

initialize()
