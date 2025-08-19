"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Download } from "lucide-react"

interface KonvaPreviewCanvasProps {
  baseImage: string | null
  tattooImage: string | null
  bodyPart?: string
  onApplyTattoo: () => void
  isApplying: boolean
  onError?: (error: string) => void
}

// Dynamically import the Konva component with no SSR
const KonvaCanvas = dynamic(
  () => import("./konva-preview-canvas").then((mod) => ({ default: mod.KonvaPreviewCanvas })),
  { 
    ssr: false,
    loading: () => (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Preview Canvas</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full bg-gray-100 rounded-lg" style={{ minHeight: '500px' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-gray-500">Loading canvas...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

export function DynamicKonvaCanvas(props: KonvaPreviewCanvasProps) {
  return <KonvaCanvas {...props} />
}