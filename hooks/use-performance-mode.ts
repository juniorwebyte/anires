"use client"

import { useState, useEffect } from "react"

export const usePerformanceMode = () => {
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false)

  useEffect(() => {
    // Check for saved preference on mount
    const savedPref = localStorage.getItem("lowPerfMode")
    if (savedPref) {
      setIsLowPerformanceMode(savedPref === "true")
    }

    // Apply initial class to body
    if (isLowPerformanceMode) {
      document.body.classList.add("low-perf-mode")
    } else {
      document.body.classList.remove("low-perf-mode")
    }
  }, [isLowPerformanceMode])

  return { isLowPerformanceMode, setIsLowPerformanceMode }
}

