"use client";

import { Button } from "@heroui/button";
import { Upload, Palette, Zap, RotateCcw, Loader2, Download } from "lucide-react";
import { DownloadButton } from "@/components/ui/download-button";

interface MobileCanvasButtonsProps {
  baseImage: string | null;
  tattooImage: string | null;
  generatedImage: string | null;
  isApplying: boolean;
  isGenerating: boolean;
  onUploadDrawerOpen?: () => void;
  onTattooDrawerOpen?: () => void;
  onApplyTattoo: () => void;
  onReset: () => void;
}

export function MobileCanvasButtons({
  baseImage,
  tattooImage,
  generatedImage,
  isApplying,
  isGenerating,
  onUploadDrawerOpen,
  onTattooDrawerOpen,
  onApplyTattoo,
  onReset,
}: MobileCanvasButtonsProps) {
  if (!onUploadDrawerOpen || !onTattooDrawerOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile Upload Buttons - TOP */}
      <div className="absolute top-16 left-4 right-4 flex gap-2 lg:hidden z-50">
        <Button
          color="primary"
          variant="shadow"
          startContent={<Upload className="w-4 h-4" />}
          className="flex-1"
          onPress={onUploadDrawerOpen}
          disabled={isApplying}
          size="sm"
        >
          Upload Body
        </Button>
        <Button
          color="secondary"
          variant="shadow"
          startContent={<Palette className="w-4 h-4" />}
          className="flex-1"
          onPress={onTattooDrawerOpen}
          disabled={isApplying}
          size="sm"
        >
          Upload/Gen. Tattoo
        </Button>
      </div>

      {/* Mobile Control Buttons - BOTTOM */}
      <div className="absolute bottom-4 left-4 right-4 lg:hidden z-40">
        <div className="flex gap-2">
          {/* Generate button - only show when both base and tattoo exist */}
          {(baseImage || generatedImage) && tattooImage && (
            <Button
              onPress={onApplyTattoo}
              disabled={isApplying || isGenerating}
              className="flex-1"
              color="primary"
              variant="shadow"
              size="sm"
            >
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
          
          <Button
            variant="shadow"
            onPress={onReset}
            className="flex-1"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          {generatedImage && (
            <DownloadButton
              src={generatedImage}
              filename="generated-tattoo-result.png"
              variant="solid"
              size="sm"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </DownloadButton>
          )}
        </div>
      </div>
    </>
  );
}