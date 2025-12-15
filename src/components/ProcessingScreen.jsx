import React from 'react'

function ProcessingScreen() {
  return (
    <div className="processing-screen">
      <video
        className="processing-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/loading.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

export default ProcessingScreen
