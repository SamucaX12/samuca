'use client'

import { useEffect, useRef } from 'react'

export default function ParticlesBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    let width, height
    let particles = []
    let animationFrameId

    const mouse = { x: null, y: null, radius: 180 }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      init()
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const onMouseOut = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener("resize", resize)
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseout", onMouseOut)

    class Particle {
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 1.2
        this.speedY = (Math.random() - 0.5) * 1.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > width || this.x < 0) this.speedX = -this.speedX
        if (this.y > height || this.y < 0) this.speedY = -this.speedY

        if (mouse.x && mouse.y) {
          let dx = mouse.x - this.x
          let dy = mouse.y - this.y
          let distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius
            const directionX = dx / distance
            const directionY = dy / distance
            
            this.x -= directionX * force * 4
            this.y -= directionY * force * 4
          }
        }
      }

      draw() {
        ctx.fillStyle = "rgba(168, 85, 247, 0.7)"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function init() {
      particles = []
      const numberOfParticles = Math.floor((width * height) / 7000) 
      
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle())
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
        
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x
          let dy = particles[i].y - particles[j].y
          let distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 130) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 - distance/430})`
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }

        if (mouse.x && mouse.y) {
          let dx = particles[i].x - mouse.x
          let dy = particles[i].y - mouse.y
          let distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(216, 180, 254, ${0.6 - distance/250})`
            ctx.lineWidth = 1.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseout", onMouseOut)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} id="particles-bg"></canvas>
}
