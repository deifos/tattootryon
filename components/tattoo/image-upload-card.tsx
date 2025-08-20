"use client"

import { useRef, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import { useFileReader } from "@/hooks/useFileReader"

interface ImageUploadCardProps {
  title: string
  image: string | null
  onImageUpload: (dataUrl: string, file: File) => void
  onImageRemove?: () => void
  onError?: (error: string) => void
  placeholder?: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
  // Body part input props
  showBodyPartInput?: boolean
  bodyPart?: string
  onBodyPartChange?: (bodyPart: string) => void
  bodyPartPlaceholder?: string
}

export function ImageUploadCard({
  title,
  image,
  onImageUpload,
  onImageRemove,
  onError,
  placeholder = "Click or drag to upload image",
  icon: Icon = Upload,
  disabled = false,
  // Body part input props
  showBodyPartInput = false,
  bodyPart = "",
  onBodyPartChange,
  bodyPartPlaceholder = "e.g., arm, back, shoulder, leg...",
}: ImageUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const fileReaderOptions = useMemo(() => ({
    maxSizeInMB: 10,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    onSuccess: (dataUrl: string, file: File) => {
      onImageUpload(dataUrl, file)
    },
    onError: (error: string) => {
      onError?.(error)
    }
  }), [onImageUpload, onError])

  const { readFile, isLoading } = useFileReader(fileReaderOptions)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (disabled) return
      
      const files = Array.from(e.dataTransfer.files)
      const imageFile = files[0] // Take the first file
      if (imageFile) {
        readFile(imageFile)
      }
    },
    [readFile, disabled],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && !disabled) {
        readFile(file)
      }
      // Reset input value to allow selecting the same file again
      e.target.value = ''
    },
    [readFile, disabled],
  )

  const handleClick = useCallback(() => {
    if (!disabled && !isLoading) {
      inputRef.current?.click()
    }
  }, [disabled, isLoading])

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the upload click
    onImageRemove?.()
  }, [onImageRemove])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors min-h-[200px] flex items-center justify-center ${
            disabled || isLoading
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 cursor-pointer hover:border-primary'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleClick}
        >
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
              <p className="text-sm text-gray-500">Processing image...</p>
            </div>
          ) : image ? (
            <div className="relative group">
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-contain bg-gray-50 rounded hover:opacity-90 transition-opacity"
              />
              {onImageRemove && !disabled && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemove}
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ) : (
            <div>
              <Icon className={`w-8 h-8 mx-auto mb-2 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
              <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                {placeholder}
              </p>
              {!disabled && (
                <p className="text-xs text-gray-500 mt-1">
                  Max 10MB • JPG, PNG, GIF, WebP
                </p>
              )}
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isLoading}
        />
        
        {/* Body part input */}
        {showBodyPartInput && image && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="body-part" className="text-sm font-medium">
              Body Part (for better results)
            </Label>
            <Textarea
              id="body-part"
              placeholder={bodyPartPlaceholder}
              value={bodyPart}
              onChange={(e) => onBodyPartChange?.(e.target.value)}
              disabled={disabled}
              rows={2}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Describe where the tattoo will be placed (e.g., &quot;arm&quot;, &quot;back of shoulder&quot;, &quot;lower leg&quot;)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}