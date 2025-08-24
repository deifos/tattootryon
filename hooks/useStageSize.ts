import { useState, useCallback, useEffect, RefObject } from "react"

interface StageSize {
  width: number
  height: number
}

interface UseStagesSizeOptions {
  defaultSize?: StageSize
  containerRef?: RefObject<HTMLElement | null>
  baseImage?: HTMLImageElement | null
}

// Helper function to calculate stage size
const calculateStageSize = (containerWidth: number, img?: HTMLImageElement): StageSize => {
  const containerHeight = Math.max(500, Math.min(600, window.innerHeight * 0.7))

  if (img) {
    const aspectRatio = img.width / img.height
    let width = containerWidth
    let height = width / aspectRatio

    if (height < 300) {
      height = 300
      width = height * aspectRatio
    }

    if (height > containerHeight) {
      height = containerHeight
      width = height * aspectRatio
    }

    return { width: Math.round(width), height: Math.round(height) }
  }

  return { width: containerWidth, height: 500 }
}

export function useStageSize({
  defaultSize = { width: 800, height: 500 },
  containerRef,
  baseImage,
}: UseStagesSizeOptions = {}) {
  const [stageSize, setStageSize] = useState<StageSize>(defaultSize)

  const updateStageSize = useCallback(() => {
    if (containerRef?.current && baseImage) {
      const containerWidth = containerRef.current.offsetWidth - 32
      const newStageSize = calculateStageSize(containerWidth, baseImage)
      setStageSize(newStageSize)
    } else if (containerRef?.current) {
      const containerWidth = containerRef.current.offsetWidth - 32
      const newStageSize = calculateStageSize(containerWidth)
      setStageSize(newStageSize)
    }
  }, [containerRef, baseImage])

  // Calculate initial size when baseImage changes
  const calculateInitialSize = useCallback((img?: HTMLImageElement | null) => {
    if (containerRef?.current) {
      const containerWidth = containerRef.current.offsetWidth - 32
      const newStageSize = calculateStageSize(containerWidth, img || undefined)
      setStageSize(newStageSize)
    } else if (!img) {
      setStageSize(defaultSize)
    }
  }, [containerRef, defaultSize])

  // Handle window resize with debouncing for mobile stability
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        updateStageSize()
      }, 150) // Debounce resize events
    }

    // Initial size calculation
    updateStageSize()
    
    // Listen for resize events
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [updateStageSize])

  return {
    stageSize,
    updateStageSize,
    calculateInitialSize,
    calculateStageSize,
  }
}