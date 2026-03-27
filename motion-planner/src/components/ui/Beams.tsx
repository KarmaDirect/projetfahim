'use client'

import React, { useEffect, useRef } from 'react'

export interface BeamsProps {
  beamWidth?: number
  beamHeight?: number
  beamNumber?: number
  lightColor?: string
  speed?: number
  noiseIntensity?: number
  scale?: number
  rotation?: number
  className?: string
}

export default function Beams({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = '#4B5563',
  speed = 2,
  noiseIntensity = 1.75, // Used for opacity variation
  scale = 0.2, // Used for size variations
  rotation = 0,
  className = ''
}: BeamsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    
    // Resize handler
    const updateSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    // Beam Class
    class Beam {
      x: number
      y: number
      width: number
      height: number
      speedY: number
      opacity: number
      maxOpacity: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height * 1.5 - canvas!.height * 0.5
        this.width = beamWidth * (1 + Math.random() * scale * 5)
        // Tall lines of light
        this.height = beamHeight * 20 * (1 + Math.random() * scale * 10)
        // Speed relates to prop
        this.speedY = speed * (0.2 + Math.random() * 0.8)
        this.maxOpacity = 0.1 + Math.random() * (0.4 * noiseIntensity)
        this.opacity = 0
      }

      update() {
        this.y -= this.speedY
        
        // Fade in/out organically
        const centerDist = Math.abs((this.y + this.height/2) - (canvas!.height/2))
        const normalizedDist = 1 - (centerDist / (canvas!.height * 1.2))
        this.opacity = Math.max(0, this.maxOpacity * normalizedDist)

        if (this.y + this.height < 0) {
          this.y = canvas!.height + Math.random() * 200
          this.x = Math.random() * canvas!.width
        }
      }

      draw() {
        if (!ctx) return
        ctx.save()
        // Draw the beam
        ctx.globalAlpha = this.opacity
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(0.5, lightColor)
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        // Glowing effect
        ctx.shadowBlur = beamWidth * 5
        ctx.shadowColor = lightColor
        
        ctx.fillRect(this.x - this.width/2, this.y, this.width, this.height)
        ctx.restore()
      }
    }

    // Initialize beams
    const beams: Beam[] = []
    for (let i = 0; i < beamNumber; i++) {
        beams.push(new Beam())
    }

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      beams.forEach(beam => {
        beam.update()
        beam.draw()
      })
      
      animationFrameId = requestAnimationFrame(draw)
    }
    
    draw()

    return () => {
      window.removeEventListener('resize', updateSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [beamWidth, beamHeight, beamNumber, lightColor, speed, noiseIntensity, scale])

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full block ${className}`} 
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  )
}
