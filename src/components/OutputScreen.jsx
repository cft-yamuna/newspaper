import React, { useEffect, useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../supabaseClient'

function OutputScreen({ capturedImage, onRestart }) {
  const [outputImage, setOutputImage] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [hasPublicUrl, setHasPublicUrl] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    createNewspaperImage()
  }, [capturedImage])

  const createNewspaperImage = async () => {
    try {
      setIsLoading(true)

      // Load the newspaper template
      const newspaperImg = new Image()
      newspaperImg.crossOrigin = 'anonymous'

      await new Promise((resolve, reject) => {
        newspaperImg.onload = resolve
        newspaperImg.onerror = reject
        newspaperImg.src = '/newspaper.png'
      })

      // Load the captured user image
      const userImg = new Image()
      await new Promise((resolve, reject) => {
        userImg.onload = resolve
        userImg.onerror = reject
        userImg.src = capturedImage
      })

      // Create canvas with fixed dimensions (842px × 1191px)
      const canvas = canvasRef.current
      const CANVAS_WIDTH = 842
      const CANVAS_HEIGHT = 1191

      canvas.width = CANVAS_WIDTH
      canvas.height = CANVAS_HEIGHT

      const ctx = canvas.getContext('2d')

      // Draw the newspaper template first (full canvas)
      ctx.drawImage(newspaperImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // User image overlay position and size
      const userImageX = 227.01
      const userImageY = 365.37
      const userImageWidth = 366.78
      const userImageHeight = 446.03

      // Calculate crop to fill the target area while maintaining aspect ratio
      const userAspectRatio = userImg.width / userImg.height
      const targetAspectRatio = userImageWidth / userImageHeight

      let srcX = 0, srcY = 0, srcWidth = userImg.width, srcHeight = userImg.height

      if (userAspectRatio > targetAspectRatio) {
        // User image is wider - crop sides
        srcWidth = userImg.height * targetAspectRatio
        srcX = (userImg.width - srcWidth) / 2
      } else {
        // User image is taller - crop top/bottom
        srcHeight = userImg.width / targetAspectRatio
        srcY = (userImg.height - srcHeight) / 2
      }

      // Draw the user's photo overlaid on the newspaper at the specified position
      ctx.drawImage(userImg, srcX, srcY, srcWidth, srcHeight, userImageX, userImageY, userImageWidth, userImageHeight)

      // Convert canvas to blob and upload to Supabase
      canvas.toBlob(async (blob) => {
        try {
          const fileName = `newspaper_${Date.now()}.png`

          // Upload to Supabase Storage
          const { data, error: uploadError } = await supabase.storage
            .from('newspaper-photos')
            .upload(fileName, blob, {
              contentType: 'image/png',
              cacheControl: '3600'
            })

          if (uploadError) {
            console.error('Upload error:', uploadError)
            // If bucket doesn't exist or other error, use local data URL
            const dataUrl = canvas.toDataURL('image/png')
            setOutputImage(dataUrl)
            setDownloadUrl(dataUrl)
            setHasPublicUrl(false)
          } else {
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('newspaper-photos')
              .getPublicUrl(fileName)

            const publicUrl = urlData.publicUrl
            setOutputImage(publicUrl)
            setDownloadUrl(publicUrl)
            setHasPublicUrl(true)
          }
        } catch (err) {
          console.error('Error uploading:', err)
          // Fallback to local data URL
          const dataUrl = canvas.toDataURL('image/png')
          setOutputImage(dataUrl)
          setDownloadUrl(dataUrl)
          setHasPublicUrl(false)
        }

        setIsLoading(false)
      }, 'image/png')

    } catch (err) {
      console.error('Error creating newspaper image:', err)
      setError('Failed to create newspaper image')
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (outputImage) {
      const link = document.createElement('a')
      link.href = outputImage
      link.download = `oneplus-times-${Date.now()}.png`
      link.click()
    }
  }

  if (isLoading) {
    return (
      <div className="output-screen">
        <div className="processing-content">
          <div className="spinner"></div>
          <h2>Creating your newspaper cover...</h2>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="output-screen">
        <div className="error-content">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="restart-button" onClick={onRestart}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="output-screen">
      <h2 className="output-title">Your Newspaper Cover!</h2>

      <div className="output-container">
        <div className="output-image-wrapper">
          {outputImage && (
            <img src={outputImage} alt="Your Newspaper" className="output-image" />
          )}
        </div>

        {hasPublicUrl && downloadUrl && (
          <div className="qr-section">
            <p className="qr-label">Scan to Download</p>
            <div className="qr-code">
              <QRCodeSVG
                value={downloadUrl}
                size={150}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>
        )}
      </div>

      <div className="output-controls">
        <button className="download-button" onClick={handleDownload}>
          Download
        </button>
        <button className="restart-button" onClick={onRestart}>
          Take Another Photo
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default OutputScreen
