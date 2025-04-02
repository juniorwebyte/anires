"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function BurroCursor() {
  const [visible, setVisible] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Usar spring para movimento mais suave
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Estado para controlar o tamanho do cursor (para efeito de clique)
  const [cursorSize, setCursorSize] = useState(40)

  // Estado para controlar a rotação do cursor
  const [rotation, setRotation] = useState(0)

  // Estado para controlar se o cursor está "fugindo" do mouse
  const [isFleeing, setIsFleeing] = useState(false)
  const [fleeDirection, setFleeDirection] = useState({ x: 0, y: 0 })

  // Estado para controlar se o cursor está duplicado
  const [showDuplicate, setShowDuplicate] = useState(false)
  const [duplicatePos, setDuplicatePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      if (isFleeing) {
        // If fleeing, move in the opposite direction
        cursorX.set(cursorX.get() + fleeDirection.x * 5)
        cursorY.set(cursorY.get() + fleeDirection.y * 5)

        // If the cursor goes too far off screen, reset the fleeing behavior
        if (
          cursorX.get() < -100 ||
          cursorX.get() > window.innerWidth + 100 ||
          cursorY.get() < -100 ||
          cursorY.get() > window.innerHeight + 100
        ) {
          setIsFleeing(false)
          cursorX.set(e.clientX - cursorSize / 2)
          cursorY.set(e.clientY - cursorSize / 2)
        }
      } else {
        // Normal behavior
        cursorX.set(e.clientX - cursorSize / 2)
        cursorY.set(e.clientY - cursorSize / 2)

        // Random chance to start fleeing
        if (Math.random() < 0.001) {
          // 0.1% chance with each movement
          setIsFleeing(true)
          // Choose a random direction to flee
          setFleeDirection({
            x: Math.random() > 0.5 ? 1 : -1,
            y: Math.random() > 0.5 ? 1 : -1,
          })

          // Reset after a few seconds
          setTimeout(() => {
            setIsFleeing(false)
          }, 2000)
        }

        // Random chance to rotate
        if (Math.random() < 0.005) {
          // 0.5% chance with each movement
          setRotation(Math.random() * 360)
          setTimeout(() => setRotation(0), 1000)
        }

        // Random chance to show a duplicate cursor
        if (Math.random() < 0.002) {
          // 0.2% chance with each movement
          setShowDuplicate(true)
          setDuplicatePos({
            x: e.clientX + (Math.random() * 100 - 50),
            y: e.clientY + (Math.random() * 100 - 50),
          })

          // Hide the duplicate after a few seconds
          setTimeout(() => {
            setShowDuplicate(false)
          }, 2000)
        }
      }
    }

    const handleMouseDown = () => {
      setCursorSize(35) // Decrease when clicking
    }

    const handleMouseUp = () => {
      setCursorSize(40) // Return to normal size
    }

    const handleMouseEnter = () => {
      setVisible(true)
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    // Only add event listeners if we're in a browser environment
    if (typeof window !== "undefined") {
      document.addEventListener("mousemove", updateCursorPosition)
      document.addEventListener("mousedown", handleMouseDown)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("mouseenter", handleMouseEnter)
      document.addEventListener("mouseleave", handleMouseLeave)
    }

    // Cleanup function
    return () => {
      if (typeof window !== "undefined") {
        document.removeEventListener("mousemove", updateCursorPosition)
        document.removeEventListener("mousedown", handleMouseDown)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("mouseenter", handleMouseEnter)
        document.removeEventListener("mouseleave", handleMouseLeave)

        // Clear any pending timeouts
        const highestId = setTimeout(() => {}, 0)
        for (let i = 0; i < highestId; i++) {
          clearTimeout(i)
        }
      }
    }
  }, [cursorX, cursorY, cursorSize, isFleeing, fleeDirection])

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-50"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: visible ? 1 : 0,
          rotate: rotation,
        }}
      >
        <img
          src="/jumento.png"
          alt="Cursor personalizado"
          style={{
            width: cursorSize,
            height: cursorSize,
            filter: isFleeing ? "hue-rotate(90deg)" : "none",
          }}
        />
      </motion.div>

      {/* Cursor duplicado para efeito de pegadinha */}
      {showDuplicate && (
        <motion.div
          className="fixed pointer-events-none z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: duplicatePos.x - cursorSize / 2,
            y: duplicatePos.y - cursorSize / 2,
          }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <img
            src="/jumento.png"
            alt="Cursor duplicado"
            style={{
              width: cursorSize,
              height: cursorSize,
              filter: "hue-rotate(180deg)",
            }}
          />
        </motion.div>
      )}
    </>
  )
}

