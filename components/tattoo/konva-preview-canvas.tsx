"use client"

import { useState, useRef, useEffect } from "react"
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Zap, RotateCcw, Download } from "lucide-react"
import Konva from "konva"
import { useCanvasComposer } from "@/hooks/useCanvasComposer"
import { useFalAI } from "@/hooks/useFalAI"

interface KonvaPreviewCanvasProps {
  baseImage: string | null
  tattooImage: string | null
  bodyPart?: string
  onApplyTattoo: () => void
  isApplying: boolean
  onError?: (error: string) => void
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

    return { width, height }
  }

  return { width: containerWidth, height: containerHeight }
}

// Helper function to calculate appropriate scale for tattoo image
const calculateTattooScale = (tattooImg: HTMLImageElement, stageWidth: number, stageHeight: number) => {
  // Target size should be roughly 20-30% of the stage size
  const maxTattooWidth = stageWidth * 0.25
  const maxTattooHeight = stageHeight * 0.25
  
  // Calculate scale to fit within the target size
  const scaleX = maxTattooWidth / tattooImg.width
  const scaleY = maxTattooHeight / tattooImg.height
  
  // Use the smaller scale to maintain aspect ratio
  const scale = Math.min(scaleX, scaleY, 1) // Don't upscale beyond original size
  
  return Math.max(scale, 0.1) // Minimum scale of 0.1 to ensure it's not too tiny
}

