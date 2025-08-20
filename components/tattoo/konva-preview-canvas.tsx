"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Konva from "konva"
import { useCanvasComposer } from "@/hooks/useCanvasComposer"
import { useFalAI } from "@/hooks/useFalAI"

// Components
import { CanvasControlButtons } from "./canvas-control-buttons"
import { GeneratedImageView } from "./generated-image-view"
import { LoadingView } from "./loading-view"
import { KonvaStage } from "./konva-stage"
import { EmptyState } from "./empty-state"

interface KonvaPreviewCanvasProps {
  baseImage: string | null
  tattooImage: string | null
  bodyPart?: string
  onApplyTattoo: () => void
  isApplying: boolean
  onError?: (error: string) => void
  onGeneratedResult?: (imageUrl: string) => void
  onTattooRemove?: () => void
}

// Helper function to load image
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Helper function to calculate stage size
const calculateStageSize = (containerWidth: number, img?: HTMLImageElement) => {
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

// Helper function to calculate appropriate scale for tattoo image
const calculateTattooScale = (tattooImg: HTMLImageElement, stageWidth: number, stageHeight: number) => {
  const maxSize = Math.min(stageWidth, stageHeight) * 0.3
  const tattooAspectRatio = tattooImg.width / tattooImg.height
  let targetWidth = maxSize
  let targetHeight = maxSize / tattooAspectRatio
  
  if (targetHeight > maxSize) {
    targetHeight = maxSize
    targetWidth = maxSize * tattooAspectRatio
  }
  
  return Math.min(targetWidth / tattooImg.width, targetHeight / tattooImg.height)
}

export function KonvaPreviewCanvas({
  baseImage,
  tattooImage,
  bodyPart,
  isApplying,
  onError,
  onGeneratedResult,
  onTattooRemove,
}: KonvaPreviewCanvasProps) {
  // State
  const [baseImageObj, setBaseImageObj] = useState<HTMLImageElement | null>(null)
  const [tattooImageObj, setTattooImageObj] = useState<HTMLImageElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [stageSize, setStageSize] = useState({ width: 800, height: 500 })
  const [tattooScale, setTattooScale] = useState(1)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  // Refs
  const stageRef = useRef<Konva.Stage>(null)
  const tattooRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Hooks for canvas composition and FAL AI
  const { composeImages } = useCanvasComposer()
  const { generateTattoo, isGenerating } = useFalAI({
    onSuccess: (imageUrl) => {
      setGeneratedImage(imageUrl)
      onGeneratedResult?.(imageUrl)
      // Clear the tattoo from preview since it's now applied to the generated image
      onTattooRemove?.()
    },
    onError: (error) => {
      onError?.(error)
    }
  })

  // Update stage size when container resizes
  const updateStageSize = () => {
    if (containerRef.current && baseImageObj) {
      const containerWidth = containerRef.current.offsetWidth - 32
      const newStageSize = calculateStageSize(containerWidth, baseImageObj)
      setStageSize(newStageSize)
    }
  }

  // Load base image
  useEffect(() => {
    if (baseImage) {
      console.log('Loading new base image, clearing generated image:', baseImage.substring(0, 50))
      // Clear generated image when a new base image is loaded
      setGeneratedImage(null)
      setIsLoading(true)
      
      loadImage(baseImage)
        .then((img) => {
          setBaseImageObj(img)
          if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth - 32
            const newStageSize = calculateStageSize(containerWidth, img)
            setStageSize(newStageSize)
          }
        })
        .catch(() => {
          onError?.('Failed to load base image')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setBaseImageObj(null)
      setGeneratedImage(null) // Also clear generated image when base image is cleared
      setStageSize({ width: 800, height: 500 })
    }
  }, [baseImage, onError])

  // Load tattoo image
  useEffect(() => {
    if (tattooImage) {
      loadImage(tattooImage)
        .then((img) => {
          setTattooImageObj(img)
          if (stageSize.width && stageSize.height) {
            const scale = calculateTattooScale(img, stageSize.width, stageSize.height)
            setTattooScale(scale)
          }
        })
        .catch(() => {
          onError?.('Failed to load tattoo image')
        })
    } else {
      setTattooImageObj(null)
      setSelectedId(null)
    }
  }, [tattooImage, stageSize.width, stageSize.height, onError])

  // Update tattoo scale when stage size changes
  useEffect(() => {
    if (tattooImageObj && stageSize.width && stageSize.height) {
      const scale = calculateTattooScale(tattooImageObj, stageSize.width, stageSize.height)
      setTattooScale(scale)
    }
  }, [tattooImageObj, stageSize])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateStageSize()
    }

    window.addEventListener('resize', handleResize)
    updateStageSize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [baseImageObj])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key pressed and tattoo is selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId === 'tattoo' && onTattooRemove) {
        e.preventDefault()
        onTattooRemove()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedId, onTattooRemove])

  // Handle transformer attachment
  useEffect(() => {
    if (selectedId === "tattoo" && tattooRef.current && transformerRef.current) {
      transformerRef.current.nodes([tattooRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [selectedId])

  // Handle stage click (deselect)
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }

  // Handle tattoo selection
  const handleTattooSelect = () => {
    setSelectedId("tattoo")
  }

  // Apply tattoo using AI
  const handleApplyTattoo = async () => {
    if ((!baseImage && !generatedImage) || !tattooImage) {
      onError?.("Please upload both a base image and a tattoo design")
      return
    }

    try {
      // Check if stage is available
      if (!stageRef.current) {
        throw new Error('Canvas stage not available')
      }

      // Compose the canvas images into a single image
      const composition = await composeImages(stageRef as React.RefObject<Konva.Stage>)
      
      console.log('Canvas composition created:', {
        hasBaseImage: !!baseImage,
        hasGeneratedImage: !!generatedImage,
        hasTattooImage: !!tattooImage,
        compositionSize: composition.dataUrl.length
      })
      
      // Generate the tattoo application using FAL AI
      const prompt = bodyPart ? `Apply this tattoo to the ${bodyPart}` : 'Apply this tattoo to the person'
      await generateTattoo(composition.dataUrl, prompt)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to apply tattoo. Please try again."
      onError?.(errorMessage)
    }
  }

  // Reset canvas
  const resetCanvas = () => {
    setSelectedId(null)
    setGeneratedImage(null)
    
    // Reset tattoo position and scale
    if (tattooRef.current && tattooImageObj) {
      tattooRef.current.position({
        x: stageSize.width / 2,
        y: stageSize.height / 2
      })
      const scale = calculateTattooScale(tattooImageObj, stageSize.width, stageSize.height)
      tattooRef.current.scale({ x: scale, y: scale })
      tattooRef.current.rotation(0)
      tattooRef.current.getLayer()?.batchDraw()
    }
  }

  // Export canvas image
  const exportImage = () => {
    if (!stageRef.current) {
      onError?.("Canvas not available for export")
      return
    }

    try {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 })
      
      // Create download link
      const link = document.createElement('a')
      link.download = 'tattoo-canvas.png'
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      onError?.("Failed to export canvas image")
    }
  }

  // Download generated image
  const downloadGeneratedImage = () => {
    if (!generatedImage) return

    try {
      const link = document.createElement('a')
      link.download = 'generated-tattoo-result.png'
      link.href = generatedImage
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      onError?.("Failed to download generated image")
    }
  }

  // Handle back to editor
  const handleBackToEditor = () => {
    setGeneratedImage(null)
    // Re-select tattoo when returning to editor with a small delay
    setTimeout(() => {
      if (tattooImageObj) {
        setSelectedId("tattoo")
      }
    }, 100)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Preview Canvas</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className="w-full bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center"
          style={{ minHeight: '500px' }}
        >
          {isLoading ? (
            <LoadingView />
          ) : generatedImage && !tattooImage ? (
            <GeneratedImageView 
              generatedImage={generatedImage}
              onBackToEditor={handleBackToEditor}
            />
          ) : (baseImage || generatedImage) ? (
            <KonvaStage
              ref={stageRef}
              stageSize={stageSize}
              baseImageObj={baseImageObj}
              tattooImageObj={tattooImageObj}
              tattooScale={tattooScale}
              selectedId={selectedId}
              isGenerating={isGenerating}
              onStageClick={handleStageClick}
              onTattooSelect={handleTattooSelect}
              transformerRef={transformerRef}
              tattooRef={tattooRef}
              generatedImage={generatedImage}
            />
          ) : (
            <EmptyState />
          )}
        </div>

        {(baseImage || generatedImage) && tattooImage && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              Click on the tattoo to select it, then drag to move or use the handles to resize and rotate.
              Press Delete or Backspace to remove the selected tattoo from preview.
              {generatedImage && " You can add multiple tattoos to generated images."}
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="mt-4 flex justify-center">
          <CanvasControlButtons
            baseImage={baseImage}
            tattooImage={tattooImage}
            generatedImage={generatedImage}
            isApplying={isApplying}
            isGenerating={isGenerating}
            onApplyTattoo={handleApplyTattoo}
            onReset={resetCanvas}
            onExportCanvas={exportImage}
            onDownloadResult={downloadGeneratedImage}
          />
        </div>
      </CardContent>
    </Card>
  )
}