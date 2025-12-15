import React from 'react'

function PreviewScreen({ capturedImage, onRetake, onSubmit }) {
  return (
    <div className="preview-screen">
      <h2 className="preview-title">Preview Your Photo</h2>
      <div className="preview-container">
        <img src={capturedImage} alt="Captured" className="preview-image" />
      </div>
      <div className="preview-controls">
        <button className="retake-button" onClick={onRetake}>
          Retake
        </button>
        <button className="submit-button" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  )
}

export default PreviewScreen
