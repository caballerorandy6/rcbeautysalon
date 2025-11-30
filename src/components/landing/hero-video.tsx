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
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
          preload="auto"
          className="h-full w-full object-cover will-change-transform"
          poster="https://res.cloudinary.com/caballerorandy/image/upload/v1763776064/Beauty%20Salon/services/hero-bg_t2k2ca.avif"
          style={{
            objectFit: 'cover',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <source src="https://res.cloudinary.com/caballerorandy/video/upload/v1763776212/Beauty%20Salon/services/hero-bg_yje6fb.webm" type="video/webm" />
          <source src="https://res.cloudinary.com/caballerorandy/video/upload/v1763776242/Beauty%20Salon/services/hero-bg_rn87gq.mp4" type="video/mp4" />
        </video>
        {/* Overlay to improve text readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/60 dark:from-black/70 dark:via-black/60 dark:to-black/70 backdrop-blur-[1.5px]" />
      </div>
    </>
  )
}
