"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface TattooControlsProps {
  tattooSize: number[]
  tattooRotation: number[]
  onSizeChange: (value: number[]) => void
  onRotationChange: (value: number[]) => void
}

export function TattooControls({
  tattooSize,
  tattooRotation,
  onSizeChange,
  onRotationChange,
}: TattooControlsProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Size: {tattooSize[0]}%</Label>
          <Slider
            value={tattooSize}
            onValueChange={onSizeChange}
            max={200}
            min={10}
            step={5}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Rotation: {tattooRotation[0]}°</Label>
          <Slider
            value={tattooRotation}
            onValueChange={onRotationChange}
            max={360}
            min={0}
            step={5}
            className="mt-2"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Drag the tattoo to reposition, use sliders to resize and rotate
      </p>
    </div>
  )
}