"use client"

import { useState, useCallback } from "react"
import { ImageUploadCard } from "./image-upload-card"
import { TattooGenerator } from "./tattoo-generator"
import { PreviewCanvas } from "./preview-canvas"
import { ErrorBoundary } from "../error-boundary"
import { Upload, AlertCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorState {
  message: string
  timestamp: number
}

export function TattooTryOnClient() {
  const [baseImage, setBaseImage] = useState<string | null>(null)
  const [tattooImage, setTattooImage] = useState<string | null>(null)
  const [bodyPart, setBodyPart] = useState<string>("")
  const [isApplying, setIsApplying] = useState(false)
  const [errors, setErrors] = useState<ErrorState[]>([])

  const addError = useCallback((message: string) => {
    const error: ErrorState = {
      message,
      timestamp: Date.now(),
    }
    setErrors(prev => [...prev, error])
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e.timestamp !== error.timestamp))
    }, 5000)
  }, [])

  const removeError = useCallback((timestamp: number) => {
    setErrors(prev => prev.filter(e => e.timestamp !== timestamp))
  }, [])

  const handleBaseImageUpload = useCallback((dataUrl: string) => {
    setBaseImage(dataUrl)
  }, [])

  const handleTattooImageChange = useCallback((dataUrl: string) => {
    setTattooImage(dataUrl)
  }, [])

  const handleBaseImageRemove = useCallback(() => {
    setBaseImage(null)
    setBodyPart("") // Clear body part when base image is removed
  }, [])

  const handleTattooImageRemove = useCallback(() => {
    setTattooImage(null)
  }, [])

  const applyTattooToBase = async () => {
    if (!baseImage || !tattooImage) {
      addError("Please upload both a base image and a tattoo design")
      return
    }

    setIsApplying(true)
    try {
      // Simulate AI application process
      await new Promise(resolve => setTimeout(resolve, 3000))
      // In a real app, this would use AI to realistically apply the tattoo to the base image
    } catch (error) {
      console.error("Failed to apply tattoo:", error)
      addError("Failed to apply tattoo. Please try again.")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <>
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {errors.map((error) => (
            <Card key={error.timestamp} className="border-red-200 bg-red-50 shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 flex-1">{error.message}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeError(error.timestamp)}
                    className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Upload & Generate */}
        <div className="space-y-4">
          {/* Base Image Upload */}
          <ErrorBoundary>
            <ImageUploadCard
              title="Upload Base Image"
              image={baseImage}
              onImageUpload={handleBaseImageUpload}
              onImageRemove={handleBaseImageRemove}
              onError={addError}
              placeholder="Click or drag to upload base image"
              icon={Upload}
              disabled={isApplying}
              showBodyPartInput={true}
              bodyPart={bodyPart}
              onBodyPartChange={setBodyPart}
            />
          </ErrorBoundary>

          {/* Tattoo Design */}
          <ErrorBoundary>
            <TattooGenerator
              tattooImage={tattooImage}
              onTattooImageChange={handleTattooImageChange}
              onTattooImageRemove={handleTattooImageRemove}
              onError={addError}
              disabled={isApplying}
            />
          </ErrorBoundary>
        </div>

        {/* Center Panel - Canvas */}
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <PreviewCanvas
              baseImage={baseImage}
              tattooImage={tattooImage}
              bodyPart={bodyPart}
              onApplyTattoo={applyTattooToBase}
              isApplying={isApplying}
              onError={addError}
            />
          </ErrorBoundary>
        </div>
      </div>
    </>
  )
}