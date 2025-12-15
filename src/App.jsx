import { useState } from 'react'
import StartScreen from './components/StartScreen'
import CaptureScreen from './components/CaptureScreen'
import PreviewScreen from './components/PreviewScreen'
import ProcessingScreen from './components/ProcessingScreen'
import OutputScreen from './components/OutputScreen'
import './App.css'

const SCREENS = {
  START: 'start',
  CAPTURE: 'capture',
  PREVIEW: 'preview',
  PROCESSING: 'processing',
  OUTPUT: 'output'
}

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.START)
  const [capturedImage, setCapturedImage] = useState(null)

  const handleStart = () => {
    setCurrentScreen(SCREENS.CAPTURE)
  }

  const handleCapture = (imageData) => {
    setCapturedImage(imageData)
    setCurrentScreen(SCREENS.PREVIEW)
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setCurrentScreen(SCREENS.CAPTURE)
  }

  const handleSubmit = () => {
    setCurrentScreen(SCREENS.PROCESSING)
    // Short delay to show processing screen, then move to output
    setTimeout(() => {
      setCurrentScreen(SCREENS.OUTPUT)
    }, 1500)
  }

  const handleRestart = () => {
    setCapturedImage(null)
    setCurrentScreen(SCREENS.START)
  }

  const handleBackToStart = () => {
    setCapturedImage(null)
    setCurrentScreen(SCREENS.START)
  }

  return (
    <div className="app">
      {currentScreen === SCREENS.START && (
        <StartScreen onStart={handleStart} />
      )}

      {currentScreen === SCREENS.CAPTURE && (
        <CaptureScreen onCapture={handleCapture} onBack={handleBackToStart} />
      )}

      {currentScreen === SCREENS.PREVIEW && (
        <PreviewScreen
          capturedImage={capturedImage}
          onRetake={handleRetake}
          onSubmit={handleSubmit}
        />
      )}

      {currentScreen === SCREENS.PROCESSING && (
        <ProcessingScreen />
      )}

      {currentScreen === SCREENS.OUTPUT && (
        <OutputScreen capturedImage={capturedImage} onRestart={handleRestart} />
      )}
    </div>
  )
}

export default App
