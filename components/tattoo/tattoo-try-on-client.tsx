"use client"

import { useState, useCallback, useEffect } from "react"
import { ImageUploadCard } from "./image-upload-card"
import { TattooGenerator } from "./tattoo-generator"
import { PreviewCanvas } from "./preview-canvas"
import { ErrorBoundary } from "../error-boundary"
import { Upload, AlertCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { galleryStorage, type GalleryItem } from "@/lib/gallery-storage"
import { DeleteConfirmationDialog, type DeleteConfirmationState } from "./delete-confirmation-dialog"
import { GallerySection } from "./gallery-section"

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
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  
  // Confirmation dialog state
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationState>({
    isOpen: false,
    type: 'item'
  })

  // Load gallery items on mount
  useEffect(() => {
    setGalleryItems(galleryStorage.getAllItems())
  }, [])

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

  const handleBaseImageUpload = useCallback(async (dataUrl: string, file: File) => {
    setBaseImage(dataUrl)
    
    // Save to gallery
    try {
      await galleryStorage.addItem('base', dataUrl, file.name, bodyPart)
      setGalleryItems(galleryStorage.getAllItems())
    } catch (error) {
      console.warn('Failed to save base image to gallery:', error)
    }
  }, [bodyPart])

  const handleTattooImageChange = useCallback(async (dataUrl: string, file: File) => {
    setTattooImage(dataUrl)
    
    // Save to gallery
    try {
      await galleryStorage.addItem('tattoo', dataUrl, file.name)
      setGalleryItems(galleryStorage.getAllItems())
    } catch (error) {
      console.warn('Failed to save tattoo image to gallery:', error)
    }
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

  // Gallery functions
  const handleReuseImage = useCallback((item: GalleryItem) => {
    if (item.type === 'base' || item.type === 'result') {
      setBaseImage(item.imageUrl)
      if (item.bodyPart) {
        setBodyPart(item.bodyPart)
      }
    } else if (item.type === 'tattoo') {
      setTattooImage(item.imageUrl)
    }
  }, [])

  const handleDeleteFromGallery = useCallback((id: string, itemName?: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'item',
      itemId: id,
      itemName
    })
  }, [])

  const handleClearGallery = useCallback((type?: GalleryItem['type']) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'bulk',
      bulkType: type
    })
  }, [])

  const confirmDelete = useCallback(() => {
    if (deleteConfirmation.type === 'item' && deleteConfirmation.itemId) {
      galleryStorage.removeItem(deleteConfirmation.itemId)
      setGalleryItems(galleryStorage.getAllItems())
    } else if (deleteConfirmation.type === 'bulk') {
      if (deleteConfirmation.bulkType) {
        galleryStorage.clearByType(deleteConfirmation.bulkType)
      } else {
        galleryStorage.clearAll()
      }
      setGalleryItems(galleryStorage.getAllItems())
    }
    setDeleteConfirmation({ isOpen: false, type: 'item' })
  }, [deleteConfirmation])

  const cancelDelete = useCallback(() => {
    setDeleteConfirmation({ isOpen: false, type: 'item' })
  }, [])

  // Handle generated result from preview canvas
  const handleGeneratedResult = useCallback(async (imageUrl: string) => {
    try {
      await galleryStorage.addItem('result', imageUrl, 'Generated Result', bodyPart)
      setGalleryItems(galleryStorage.getAllItems())
    } catch (error) {
      console.warn('Failed to save generated result to gallery:', error)
    }
  }, [bodyPart])

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
              onGeneratedResult={handleGeneratedResult}
              onTattooRemove={handleTattooImageRemove}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* Gallery Section */}
      <GallerySection
        galleryItems={galleryItems}
        onReuseImage={handleReuseImage}
        onDeleteFromGallery={handleDeleteFromGallery}
        onClearGallery={handleClearGallery}
      />

      {/* Confirmation Dialog */}
      <DeleteConfirmationDialog
        deleteConfirmation={deleteConfirmation}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}