export function KonvaPreviewCanvas({
  baseImage,
  tattooImage,
  bodyPart = "",
  onApplyTattoo,
  isApplying,
  onError,
}: KonvaPreviewCanvasProps) {
  const [baseImageObj, setBaseImageObj] = useState<HTMLImageElement | null>(null)
  const [tattooImageObj, setTattooImageObj] = useState<HTMLImageElement | null>(null)
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [tattooScale, setTattooScale] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  
  const stageRef = useRef<Konva.Stage>(null)
  const tattooRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Hooks for canvas composition and FAL AI
  const { composeImages } = useCanvasComposer()
  const { generateTattoo, isGenerating } = useFalAI({
    onSuccess: (imageUrl) => {
      setGeneratedImage(imageUrl)
    },
    onError: (error) => {
      onError?.(error)
    },
  })

  // Update stage size based on container
  const updateStageSize = () => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.clientWidth
    const newSize = calculateStageSize(containerWidth, baseImageObj || undefined)
    setStageSize(newSize)
  }

  // Handle image loading with consolidated effect
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true)
      
      // Clear generated image when new images are uploaded
      setGeneratedImage(null)
      
      try {
        // Load base image
        if (baseImage) {
          const baseImg = await loadImage(baseImage)
          setBaseImageObj(baseImg)
          
          // Update stage size with new image
          if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth
            const newSize = calculateStageSize(containerWidth, baseImg)
            setStageSize(newSize)
          }
        } else {
          setBaseImageObj(null)
          updateStageSize()
        }

        // Load tattoo image
        if (tattooImage) {
          const tattooImg = await loadImage(tattooImage)
          setTattooImageObj(tattooImg)
          
          // Calculate appropriate scale for the tattoo
          const scale = calculateTattooScale(tattooImg, stageSize.width, stageSize.height)
          setTattooScale(scale)
          
          setSelectedId("tattoo")
        } else {
          setTattooImageObj(null)
          setTattooScale(1)
          setSelectedId(null)
        }
      } catch (error) {
        console.error('Error loading images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [baseImage, tattooImage])

  // Handle resize and transformer selection
  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateStageSize, 100)
    }

    // Setup resize listener
    window.addEventListener('resize', handleResize)
    
    // Initial size calculation
    setTimeout(updateStageSize, 100)

    // Handle transformer selection
    if (selectedId === "tattoo" && tattooRef.current && transformerRef.current) {
      // Small delay to ensure the tattoo image is fully rendered
      setTimeout(() => {
        if (tattooRef.current && transformerRef.current) {
          transformerRef.current.nodes([tattooRef.current])
          transformerRef.current.getLayer()?.batchDraw()
        }
      }, 100)
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [selectedId, baseImageObj])

  // Separate effect for transformer updates when tattoo image changes
  useEffect(() => {
    if (selectedId === "tattoo" && tattooImageObj && tattooRef.current && transformerRef.current && !generatedImage) {
      setTimeout(() => {
        if (tattooRef.current && transformerRef.current) {
          transformerRef.current.nodes([tattooRef.current])
          transformerRef.current.getLayer()?.batchDraw()
        }
      }, 150)
    } else if (transformerRef.current) {
      // Clear transformer when nothing is selected
      transformerRef.current.nodes([])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [selectedId, tattooImageObj, generatedImage])

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // If clicked on empty area, deselect
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
      return
    }

    // If clicked on tattoo, select it
    if (e.target.name() === "tattoo") {
      setSelectedId("tattoo")
    }
  }

  const handleApplyTattoo = async () => {
    if (!baseImage || !tattooImage) {
      onError?.("Please upload both a base image and a tattoo design")
      return
    }

    try {
      // Check if stage is available
      if (!stageRef.current) {
        throw new Error('Canvas stage not available')
      }

      // Compose the canvas images into a single image
      console.log('Composing canvas images...')
      const composition = await composeImages(stageRef as React.RefObject<Konva.Stage>)
      console.log('Canvas composition result:', {
        dataUrlLength: composition.dataUrl.length,
        width: composition.width,
        height: composition.height,
        dataUrlPreview: composition.dataUrl.substring(0, 100) + '...'
      })
      
      // Generate tattoo using FAL AI
      const prompt = bodyPart.trim() 
        ? `on ${bodyPart.trim()}, realistic tattoo application`
        : "realistic tattoo application"
      await generateTattoo(composition.dataUrl, prompt)
      
      // Call the original onApplyTattoo for any additional logic
      onApplyTattoo()
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Failed to generate tattoo")
    }
  }

  const resetCanvas = () => {
    // Clear generated image first
    setGeneratedImage(null)
    
    // Reset tattoo position if it exists
    if (tattooRef.current) {
      tattooRef.current.position({ x: stageSize.width / 2, y: stageSize.height / 2 })
      tattooRef.current.scale({ x: tattooScale, y: tattooScale })
      tattooRef.current.rotation(0)
      tattooRef.current.getLayer()?.batchDraw()
      setSelectedId("tattoo") // Re-select after reset
    }
  }

  const exportImage = () => {
    // Always export the current canvas composition (base image + positioned tattoo)
    if (stageRef.current) {
      // Remember the current selection
      const wasSelected = selectedId
      
      // Deselect transformer before export
      setSelectedId(null)
      setTimeout(() => {
        const uri = stageRef.current!.toDataURL()
        const link = document.createElement("a")
        link.download = "tattoo-composition.png"
        link.href = uri
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Restore selection after export
        if (wasSelected && tattooImageObj) {
          setTimeout(() => {
            setSelectedId(wasSelected)
          }, 100)
        }
      }, 100)
    }
  }

  const downloadGeneratedImage = async () => {
    // Download the AI-generated result
    if (generatedImage) {
      try {
        // Fetch the image as a blob to handle CORS
        const response = await fetch(generatedImage)
        const blob = await response.blob()
        
        // Create object URL from blob
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = "generated-tattoo.png"
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up the object URL
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to download generated image:', error)
        onError?.('Failed to download image. Please try again.')
      }
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Preview Canvas</span>
          <div className="flex gap-2">
            {baseImage && tattooImage && (
              <Button onClick={handleApplyTattoo} disabled={isApplying || isGenerating}>
                {isApplying || isGenerating ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={resetCanvas}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportImage}>
              <Download className="w-4 h-4 mr-2" />
              Export Canvas
            </Button>
            {generatedImage && (
              <Button variant="default" size="sm" onClick={downloadGeneratedImage}>
                <Download className="w-4 h-4 mr-2" />
                Download Result
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className="w-full bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center"
          style={{ minHeight: '500px' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center text-gray-500 w-full h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Loading images...</p>
              </div>
            </div>
          ) : generatedImage ? (
            <div className="relative">
              <img
                src={generatedImage}
                alt="Generated tattoo result"
                className="max-w-full max-h-full object-contain rounded"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setGeneratedImage(null)
                  // Re-select tattoo when returning to editor with a small delay
                  setTimeout(() => {
                    if (tattooImageObj) {
                      setSelectedId("tattoo")
                    }
                  }, 100)
                }}
                title="Back to editor"
              >
                Edit
              </Button>
            </div>
          ) : baseImage ? (
            <div className="relative">
              <Stage
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleStageClick}
                ref={stageRef}
              >
              <Layer>
                {/* Base Image */}
                {baseImageObj && (
                  <KonvaImage
                    image={baseImageObj}
                    width={stageSize.width}
                    height={stageSize.height}
                  />
                )}
                
                {/* Tattoo Image */}
                {tattooImageObj && (
                  <KonvaImage
                    ref={tattooRef}
                    image={tattooImageObj}
                    x={stageSize.width / 2}
                    y={stageSize.height / 2}
                    offsetX={tattooImageObj.width / 2}
                    offsetY={tattooImageObj.height / 2}
                    scaleX={tattooScale}
                    scaleY={tattooScale}
                    draggable
                    name="tattoo"
                    onClick={() => setSelectedId("tattoo")}
                    onTap={() => setSelectedId("tattoo")}
                  />
                )}

                {/* Transformer for tattoo */}
                {selectedId === "tattoo" && (
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      // Limit resize
                      if (newBox.width < 20 || newBox.height < 20) {
                        return oldBox
                      }
                      return newBox
                    }}
                    enabledAnchors={[
                      'top-left',
                      'top-right', 
                      'bottom-left',
                      'bottom-right'
                    ]}
                    rotateAnchorOffset={30}
                  />
                )}
              </Layer>
              </Stage>
              
              {/* Loading overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                    <p className="text-sm font-medium text-gray-700">Generating tattoo...</p>
                    <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-500 w-full h-96">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload a base image to get started</p>
              </div>
            </div>
          )}
        </div>

        {baseImage && tattooImage && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              Click on the tattoo to select it, then drag to move or use the handles to resize and rotate
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}