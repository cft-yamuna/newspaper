import React from 'react'

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
        <button className="start-button" onClick={onStart}>
          Tap to Play
        </button>
    </div>
  )
}

export default StartScreen
