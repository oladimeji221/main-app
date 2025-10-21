import { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Video, 
  X, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  MapPin,
  Clock,
  Zap
} from 'lucide-react'

const ModernCamera = ({ isOpen, onClose, onCapture, reportType = 'safety' }) => {
  const [mode, setMode] = useState('photo') // 'photo' or 'video'
  const [isRecording, setIsRecording] = useState(false)
  const [capturedMedia, setCapturedMedia] = useState(null)
  const [mediaType, setMediaType] = useState(null)
  const [stream, setStream] = useState(null)
  const [facingMode, setFacingMode] = useState('environment') // 'user' or 'environment'
  const [location, setLocation] = useState('Detecting location...')
  const [cameraError, setCameraError] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordingIntervalRef = useRef(null)

  // Get user location
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        },
        () => setLocation('Location unavailable')
      )
    }
  }, [isOpen])

  // Initialize camera
  useEffect(() => {
    if (isOpen && !capturedMedia) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [isOpen, facingMode, capturedMedia])

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: mode === 'video'
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setCameraError('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      setCapturedMedia(url)
      setMediaType('photo')
      stopCamera()
    }, 'image/jpeg', 0.9)
  }

  const startVideoRecording = async () => {
    if (!stream) return

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })
      
      const chunks = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setCapturedMedia(url)
        setMediaType('video')
        stopCamera()
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting video recording:', error)
      alert('Unable to start video recording')
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(recordingIntervalRef.current)
    }
  }

  const handleCapture = () => {
    if (mode === 'photo') {
      capturePhoto()
    } else {
      if (isRecording) {
        stopVideoRecording()
      } else {
        startVideoRecording()
      }
    }
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const retake = () => {
    setCapturedMedia(null)
    setMediaType(null)
    setRecordingTime(0)
    startCamera()
  }

  const confirmCapture = () => {
    if (capturedMedia) {
      onCapture({
        url: capturedMedia,
        type: mediaType,
        location: location,
        timestamp: new Date().toISOString(),
        reportType: reportType
      })
      onClose()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="modern-camera-overlay">
      <div className="camera-container">
        {/* Header */}
        <div className="camera-header">
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
          <div className="camera-title">
            <AlertTriangle size={20} />
            <span>Safety Report</span>
          </div>
          <div className="camera-mode">
            <button 
              onClick={() => setMode('photo')} 
              className={mode === 'photo' ? 'active' : ''}
            >
              <Camera size={20} />
            </button>
            <button 
              onClick={() => setMode('video')} 
              className={mode === 'video' ? 'active' : ''}
            >
              <Video size={20} />
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="camera-view">
          {!capturedMedia ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="camera-video"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {/* Camera Error Message */}
              {cameraError && (
                <div className="camera-error">
                  <AlertTriangle size={32} />
                  <p>{cameraError}</p>
                  <button onClick={startCamera}>Try Again</button>
                </div>
              )}

              {/* Recording indicator */}
              {isRecording && (
                <div className="recording-indicator">
                  <div className="recording-dot"></div>
                  <span>REC {formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Location overlay */}
              <div className="location-overlay">
                <MapPin size={16} />
                <span>{location}</span>
              </div>

              {/* Timestamp overlay */}
              <div className="timestamp-overlay">
                <Clock size={16} />
                <span>{new Date().toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="media-preview">
              {mediaType === 'photo' ? (
                <img src={capturedMedia} alt="Captured" className="captured-media" />
              ) : (
                <video src={capturedMedia} controls className="captured-media" />
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="camera-controls">
          {!capturedMedia ? (
            <>
              <button onClick={switchCamera} className="control-btn secondary">
                <RotateCcw size={24} />
              </button>
              
              <button 
                onClick={handleCapture} 
                className={`capture-btn ${isRecording ? 'recording' : ''}`}
              >
                {mode === 'photo' ? (
                  <Camera size={32} />
                ) : isRecording ? (
                  <div className="stop-icon"></div>
                ) : (
                  <Video size={32} />
                )}
              </button>
              
              <div className="control-spacer"></div>
            </>
          ) : (
            <>
              <button onClick={retake} className="control-btn secondary">
                <RotateCcw size={24} />
                <span>Retake</span>
              </button>
              
              <button onClick={confirmCapture} className="control-btn primary">
                <Check size={24} />
                <span>Use {mediaType}</span>
              </button>
            </>
          )}
        </div>

        {/* Emergency quick actions */}
        <div className="emergency-actions">
          <button className="emergency-btn fire">
            🔥 Fire
          </button>
          <button className="emergency-btn medical">
            🏥 Medical
          </button>
          <button className="emergency-btn security">
            🚨 Security
          </button>
          <button className="emergency-btn traffic">
            🚗 Traffic
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModernCamera
