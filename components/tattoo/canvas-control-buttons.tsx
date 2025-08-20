"use client"

import { Button } from "@/components/ui/button"
import { Zap, RotateCcw, Download, Loader2 } from "lucide-react"

interface CanvasControlButtonsProps {
  baseImage: string | null
  tattooImage: string | null
  generatedImage: string | null
  isApplying: boolean
  isGenerating: boolean
  onApplyTattoo: () => void
  onReset: () => void
  onExportCanvas: () => void
  onDownloadResult: () => void
}

export function CanvasControlButtons({
  baseImage,
  tattooImage,
  generatedImage,
  isApplying,
  isGenerating,
  onApplyTattoo,
  onReset,
  onExportCanvas,
  onDownloadResult,
}: CanvasControlButtonsProps) {
  return (
    <div className="flex gap-2">
      {(baseImage || generatedImage) && tattooImage && (
        <Button onClick={onApplyTattoo} disabled={isApplying || isGenerating}>
          {isApplying || isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
      <Button variant="outline" size="sm" onClick={onReset}>
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
      <Button variant="outline" size="sm" onClick={onExportCanvas}>
        <Download className="w-4 h-4 mr-2" />
        Export Canvas
      </Button>
      {generatedImage && (
        <Button variant="default" size="sm" onClick={onDownloadResult}>
          <Download className="w-4 h-4 mr-2" />
          Download Result
        </Button>
      )}
    </div>
  )
}