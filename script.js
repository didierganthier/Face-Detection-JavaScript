// DOM Elements
const video = document.getElementById('video')
const loading = document.getElementById('loading')
const videoContainer = document.getElementById('videoContainer')
const controls = document.getElementById('controls')
const infoPanel = document.getElementById('infoPanel')
const errorDiv = document.getElementById('error')
const statusDot = document.getElementById('statusDot')
const statusText = document.getElementById('statusText')

// Control buttons
const detectionBtn = document.getElementById('detectionBtn')
const landmarksBtn = document.getElementById('landmarksBtn')
const expressionsBtn = document.getElementById('expressionsBtn')

// Stats elements
const faceCountEl = document.getElementById('faceCount')
const fpsEl = document.getElementById('fps')
const confidenceEl = document.getElementById('confidence')
const dominantExpressionEl = document.getElementById('dominantExpression')

// State
let canvas
let displaySize
let detectionInterval
let fpsCounter = 0
let lastFpsUpdate = Date.now()

// Settings
const settings = {
  showDetection: true,
  showLandmarks: true,
  showExpressions: true,
  detectionInterval: 100
}

// Initialize the application
async function initialize() {
  try {
    statusText.textContent = 'Loading AI models...'
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
      faceapi.nets.faceExpressionNet.loadFromUri('./models')
    ])

    statusText.textContent = 'Starting camera...'
    await startVideo()
    
  } catch (error) {
    showError('Failed to initialize: ' + error.message)
    console.error('Initialization error:', error)
  }
}

function startVideo() {
  return new Promise((resolve, reject) => {
    const constraints = {
      video: {
        width: { ideal: 720 },
        height: { ideal: 560 },
        facingMode: 'user'
      }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          video.srcObject = stream
          resolve()
        })
        .catch(reject)
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(constraints, 
        stream => {
          video.srcObject = stream
          resolve()
        },
        reject
      )
    } else {
      reject(new Error('Camera not supported'))
    }
  })
}

video.addEventListener('loadedmetadata', () => {
  setupCanvas()
  hideLoading()
  showInterface()
  startDetection()
  updateStatus('active', 'Camera Active')
})

function setupCanvas() {
  canvas = faceapi.createCanvasFromMedia(video)
  videoContainer.appendChild(canvas)
  displaySize = { width: video.videoWidth, height: video.videoHeight }
  faceapi.matchDimensions(canvas, displaySize)
}

function hideLoading() {
  loading.style.display = 'none'
}

function showInterface() {
  videoContainer.style.display = 'block'
  controls.style.display = 'flex'
  infoPanel.style.display = 'block'
}

function showError(message) {
  errorDiv.textContent = message
  errorDiv.style.display = 'block'
  loading.style.display = 'none'
  updateStatus('error', 'Error')
}

function updateStatus(type, text) {
  statusDot.className = `status-dot ${type}`
  statusText.textContent = text
}

function startDetection() {
  if (detectionInterval) {
    clearInterval(detectionInterval)
  }

  detectionInterval = setInterval(async () => {
    await detectFaces()
    updateFPS()
  }, settings.detectionInterval)
}

async function detectFaces() {
  try {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceExpressions()

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    
    // Clear canvas
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Draw based on settings
    if (settings.showDetection && resizedDetections.length > 0) {
      faceapi.draw.drawDetections(canvas, resizedDetections)
    }
    
    if (settings.showLandmarks && resizedDetections.length > 0) {
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    }
    
    if (settings.showExpressions && resizedDetections.length > 0) {
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }

    // Update statistics
    updateStats(resizedDetections)

  } catch (error) {
    console.error('Detection error:', error)
  }
}

function updateStats(detections) {
  // Update face count
  faceCountEl.textContent = detections.length

  // Update confidence
  if (detections.length > 0) {
    const avgConfidence = detections.reduce((sum, det) => sum + det.detection.score, 0) / detections.length
    confidenceEl.textContent = Math.round(avgConfidence * 100) + '%'

    // Update dominant expression
    if (detections[0].expressions) {
      const expressions = detections[0].expressions
      const dominant = Object.keys(expressions).reduce((a, b) => 
        expressions[a] > expressions[b] ? a : b
      )
      dominantExpressionEl.innerHTML = `Dominant expression: <strong>${dominant}</strong>`
    }
  } else {
    confidenceEl.textContent = '0%'
    dominantExpressionEl.innerHTML = 'Dominant expression: <strong>None</strong>'
  }
}

function updateFPS() {
  fpsCounter++
  const now = Date.now()
  if (now - lastFpsUpdate >= 1000) {
    fpsEl.textContent = fpsCounter
    fpsCounter = 0
    lastFpsUpdate = now
  }
}

// Control button event listeners
detectionBtn.addEventListener('click', () => {
  settings.showDetection = !settings.showDetection
  detectionBtn.classList.toggle('active', settings.showDetection)
})

landmarksBtn.addEventListener('click', () => {
  settings.showLandmarks = !settings.showLandmarks
  landmarksBtn.classList.toggle('active', settings.showLandmarks)
})

expressionsBtn.addEventListener('click', () => {
  settings.showExpressions = !settings.showExpressions
  expressionsBtn.classList.toggle('active', settings.showExpressions)
})

// Error handling
video.addEventListener('error', (e) => {
  showError('Video error: ' + e.message)
})

window.addEventListener('error', (e) => {
  showError('Application error: ' + e.message)
})

// Start the application
initialize()