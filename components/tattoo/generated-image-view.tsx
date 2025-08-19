"use client"

import { Button } from "@/components/ui/button"

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
        variant="outline"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onBackToEditor}
        title="Back to editor"
      >
        Edit
      </Button>
    </div>
  )
}