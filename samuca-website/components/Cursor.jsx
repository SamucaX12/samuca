'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    
    if (!cursor || !follower) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let followerX = window.innerWidth / 2
    let followerY = window.innerHeight / 2
    
    let animationFrameId

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      
      cursor.style.left = mouseX + 'px'
      cursor.style.top = mouseY + 'px'
    }

    const animateCursor = () => {
      followerX += (mouseX - followerX) * 0.15
      followerY += (mouseY - followerY) * 0.15
      
      follower.style.left = followerX + 'px'
      follower.style.top = followerY + 'px'
      
      animationFrameId = requestAnimationFrame(animateCursor)
    }

    document.addEventListener('mousemove', onMouseMove)
    animateCursor()

    // Setup hover effects
    const setupHovers = () => {
      const clickables = document.querySelectorAll('a, button, .accordion-header, .hero-badge')
      
      const onEnter = () => {
        cursor.classList.add('hover')
        follower.classList.add('hover')
      }
      
      const onLeave = () => {
        cursor.classList.remove('hover')
        follower.classList.remove('hover')
      }

      clickables.forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })

      return () => {
        clickables.forEach(el => {
          el.removeEventListener('mouseenter', onEnter)
          el.removeEventListener('mouseleave', onLeave)
        })
      }
    }

    // A small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      setupHovers()
    }, 500)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={followerRef} className="custom-cursor-follower"></div>
    </>
  )
}
