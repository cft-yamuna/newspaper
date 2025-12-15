import React from 'react'

function ProcessingScreen() {
  return (
    <div className="processing-screen">
      <div className="processing-content">
        <div className="spinner"></div>
        <h2 className="processing-title">Processing Your Photo...</h2>
        <p className="processing-subtitle">Please wait while we create your newspaper cover</p>
      </div>
    </div>
  )
}

export default ProcessingScreen
