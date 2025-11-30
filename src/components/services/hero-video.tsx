"use client"

import { useRef } from "react"

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle smooth video loop by restarting before it ends
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current
      // Restart video 0.3 seconds before it ends for seamless loop
      if (video.duration - video.currentTime < 0.3) {
        video.currentTime = 0
      }
    }
  }

  return (
    <>
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
          className="h-full w-full object-cover"
        >
          <source src="https://res.cloudinary.com/caballerorandy/video/upload/v1763776430/Beauty%20Salon/services/services_ija8oq.webm" type="video/webm" />
          <source src="https://res.cloudinary.com/caballerorandy/video/upload/v1763776446/Beauty%20Salon/services/services_umsjwg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-black/50 dark:bg-black/40" />
    </>
  )
}
