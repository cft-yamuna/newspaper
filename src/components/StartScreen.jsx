import React from 'react'

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="start-title">OnePlus Times</h1>
        <p className="start-subtitle">Capture Your Moment</p>
        <button className="start-button" onClick={onStart}>
          START
        </button>
      </div>
    </div>
  )
}

export default StartScreen
