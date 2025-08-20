"use client"

import { Button } from "@heroui/button"

interface GeneratedImageViewProps {
  generatedImage: string
  onBackToEditor: () => void
}

export function GeneratedImageView({ generatedImage, onBackToEditor }: GeneratedImageViewProps) {
  return (
    <div className="relative">
      <img
        src={generatedImage}
        alt="Generated tattoo result"
        className="max-w-full max-h-full object-contain rounded"
      />
      <Button
        size="sm"
        className="absolute top-2 right-2"
        onPress={onBackToEditor}
        title="Back to editor"
      >
        Edit
      </Button>
    </div>
  )
}