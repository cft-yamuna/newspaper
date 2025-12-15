import React, { useRef, useEffect, useState } from 'react'

function CaptureScreen({ onCapture, onBack }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [countdown, setCountdown] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Unable to access camera. Please make sure you have granted camera permissions.')
    }
  }

  const handleCapture = () => {
    if (isCapturing) return
    setIsCapturing(true)

    let count = 3
    setCountdown(count)

    const countdownInterval = setInterval(() => {
      count--
      if (count > 0) {
        setCountdown(count)
      } else {
        clearInterval(countdownInterval)
        setCountdown(null)
        capturePhoto()
      }
    }, 1000)
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (video && canvas) {
      const context = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Mirror the image horizontally for selfie mode
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = canvas.toDataURL('image/png')

      // Stop the camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      onCapture(imageData)
    }
    setIsCapturing(false)
  }

  return (
    <div className="capture-screen">
      <div className="camera-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />
        {countdown && (
          <div className="countdown-overlay">
            <span className="countdown-number">{countdown}</span>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <div className="capture-controls">
        <button className="back-button" onClick={onBack}>
          Back
        </button>
        <button
          className="capture-button"
          onClick={handleCapture}
          disabled={isCapturing}
        >
          {isCapturing ? 'Capturing...' : 'Capture'}
        </button>
      </div>
    </div>
  )
}

export default CaptureScreen
